import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage({ setUser, setToken }) {
  const [name,setName] = useState(""); const [email,setEmail] = useState(""); const [password,setPassword] = useState("");
  const [msg,setMsg] = useState(""); const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Register failed"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token); setUser(data.user);
      navigate("/events");
    } catch (err) { setMsg("Cannot reach backend"); }
  };

  return (
    <div style={{ minHeight:"calc(100vh - 72px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:420, background:"#0c0d11", padding:28, borderRadius:14, boxShadow:"0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,240,255,0.06)" }}>
        <h2 style={{ margin:0, marginBottom:14, color:"#dffaff", fontSize:24 }}>📝 Register</h2>
        {msg && <div style={{ color:"#ffb4b4", marginBottom:10 }}>{msg}</div>}

        <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={inputStyle} required />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={inputStyle} required />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={inputStyle} type="password" required />
          <button style={primaryBtn}>Register</button>
        </form>

        <div style={{ marginTop:12, color:"#bdbdbd" }}>
          Already registered? <Link to="/login" style={{ color:"#d9faff" }}>Login</Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background:"#0b0c0f", border:"1px solid rgba(182,107,255,0.06)", color:"#fff", padding:"12px 14px", borderRadius:10, outline:"none"
};
const primaryBtn = {
  background:"linear-gradient(90deg,#00f0ff,#b66bff)", border:"none", padding:"12px 16px", borderRadius:10, fontWeight:800, color:"#020202"
};

