import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EventDetails({ token }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/api/events/${id}`).then(r=>r.json()).then(setEvent).catch(()=>setEvent(null));
  }, [id]);

  const register = async () => {
    if (!token) { setMsg("Please login first"); return; }
    try {
      const res = await fetch("http://localhost:4000/api/registrations", {
        method:"POST", headers: {"Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ event_id: id })
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Registration failed"); return; }
      setMsg("Registered successfully!");
    } catch { setMsg("Cannot reach backend"); }
  };

  if (!event) return <div style={{ padding:28 }}>Loading...</div>;

  return (
    <div style={{ minHeight:"calc(100vh - 72px)", padding:28, display:"flex", justifyContent:"center" }}>
      <div style={{ maxWidth:880, width:"100%", background:"linear-gradient(180deg,#05050a,#0b0c11)", padding:26, borderRadius:14 }}>
        <h1 style={{ color:"#cfffff" }}>{event.title}</h1>
        <p style={{ color:"#d0d0d0" }}>{event.description}</p>
        <p style={{ color:"#adadad" }}>📅 {new Date(event.date).toLocaleString()}</p>
        <p style={{ color:"#adadad" }}>📍 {event.location}</p>

        <div style={{ marginTop:16 }}>
          <button onClick={register} style={{
            padding:"12px 18px", borderRadius:10, border:"none", fontWeight:800,
            background:"linear-gradient(90deg,#00f0ff,#b66bff)", color:"#030303"
          }}>Register</button>
        </div>

        {msg && <div style={{ marginTop:12, color:"#ffd9d9" }}>{msg}</div>}
      </div>
    </div>
  );
}

