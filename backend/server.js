require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// connect to database
const db = new sqlite3.Database('./data/data.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

function signToken(user) {
  return jwt.sign(
    { userId: user.id, isAdmin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware to check if user is logged in
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, isAdmin }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to check if user is admin
function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

// =================== EVENTS ===================

// Get all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY date ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Get one event by id
app.get('/api/events/:id', (req, res) => {
  db.get('SELECT * FROM events WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'Event not found' });
    res.json(row);
  });
});

// Admin: create event
app.post('/api/admin/events', authMiddleware, adminMiddleware, (req, res) => {
  const { title, description, date, location } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'Missing fields' });

  db.run(
    'INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)',
    [title, description, date, location],
    function(err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ id: this.lastID, title, description, date, location });
    }
  );
});

// Admin: edit event
app.put('/api/admin/events/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { title, description, date, location } = req.body;
  db.run(
    'UPDATE events SET title=?, description=?, date=?, location=? WHERE id=?',
    [title, description, date, location, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Event not found' });
      res.json({ success: true });
    }
  );
});

// Admin: delete event
app.delete('/api/admin/events/:id', authMiddleware, adminMiddleware, (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  });
});

// =================== REGISTRATIONS ===================

// Register for an event (with duplicate check)
app.post('/api/registrations', authMiddleware, (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.userId;

  if (!event_id) {
    return res.status(400).json({ error: 'Event ID required' });
  }

  // Check if already registered
  db.get(
    'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
    [user_id, event_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (row) return res.status(400).json({ error: 'Already registered' });

      // Insert new registration
      db.run(
        'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
        [user_id, event_id],
        function(err) {
          if (err) return res.status(500).json({ error: 'DB error' });
          res.json({
            success: true,
            id: this.lastID,
            event_id,
            user_id,
          });
        }
      );
    }
  );
});

// Get registrations for logged-in user
app.get('/api/registrations', authMiddleware, (req, res) => {
  const user_id = req.user.userId;

  db.all(
    `SELECT r.id, r.created_at, e.title, e.description, e.date, e.location
     FROM registrations r
     JOIN events e ON r.event_id = e.id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

// =================== AUTH ===================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, 0)`;

    db.run(sql, [name, email, hashed], function (err) {
      if (err) {
        console.error("❌ Registration failed:", err.message); // <-- this shows real error in terminal
        return res.status(400).json({ error: err.message });   // <-- send exact error to frontend
      }
      const user = { id: this.lastID, name, email, is_admin: 0 };
      res.json({ user, token: signToken(user) });
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (!row) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({
      user: { id: row.id, name: row.name, email: row.email, is_admin: row.is_admin },
      token: signToken(row)
    });
  });
});

// =================== SERVER START ===================

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
