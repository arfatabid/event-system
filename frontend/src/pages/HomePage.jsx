export default function HomePage() {
  return (
    <div style={{ minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 36 }}>
      <div style={{ textAlign: "center", maxWidth: 960 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{
            width:120, height:120, margin:"0 auto", borderRadius:20,
            background: "radial-gradient(circle at 30% 20%, rgba(0,240,255,0.18), transparent 20%), radial-gradient(circle at 80% 80%, rgba(182,107,255,0.12), transparent 30%), linear-gradient(180deg,#091018,#050308)",
            display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,240,255,0.06)"
          }}>
            <div style={{ fontSize:42, color:"#00f0ff", textShadow:"0 0 30px rgba(0,240,255,0.2)" }}>⚡</div>
          </div>
        </div>

        <h1 style={{ fontSize:48, margin:12, background:"linear-gradient(90deg,#00f0ff,#b66bff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textShadow:"0 0 40px rgba(0,240,255,0.12)" }}>
          Welcome to <span style={{ color:"#fff" }}>Event</span><span style={{ color:"#b66bff" }}>Hub</span>
        </h1>

        <p style={{ color:"#bfbfbf", maxWidth:760, margin:"12px auto 28px", lineHeight:1.6 }}>
          Discover and register for exciting events — smooth, fast and futuristic.
          EventHub gives you a neon-styled dashboard to manage events and registrations.
        </p>

        <a href="/events" style={{
          display:"inline-block", padding:"14px 32px", borderRadius:30, fontWeight:800, color:"#030303",
          background:"linear-gradient(90deg,#00f0ff,#b66bff)", boxShadow:"0 18px 60px rgba(0,240,255,0.08), 0 0 40px rgba(182,107,255,0.06)",
          transform:"translateZ(0)"
        }}>
          🚀 Explore Events
        </a>
      </div>
    </div>
  );
}

