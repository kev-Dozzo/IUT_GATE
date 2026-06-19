import { useState, useEffect } from "react";
import {
  MdSearch,
  MdClose,
  MdPeople,
  MdEmail,
  MdSchool,
  MdArrowForward,
  MdFilterList,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getEnseignants } from "../../services/enseignantService";
import SEO from "../../components/ui/SEO";  
import { BASE_URL } from "../../config/constants";

const DEFAULT_PHOTO = "/noprofil.jpg";

export default function EnseignantsPage() {
  const navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Tous");

  useEffect(() => {
    getEnseignants()
      .then((data) => setEnseignants(data))
      .catch(() => setError("Impossible de charger les enseignants."))
      .finally(() => setLoading(false));
  }, []);

  const departements = [
    "Tous",
    ...new Set(enseignants.map((e) => e.departement?.nom).filter(Boolean)),
  ];

  const filtered = enseignants.filter((e) => {
    const matchDept = dept === "Tous" || e.departement?.nom === dept;
    const matchSearch =
      e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.role?.toLowerCase().includes(search.toLowerCase()) ||
      e.poste?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div>
      <SEO
        title="Enseignants"
        description="Le corps enseignant de l'IUT de Douala. Trouvez les professeurs par département."
        url="https://iutgate.vercel.app/enseignants"
      />
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
            Corps enseignant
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
            Nos Enseignants
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Retrouvez tous les membres du corps enseignant de l'IUT.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,.95)",
                borderRadius: 10,
                padding: "10px 16px",
                flex: 1,
                minWidth: 240,
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
                placeholder="Rechercher par nom, rôle..."
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
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              style={{
                padding: "10px 16px",
                background: "rgba(255,255,255,.95)",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--text)",
                outline: "none",
                cursor: "pointer",
                minWidth: 200,
                boxShadow: "0 4px 24px rgba(0,0,0,.2)",
              }}
            >
              {departements.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* CONTENU */}
      <section className="page-container">
        {!loading && !error && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {filtered.length} enseignant{filtered.length > 1 ? "s" : ""} trouvé
            {filtered.length > 1 ? "s" : ""}
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
            <p style={{ color: "var(--muted)" }}>Chargement...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

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
                color: "#991b1b",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--muted)",
            }}
          >
            <MdPeople size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucun enseignant trouvé
            </p>
          </div>
        )}

        {/* ── GRILLE CARDS ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-auto">
            {filtered.map((ens) => {
              const photoSrc = ens.photo_url
                ? `${BASE_URL}${ens.photo_url}`
                : DEFAULT_PHOTO;

              return (
                <div
                  key={ens.id_enseignant}
                  onClick={() => navigate(`/enseignants/${ens.id_enseignant}`)}
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
                    e.currentTarget.style.boxShadow =
                      "0 16px 40px rgba(6,182,212,.15)";
                    e.currentTarget.style.borderColor = "var(--cyan)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,.06)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {/* ── PHOTO EN HAUT ── */}
                  <div
                    style={{
                      position: "relative",
                      height: 200,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={photoSrc}
                      alt={ens.nom}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                      onError={(e) => {
                        e.target.src = DEFAULT_PHOTO;
                      }}
                    />
                    {/* Gradient bas */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 80,
                        background:
                          "linear-gradient(to bottom, transparent, rgba(12,26,64,.7))",
                      }}
                    />
                    {/* Badge département */}
                    {ens.departement?.nom && (
                      <div style={{ position: "absolute", top: 12, left: 12 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "rgba(6,182,212,.9)",
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: "var(--font-head)",
                            color: "#fff",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <MdSchool size={10} /> {ens.departement.nom}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── INFOS ── */}
                  <div
                    style={{
                      padding: "16px 18px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ens.nom}
                    </h3>
                    {(ens.role || ens.poste) && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--cyan)",
                          fontWeight: 500,
                        }}
                      >
                        {ens.role || ens.poste}
                      </p>
                    )}
                    {ens.email && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <MdEmail size={12} color="var(--subtle)" />
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ens.email}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "var(--cyan)",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "var(--font-head)",
                        marginTop: "auto",
                        paddingTop: 10,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      Voir le profil <MdArrowForward size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
