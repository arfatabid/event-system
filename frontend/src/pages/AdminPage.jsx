import { useEffect, useState } from "react";

export default function AdminPage({ token }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", date:"", location:"" });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => {
    fetch("http://localhost:4000/api/events").then(r=>r.json()).then(setEvents).catch(()=>setEvents([]));
  };
  useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    const url = editing ? `http://localhost:4000/api/admin/events/${editing}` : "http://localhost:4000/api/admin/events";
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Failed"); return; }
      setMsg(editing? "Updated":"Created"); setForm({ title:"", description:"", date:"", location:"" }); setEditing(null); load();
    } catch { setMsg("Cannot reach backend"); }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/events/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` }});
      if (!res.ok) { setMsg("Delete failed"); return; }
      setMsg("Deleted"); load();
    } catch { setMsg("Cannot reach backend"); }
  };

  return (
    <div style={{ minHeight:"calc(100vh - 72px)", padding:28 }}>
      <h1 style={{ color:"#cfffff", textAlign:"center" }}>Admin Panel</h1>
      {msg && <div style={{ textAlign:"center", color:"#b4ffd9", margin:8 }}>{msg}</div>}

      <form onSubmit={submit} style={{ maxWidth:900, margin:"18px auto 30px", display:"grid", gap:10, background:"#0b0c11", padding:16, borderRadius:12 }}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inputStyle} required />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={inputStyle} />
        <input type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inputStyle} required />
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={inputStyle} />
        <div style={{ display:"flex", gap:10 }}>
          <button style={primaryBtn} type="submit">{editing? "Update Event":"Add Event"}</button>
          <button type="button" onClick={()=>{ setForm({title:"",description:"",date:"",location:""}); setEditing(null); }} style={{ ...primaryBtn, background:"#444" }}>Clear</button>
        </div>
      </form>

      <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gap:10 }}>
        {events.map(ev => (
          <div key={ev.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(180deg,#05050a,#0b0c11)", padding:12, borderRadius:10 }}>
            <div>
              <h3 style={{ color:"#9ffeff", margin:0 }}>{ev.title}</h3>
              <p style={{ color:"#cfcfcf", margin:6 }}>{ev.description}</p>
              <p style={{ color:"#adadad", fontSize:13 }}>{new Date(ev.date).toLocaleString()} • {ev.location}</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{ setEditing(ev.id); setForm({ title:ev.title, description:ev.description, date:ev.date, location:ev.location }); }} style={{ padding:"8px 10px", borderRadius:8, background:"#ffd86b", border:"none" }}>Edit</button>
              <button onClick={()=>remove(ev.id)} style={{ padding:"8px 10px", borderRadius:8, background:"#ff6b6b", border:"none" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { background:"#0b0c0f", color:"#fff", padding:"10px 12px", borderRadius:8, border:"1px solid rgba(182,107,255,0.04)" };
const primaryBtn = { background:"linear-gradient(90deg,#00f0ff,#b66bff)", padding:"10px 14px", borderRadius:8, color:"#020203", border:"none", fontWeight:800 };

