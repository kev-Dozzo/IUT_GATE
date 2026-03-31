import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import campusLogo from "../../assets/public/logo.png";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Annonces", path: "/annonces" },
  { label: "Filières", path: "/filieres" },
  { label: "Enseignants", path: "/enseignants" },
  { label: "Départements", path: "/departements" },
  { label: "Services", path: "/services" },
  { label: "Carte", path: "/carte" },
  { label: "À propos", path: "/apropos" },
];
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          background: "var(--navy)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,.07)",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <img
            src={`${campusLogo}`}
            alt="IUTGate"
            style={{
              width: 60,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid var(--cyan)",
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Links desktop */}
        <div className="desktop-only" style={{ gap: 22 }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <span
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? "var(--cyan)" : "#94a3b8",
                  cursor: "pointer",
                  transition: "color .2s",
                  borderBottom: isActive
                    ? "2px solid var(--cyan)"
                    : "2px solid transparent",
                  paddingBottom: 2,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.color = "#94a3b8";
                }}
              >
                {link.label}
              </span>
            );
          })}
        </div>

        {/* CTA desktop + hamburger mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="desktop-only"
            onClick={() => navigate("/admin/login")}
            style={{
              background: "var(--cyan)",
              color: "var(--cyan-text)",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Espace Admin
          </button>

          {/* Hamburger */}
          <button
            className="mobile-only"
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              padding: 4,
            }}
          >
            {open ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--navy)",
            zIndex: 9999, // ← c'est ça qui manquait
            display: "flex",
            flexDirection: "column",
            padding: "20px 24px",
            gap: 4,
            overflowY: "auto",
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <div
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setOpen(false);
                }}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: isActive ? "rgba(6,182,212,.15)" : "transparent",
                  borderLeft: isActive
                    ? "3px solid var(--cyan)"
                    : "3px solid transparent",
                  fontFamily: "var(--font-head)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: isActive ? "var(--cyan)" : "#94a3b8",
                  transition: "all .2s",
                }}
              >
                {link.label}
              </div>
            );
          })}

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.1)",
              marginTop: 12,
              paddingTop: 12,
            }}
          >
            <button
              onClick={() => {
                navigate("/admin/login");
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "13px",
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
              Espace Admin
            </button>
          </div>
        </div>
      )}
    </>
  );
}
