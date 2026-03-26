import React from "react";

function Developer() {
  const skills = ["MongoDB", "Express.js", "React.js", "Node.js", "REST API", "JWT Auth"];

  return (
    <div style={localStyles.container}>
      <div style={localStyles.profileCard}>
        <div style={localStyles.gradientHeader}></div>
        <img 
          src="https://ui-avatars.com/api/?name=Karthik&background=6366f1&color=fff&size=128" 
          alt="Developer" 
          style={localStyles.avatar} 
        />
        <h1 style={localStyles.name}>Karthik Ithikash</h1>
        <p style={localStyles.role}>Full Stack MERN Developer</p>
        
        <div style={localStyles.bio}>
          "I am a passionate developer focused on building community-driven solutions. 
          TimeBank was developed to streamline time economy using the MERN stack."
        </div>

        <div style={localStyles.skillsWrapper}>
          {skills.map(skill => (
            <span key={skill} style={localStyles.skillBadge}>{skill}</span>
          ))}
        </div>

        <div style={localStyles.divider} />

        <div style={localStyles.links}>
          <a href="https://github.com/KarthikIthikash12" target="_blank" rel="noreferrer" style={localStyles.link}>GitHub</a>
          <a href="https://www.linkedin.com/in/karthik-ithikash/" target="_blank" rel="noreferrer" style={localStyles.link}>LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

const localStyles = {
  container: { display: "flex", justifyContent: "center", padding: "60px 20px" },
  profileCard: { 
    background: "#fff", 
    width: "100%", 
    maxWidth: "450px", 
    borderRadius: "30px", 
    overflow: "hidden", 
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)", 
    textAlign: "center",
    position: "relative"
  },
  gradientHeader: { height: "120px", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" },
  avatar: { width: "100px", height: "100px", borderRadius: "25px", border: "4px solid #fff", marginTop: "-50px", objectFit: "cover", margin: "0 auto" },
  name: { fontSize: "24px", fontWeight: "800", color: "#1e293b", marginTop: "15px", marginBottom: "5px" },
  role: { color: "#6366f1", fontWeight: "600", fontSize: "14px", marginBottom: "20px" },
  bio: { padding: "0 30px", color: "#64748b", fontSize: "15px", lineHeight: "1.6", fontStyle: "italic" },
  skillsWrapper: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", padding: "20px 30px" },
  skillBadge: { background: "#f1f5f9", color: "#475569", padding: "6px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "600" },
  divider: { height: "1px", background: "#f1f5f9", margin: "10px 40px" }, 
  links: { padding: "20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: "20px" },
  link: { textDecoration: "none", color: "#6366f1", fontWeight: "700", fontSize: "14px" }
};

export default Developer;