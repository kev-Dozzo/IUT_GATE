import { useNavigate } from "react-router-dom";
import { MdHome, MdArrowBack } from "react-icons/md";
import Navbar from "../../components/layout/Navbar";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdfe, #cffafe)",
          padding: 32,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          {/* 404 */}
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 120,
              fontWeight: 800,
              lineHeight: 1,
              background: "linear-gradient(135deg, #0c1a40, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}
          >
            404
          </div>

          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 12,
            }}
          >
            Page introuvable
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: 36,
            }}
          >
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 22px",
                background: "transparent",
                color: "var(--blue)",
                border: "1.5px solid var(--blue)",
                borderRadius: 10,
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <MdArrowBack size={16} /> Retour
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 22px",
                background: "var(--cyan)",
                color: "var(--cyan-text)",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <MdHome size={16} /> Accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
