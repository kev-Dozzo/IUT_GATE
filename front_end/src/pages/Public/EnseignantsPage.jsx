import { useState, useEffect } from "react";
import {
  MdSearch,
  MdClose,
  MdPeople,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSchool,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getEnseignants } from "../../services/enseignantService";
import Avatar from "../../components/ui/Avatar";
import {useNavigate } from "react-router-dom";  

const AVATAR_COLORS = [
  { bg: "#cffafe", color: "#0e7490" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fee2e2", color: "#991b1b" },
  { bg: "#fce7f3", color: "#9d174d" },
];

const getInitials = (nom) => {
  if (!nom) return "??";
  const parts = nom
    .replace(/^(Prof\.|Dr\.|M\.|Mme\.)\s*/i, "")
    .trim()
    .split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

export default function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Tous");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getEnseignants()
      .then((data) => setEnseignants(data))
      .catch(() => setError("Impossible de charger les enseignants."))
      .finally(() => setLoading(false));
  }, []);

  // Départements uniques pour le filtre
  const departements = [
    "Tous",
    ...new Set(
      enseignants
        .map((e) => e.departement?.nom || e.id_departement)
        .filter(Boolean),
    ),
  ];

  const filtered = enseignants.filter((e) => {
    const matchDept =
      dept === "Tous" ||
      e.departement?.nom === dept ||
      e.id_departement === dept;
    const matchSearch =
      e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.role?.toLowerCase().includes(search.toLowerCase()) ||
      e.poste?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

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
            Corps enseignant
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
            Nos Enseignants
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Retrouvez tous les membres du corps enseignant de l'IUT.
          </p>

          {/* Search + Filtre */}
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
                minWidth: 260,
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
                <option key={d}>{d}</option>
              ))}
            </select>
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
            {filtered.length} enseignant{filtered.length > 1 ? "s" : ""} trouvé
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
              Chargement des enseignants...
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
              background: "#cffafe",
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
            <p style={{ fontSize: 13, color: "#164e63" }}>
              Un Problem est survenu.
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
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Essayez un autre filtre.
            </p>
          </div>
        )}

        {/* Grille */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-auto">
            {filtered.map((ens, i) => {
              return (
                <div
                  key={ens.id_enseignant}
                  onClick={() => navigate(`/enseignants/${ens.id_enseignant}`)}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "22px",
                    cursor: "pointer",
                    transition: "all .25s",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 32px rgba(6,182,212,.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    nom={ens.nom}
                    photoUrl={ens.photo_url}
                    size={54}
                    index={i}
                    shape="rounded"
                  />

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text)",
                        marginBottom: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ens.nom}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--cyan)",
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      {ens.role || ens.poste}
                    </p>

                    {/* Département */}
                    {(ens.departement?.nom || ens.id_departement) && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 10px",
                          borderRadius: 999,
                          background: "var(--cyan-light)",
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          color: "var(--cyan-dark)",
                          marginBottom: 10,
                        }}
                      >
                        <MdSchool size={10} />
                        {ens.departement?.nom || `Dept. ${ens.id_departement}`}
                      </div>
                    )}

                    {/* Contact */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {ens.email && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
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
                      {ens.telephone && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <MdPhone size={12} color="var(--subtle)" />
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>
                            {ens.telephone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Voir profil */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "var(--cyan)",
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: "var(--font-head)",
                        marginTop: 12,
                      }}
                    >
                      Voir le profil <MdArrowForward size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
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
              maxWidth: 520,
              maxHeight: "85vh",
              overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
            {/* Header */}
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

            {/* Avatar + nom */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--cyan-dark)",
                  }}
                >
                  {getInitials(selected.nom)}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                {selected.nom}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--cyan)",
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              >
                {selected.role || selected.poste}
              </p>
              {(selected.departement?.nom || selected.id_departement) && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 14px",
                    borderRadius: 999,
                    background: "var(--cyan-light)",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "var(--font-head)",
                    color: "var(--cyan-dark)",
                  }}
                >
                  <MdSchool size={13} />
                  {selected.departement?.nom ||
                    `Département ${selected.id_departement}`}
                </span>
              )}
            </div>

            {/* Infos contact */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                { icon: MdEmail, label: "Email", value: selected.email },
                {
                  icon: MdPhone,
                  label: "Téléphone",
                  value: selected.telephone,
                },
                {
                  icon: MdLocationOn,
                  label: "Bureau",
                  value: selected.bureau || selected.coordonnees_bureau,
                },
                {
                  icon: MdSchool,
                  label: "Département",
                  value:
                    selected.departement?.nom ||
                    `Dept. ${selected.id_departement}`,
                },
              ]
                .filter((item) => item.value)
                .map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "var(--cyan-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color="var(--cyan-dark)" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--subtle)",
                          fontFamily: "var(--font-head)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 3,
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text)",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
