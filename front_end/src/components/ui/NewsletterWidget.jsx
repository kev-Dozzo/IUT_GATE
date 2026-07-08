import { useState } from "react";
import api from "../../services/api";

export default function NewsletterWidget({ compact = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success")
    return (
      <div>
        <p
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            color: "var(--cyan)",
            fontSize: 14,
          }}
        >
          ✓ Abonnement confirmé !
        </p>
        <p
          style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}
        >
          Vous recevrez les prochaines actualités.
        </p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit}>
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "rgba(255,255,255,.5)",
          fontFamily: "var(--font-head)",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 8,
        }}
      >
        Inscrivez-vous à
      </p>
      <p
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: 20,
          color: "#fff",
          marginBottom: 16,
        }}
      >
        la Newsletter et restez informer sur l'actualites de L'IUT  
      </p>
      <div
        style={{
          position: "relative",
          borderBottom: "1.5px solid rgba(255,255,255,.3)",
          paddingBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse mail"
          required
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            padding: "4px 0",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "none",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            fontSize: 14,
            color: loading ? "rgba(255,255,255,.3)" : "var(--cyan)",
            letterSpacing: 1,
            padding: 0,
            transition: "color .2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cyan)")}
        >
          {loading ? "..." : "OK"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ fontSize: 11, color: "#fca5a5", marginTop: 6 }}>
          Erreur. Réessayez.
        </p>
      )}
    </form>
  );
}
