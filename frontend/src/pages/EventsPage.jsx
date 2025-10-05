import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function EventsPage({ token }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then(r=>r.json()).then(setEvents).catch(()=>setEvents([]));
  }, []);
  return (
    <div style={{ minHeight:"calc(100vh - 72px)", padding:28 }}>
      <h1 style={{ color:"#cfffff", textShadow:"0 0 18px rgba(0,240,255,0.12)", marginBottom:20, textAlign:"center", fontSize:34 }}>✨ Upcoming Events</h1>
      <div style={{ display:"grid", gap:18, gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))" }}>
        {events.map(ev => (
          <div key={ev.id} style={{
            background:"linear-gradient(180deg,#05050a,#0b0c11)", border:"1px solid rgba(0,240,255,0.06)",
            padding:18, borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.6), 0 0 25px rgba(0,240,255,0.06)"
          }}>
            <h2 style={{ color:"#9ffeff", margin:0 }}>{ev.title}</h2>
            <p style={{ color:"#cfcfcf", marginTop:8 }}>{ev.description}</p>
            <p style={{ color:"#aeaeae", marginTop:8, fontSize:13 }}>📅 {new Date(ev.date).toLocaleString()}</p>
            <p style={{ color:"#aeaeae", fontSize:13 }}>📍 {ev.location}</p>
            <div style={{ marginTop:12 }}>
              <Link to={`/events/${ev.id}`} style={{
                display:"inline-block", padding:"10px 14px", borderRadius:10, fontWeight:700, color:"#020203",
                background:"linear-gradient(90deg,#00f0ff,#b66bff)"
              }}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
