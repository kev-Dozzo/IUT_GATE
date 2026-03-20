import { useState, useEffect } from "react";
import {
  MdSearch,
  MdClose,
  MdPeople,
  MdSchool,
  MdAccountBalance,
  MdArrowForward,
  MdBook,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getDepartements } from "../../services/departementService";

const DEPT_COLORS = [
  { bg: "#cffafe", color: "#0e7490", border: "#67e8f9" },
  { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
  { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
];

export default function DepartementsPage() {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getDepartements()
      .then((data) => setDepartements(data))
      .catch(() => setError("Impossible de charger les départements."))
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

      {/* ── HEADER ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "48px 32px",
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
              fontSize: 36,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.8,
              marginBottom: 8,
            }}
          >
            Nos Départements
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Découvrez les départements qui composent l'IUT et leurs filières.
          </p>

          {/* Search */}
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

      {/* ── CONTENT ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}
      >
        {/* Compteur */}
        {!loading && !error && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {filtered.length} département{filtered.length > 1 ? "s" : ""} trouvé
            {filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {/* Loading */}
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
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Chargement des départements...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#fee2e2",
              borderRadius: 12,
              border: "1px solid #fca5a5",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                color: "#991b1b",
                marginBottom: 8,
              }}
            >
              {error}
            </p>
            <p style={{ fontSize: 13, color: "#b91c1c" }}>
              Vérifiez que le serveur backend est bien démarré.
            </p>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--muted)",
            }}
          >
            <MdAccountBalance
              size={48}
              style={{ opacity: 0.3, marginBottom: 16 }}
            />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucun département trouvé
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Essayez un autre mot-clé.
            </p>
          </div>
        )}

        {/* Grille départements */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-2">
            {filtered.map((dept, i) => {
              const col = DEPT_COLORS[i % DEPT_COLORS.length];
              return (
                <div
                  key={dept.id_departement}
                  onClick={() => setSelected(dept)}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "28px",
                    cursor: "pointer",
                    transition: "all .25s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = col.border;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 36px ${col.bg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: col.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MdAccountBalance size={26} color={col.color} />
                    </div>

                    {/* Stats badges */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 6,
                      }}
                    >
                      {dept.enseignants_count !== undefined && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "var(--font-head)",
                            background: "#f1f5f9",
                            color: "var(--muted)",
                          }}
                        >
                          <MdPeople size={11} />
                          {dept.enseignants_count} enseignant
                          {dept.enseignants_count > 1 ? "s" : ""}
                        </span>
                      )}
                      {dept.filieres_count !== undefined && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "var(--font-head)",
                            background: col.bg,
                            color: col.color,
                          }}
                        >
                          <MdBook size={11} />
                          {dept.filieres_count} filière
                          {dept.filieres_count > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nom */}
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "var(--text)",
                      lineHeight: 1.3,
                    }}
                  >
                    {dept.nom}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--muted)",
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {dept.description?.slice(0, 120)}
                    {dept.description?.length > 120 ? "..." : ""}
                  </p>

                  {/* CTA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: col.color,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-head)",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: 14,
                    }}
                  >
                    Voir les filières <MdArrowForward size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL DÉTAIL ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(12,26,64,.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "36px",
              width: "100%",
              maxWidth: 560,
              maxHeight: "85vh",
              overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
            {/* Close */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 20,
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <MdClose size={18} color="var(--muted)" />
              </button>
            </div>

            {/* Header modal */}
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdAccountBalance size={30} color="var(--cyan-dark)" />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 8,
                  }}
                >
                  {selected.nom}
                </h2>
                <div style={{ display: "flex", gap: 8 }}>
                  {selected.enseignants_count !== undefined && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: "#f1f5f9",
                        color: "var(--muted)",
                      }}
                    >
                      <MdPeople size={11} />
                      {selected.enseignants_count} enseignants
                    </span>
                  )}
                  {selected.filieres_count !== undefined && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: "var(--cyan-light)",
                        color: "var(--cyan-dark)",
                      }}
                    >
                      <MdBook size={11} />
                      {selected.filieres_count} filières
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--cyan)",
                  fontFamily: "var(--font-head)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Description
              </p>
              <p
                style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.8 }}
              >
                {selected.description}
              </p>
            </div>

            {/* Filières du département */}
            {selected.filieres?.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--cyan)",
                    fontFamily: "var(--font-head)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 12,
                  }}
                >
                  Filières rattachées
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {selected.filieres.map((f) => (
                    <div
                      key={f.id_filiere}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f8fafc",
                        borderRadius: 10,
                        padding: "12px 16px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <MdSchool size={16} color="var(--cyan-dark)" />
                        <span
                          style={{
                            fontFamily: "var(--font-head)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text)",
                          }}
                        >
                          {f.nom}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          background: "var(--cyan-light)",
                          color: "var(--cyan-dark)",
                        }}
                      >
                        {f.duree}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
