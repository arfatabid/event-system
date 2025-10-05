import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetails from "./pages/EventDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyRegistrations from "./pages/MyRegistrations";
import AdminPage from "./pages/AdminPage";
import './neonTheme.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <Router>
      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-left">
          <div className="logo-3d">
            <div className="logo-shine">⚡</div>
            <div className="logo-text">
              <span className="logo-cyan">Event</span><span className="logo-purple">Hub</span>
            </div>
          </div>
        </div>

        <div className="nav-right">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/events">Events</Link>
          {user && <Link className="nav-link" to="/my-registrations">My Registrations</Link>}
          {user?.is_admin === 1 && <Link className="nav-link" to="/admin">Admin</Link>}
          {!user ? (
            <>
              <Link className="nav-btn" to="/login">Login</Link>
              <Link className="nav-btn" to="/register">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-btn logout">Logout</button>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <div className="app-bg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage token={token} />} />
          <Route path="/events/:id" element={<EventDetails token={token} user={user} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} setToken={setToken} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} setToken={setToken} />} />
          <Route path="/my-registrations" element={<MyRegistrations token={token} />} />
          <Route path="/admin" element={<AdminPage token={token} />} />
        </Routes>
      </div>

      {/* CSS for theme (kept here so you can paste quickly into project) */}
      <style>{`
        :root{
          --bg:#020204;
          --panel:#0f1116;
          --cyan:#00f0ff;
          --purple:#b66bff;
          --muted:#a6a6a6;
        }
        body,html,#root { height:100%; margin:0; font-family:Inter, system-ui, Arial; background:var(--bg); }

        .nav{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 28px;
          border-bottom:1px solid rgba(102, 51, 153, 0.08);
          backdrop-filter:blur(6px);
          position:sticky; top:0; z-index:50;
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
        }
        .nav-left{ display:flex; align-items:center; gap:14px; }
        .logo-3d{ display:flex; align-items:center; gap:10px; }
        .logo-shine{
          width:56px; height:56px; border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-size:28px;
          background:linear-gradient(135deg, rgba(0,240,255,0.18), rgba(182,107,255,0.12));
          box-shadow: 0 6px 30px rgba(0,240,255,0.14), inset 0 -6px 18px rgba(182,107,255,0.06);
          color:var(--cyan);
          transform:translateZ(0);
        }
        .logo-text{ font-weight:800; font-size:20px; letter-spacing:0.6px; display:flex; gap:6px; align-items:center;}
        .logo-cyan{ color:var(--cyan); text-shadow:0 0 12px rgba(0,240,255,0.25); }
        .logo-purple{ color:var(--purple); text-shadow:0 0 18px rgba(182,107,255,0.18); }

        .nav-right{ display:flex; align-items:center; gap:18px; }
        .nav-link{ color:#ddd; text-decoration:none; font-size:15px; padding:6px 8px; border-radius:6px; }
        .nav-link:hover{ color:white; text-shadow:0 0 12px rgba(0,240,255,0.12); }

        .nav-btn{
          background:linear-gradient(90deg,var(--cyan),var(--purple));
          color:#050405; padding:8px 14px; border-radius:10px; font-weight:700; text-decoration:none; border:none; cursor:pointer;
          box-shadow: 0 8px 30px rgba(0,240,255,0.12), 0 2px 8px rgba(182,107,255,0.06);
        }
        .nav-btn.logout{ background:linear-gradient(90deg,#ff7b7b,#ff4b4b); color:#fff; box-shadow:0 8px 30px rgba(255,120,120,0.12); }
        .nav-btn:hover{ transform:translateY(-2px); }

        .app-bg{ min-height:calc(100vh - 72px); }
        /* utility */
        .center { display:flex; align-items:center; justify-content:center; }
      `}</style>
    </Router>
  );
}

export default App;
