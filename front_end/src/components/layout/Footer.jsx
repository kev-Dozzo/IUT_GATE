import { useNavigate } from "react-router-dom";

const cols = [
  {
    title: "Navigation",
    links: [
      { label: "Accueil", path: "/" },
      { label: "Annonces", path: "/annonces" },
      { label: "Filières", path: "/filieres" },
      { label: "À propos", path: "/apropos" },
    ],
  },
  {
    title: "Campus",
    links: [
      { label: "Enseignants", path: "/enseignants" },
      { label: "Services", path: "/services" },
      { label: "Carte", path: "/carte" },
    ],
  },
  { title: "Admin", links: [{ label: "Espace Admin", path: "/admin/login" }] },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: "var(--navy)",
        padding: "48px 24px 24px",
        marginTop: 64,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Grid responsive */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 32,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <img
                src="/logo.png"
                alt="IUTGate"
                style={{
                  width: 44,
                  height: 25,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--cyan)",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#94a3b8",
                lineHeight: 1.7,
                maxWidth: 220,
              }}
            >
              Le portail numérique de l'Institut Universitaire de Technologie de
              Douala.
            </p>
          </div>

          {/* Colonnes */}
          {cols.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                {col.title}
              </p>
              {col.links.map((link) => (
                <p
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 10,
                    cursor: "pointer",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--cyan)")}
                  onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                >
                  {link.label}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          <span>© 2026 IUT GATE – Institut Universitaire de Technologie</span>
          <span>Douala, Cameroun</span>
        </div>
      </div>
    </footer>
  );
}
