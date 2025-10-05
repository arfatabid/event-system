import { useEffect, useState } from "react";

export default function MyRegistrations({ token }) {
  const [regs, setRegs] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) { setErr("Please login"); return; }
    fetch("http://localhost:4000/api/registrations", { headers: { Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(data => { if (data.error) setErr(data.error); else setRegs(data); })
      .catch(()=>setErr("Cannot reach backend"));
  }, [token]);

  return (
    <div style={{ minHeight:"calc(100vh - 72px)", padding:28 }}>
      <h1 style={{ color:"#cfffff", textAlign:"center" }}>My Registrations</h1>
      {err && <div style={{ textAlign:"center", color:"#ffb4b4", marginTop:12 }}>{err}</div>}
      <div style={{ marginTop:20, display:"grid", gap:14 }}>
        {regs.map(r => (
          <div key={r.id} style={{ background:"linear-gradient(180deg,#06060a,#0d0d11)", padding:14, borderRadius:12 }}>
            <h3 style={{ color:"#9ffeff" }}>{r.title}</h3>
            <p style={{ color:"#cfcfcf" }}>{r.description}</p>
            <p style={{ color:"#adadad" }}>📅 {new Date(r.date).toLocaleString()}</p>
            <p style={{ color:"#9affb7" }}>Registered: {new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))}
        {regs.length===0 && !err && <div style={{ textAlign:"center", color:"#bfbfbf" }}>No registrations yet</div>}
      </div>
    </div>
  );
}
