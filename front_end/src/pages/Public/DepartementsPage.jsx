import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdClose,
  MdAccountBalance,
  MdPeople,
  MdSchool,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getDepartements } from "../../services/departementService";

const BASE_URL = "http://localhost:5000";

const DEPT_COLORS = [
  { bg: "#cffafe", color: "#0e7490", border: "#67e8f9" },
  { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
  { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
];

export default function DepartementsPage() {
  const navigate = useNavigate();
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDepartements()
      .then((data) => setDepartements(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = departements.filter(
    (d) =>
      d.nom?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(32px, 6vw, 56px) 24px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Structure académique
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Nos Départements
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Explorez les départements de l'IUT de Douala.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,.95)",
              borderRadius: 10,
              padding: "10px 16px",
              maxWidth: 480,
              boxShadow: "0 4px 24px rgba(0,0,0,.2)",
            }}
          >
            <MdSearch
              size={18}
              style={{ color: "var(--subtle)", flexShrink: 0 }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un département..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                background: "transparent",
                color: "var(--text)",
              }}
            />
            {search && (
              <MdClose
                size={16}
                style={{ color: "var(--subtle)", cursor: "pointer" }}
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </div>
      </section>

      <section className="page-container">
        {!loading && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {filtered.length} département{filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        <div className="grid-2">
          {!loading &&
            filtered.map((dept, i) => {
              const col = DEPT_COLORS[i % DEPT_COLORS.length];
              const logoSrc = dept.photo_url
                ? `${BASE_URL}${dept.photo_url}`
                : null;

              return (
                <div
                  key={dept.id_departement}
                  onClick={() =>
                    navigate(`/departements/${dept.id_departement}`)
                  }
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,.06)",
                    transition: "all .25s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0 16px 40px ${col.bg}`;
                    e.currentTarget.style.borderColor = col.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,.06)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {/* ── BANDE COULEUR + LOGO ── */}
                  <div
                    style={{
                      background: col.bg,
                      padding: "28px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      borderBottom: `1px solid ${col.border}`,
                    }}
                  >
                    {/* Logo / Icône */}
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={dept.nom}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 14,
                          objectFit: "contain",
                          background: "#fff",
                          padding: 6,
                          border: `2px solid ${col.border}`,
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Icône fallback */}
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        background: "#fff",
                        display: logoSrc ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${col.border}`,
                        flexShrink: 0,
                      }}
                    >
                      <MdAccountBalance size={32} color={col.color} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 800,
                          fontSize: "clamp(15px, 2.5vw, 18px)",
                          color: col.color,
                          lineHeight: 1.3,
                          marginBottom: 4,
                        }}
                      >
                        {dept.nom}
                      </h3>
                      <div
                        style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                      >
                        {dept.filieres_count !== undefined && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              color: col.color,
                              opacity: 0.8,
                            }}
                          >
                            <MdSchool size={12} /> {dept.filieres_count} filière
                            {dept.filieres_count > 1 ? "s" : ""}
                          </span>
                        )}
                        {dept.enseignants_count !== undefined && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              color: col.color,
                              opacity: 0.8,
                            }}
                          >
                            <MdPeople size={12} /> {dept.enseignants_count}{" "}
                            enseignant{dept.enseignants_count > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── DESCRIPTION ── */}
                  <div
                    style={{
                      padding: "18px 22px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        lineHeight: 1.7,
                        flex: 1,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {dept.description || "Département de l'IUT de Douala."}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 5,
                        fontSize: 12,
                        color: col.color,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        paddingTop: 10,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      Voir le département <MdArrowForward size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <Footer />
    </div>
  );
}
