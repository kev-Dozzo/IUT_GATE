import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdAccessTime,
  MdPeople,
  MdSchool,
  MdArrowForward,
  MdClose,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getFilieres } from "../../services/filiereService";

const dureeColors = {
  "2 ans": { bg: "#d1fae5", color: "#065f46" },
  "3 ans": { bg: "#cffafe", color: "#164e63" },
  "4 ans": { bg: "#ede9fe", color: "#5b21b6" },
};

export default function FilieresPage() {
 // const navigate = useNavigate();
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getFilieres()
      .then((data) => setFilieres(data))
      .catch(() => setError("Impossible de charger les filières."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filieres.filter(
    (f) =>
      f.nom?.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()),
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
            Formations
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
            Nos Filières
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Découvrez nos programmes de formation professionnelle et académique.
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
              placeholder="Rechercher une filière..."
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
      <section className="page-container">
        {/* Compteur */}
        {!loading && !error && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {filtered.length} filière{filtered.length > 1 ? "s" : ""} disponible
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
              Chargement des filières...
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
            <MdSchool size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucune filière trouvée
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Essayez un autre mot-clé.
            </p>
          </div>
        )}

        {/* Grille filières */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-auto">
            {filtered.map((filiere) => {
              const duree = dureeColors[filiere.duree] || dureeColors["3 ans"];
              return (
                <div
                  key={filiere.id_filiere}
                  onClick={() => setSelected(filiere)}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "26px",
                    cursor: "pointer",
                    transition: "all .25s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 36px rgba(6,182,212,.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Header card */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 13,
                        background: "var(--cyan-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MdSchool size={24} color="var(--cyan-dark)" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          background: duree.bg,
                          color: duree.color,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MdAccessTime size={11} />
                        {filiere.duree}
                      </span>
                      {filiere.places && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--subtle)",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <MdPeople size={12} />
                          {filiere.places} places
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nom */}
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text)",
                      lineHeight: 1.3,
                    }}
                  >
                    {filiere.nom}
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
                    {filiere.description?.slice(0, 110)}
                    {filiere.description?.length > 110 ? "..." : ""}
                  </p>

                  {/* Admission */}
                  {filiere.condition_admission && (
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: 12,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--subtle)",
                          fontFamily: "var(--font-head)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 4,
                        }}
                      >
                        Conditions d'admission
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#475569",
                          lineHeight: 1.5,
                        }}
                      >
                        {filiere.condition_admission}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--cyan)",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-head)",
                    }}
                  >
                    Voir les détails <MdArrowForward size={14} />
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
            {/* Header modal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "var(--cyan-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MdSchool size={26} color="var(--cyan-dark)" />
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#0f172a",
                      lineHeight: 1.2,
                    }}
                  >
                    {selected.nom}
                  </h2>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: (
                          dureeColors[selected.duree] || dureeColors["3 ans"]
                        ).bg,
                        color: (
                          dureeColors[selected.duree] || dureeColors["3 ans"]
                        ).color,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MdAccessTime size={11} /> {selected.duree}
                    </span>
                    {selected.places && (
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          background: "#f1f5f9",
                          color: "#475569",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MdPeople size={11} /> {selected.places} places
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
                  flexShrink: 0,
                }}
              >
                <MdClose size={18} color="var(--muted)" />
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--cyan)",
                  fontFamily: "var(--font-head)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                Description
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.8,
                }}
              >
                {selected.description}
              </p>
            </div>

            {/* Conditions admission */}
            {selected.condition_admission && (
              <div
                style={{
                  background: "var(--cyan-light)",
                  borderRadius: 12,
                  padding: "16px 20px",
                  border: "1px solid #67e8f9",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--cyan-dark)",
                    fontFamily: "var(--font-head)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  Conditions d'admission
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--cyan-text)",
                    lineHeight: 1.7,
                  }}
                >
                  {selected.condition_admission}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
