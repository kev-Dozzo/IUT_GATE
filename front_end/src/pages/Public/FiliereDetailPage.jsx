import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdAccessTime,
  MdPeople,
  MdSchool,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getFiliereById } from "../../services/filiereService";

export default function FiliereDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filiere, setFiliere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFiliereById(id)
      .then((data) => setFiliere(data))
      .catch(() => setError("Filière introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Navbar />

      {/* Header */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "40px 32px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/filieres")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 20,
              padding: 0,
            }}
          >
            <MdArrowBack size={16} /> Retour aux filières
          </button>
          {filiere && (
            <>
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
                Filière
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: -0.8,
                  marginBottom: 16,
                }}
              >
                {filiere.nom}
              </h1>
              <div style={{ display: "flex", gap: 12 }}>
                {filiere.duree && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 14px",
                      borderRadius: 999,
                      background: "var(--cyan-light)",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "var(--font-head)",
                      color: "var(--cyan-dark)",
                    }}
                  >
                    <MdAccessTime size={13} /> {filiere.duree}
                  </span>
                )}
                {filiere.places && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 14px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,.15)",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "var(--font-head)",
                      color: "#fff",
                    }}
                  >
                    <MdPeople size={13} /> {filiere.places} places
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <p
            style={{
              color: "var(--muted)",
              textAlign: "center",
              padding: "60px 0",
            }}
          >
            {error}
          </p>
        )}

        {!loading && filiere && (
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Description */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  padding: "28px",
                }}
              >
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
                  Description
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text)",
                    lineHeight: 1.8,
                  }}
                >
                  {filiere.description}
                </p>
              </div>

              {/* Conditions d'admission */}
              {filiere.condition_admission && (
                <div
                  style={{
                    background: "var(--cyan-light)",
                    borderRadius: 14,
                    border: "1px solid #67e8f9",
                    padding: "24px",
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
                      marginBottom: 12,
                    }}
                  >
                    Conditions d'admission
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--cyan-text)",
                      lineHeight: 1.8,
                    }}
                  >
                    {filiere.condition_admission}
                  </p>
                </div>
              )}

              {/* Enseignants rattachés */}
              {filiere.enseignants?.length > 0 && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    padding: "28px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--cyan)",
                      fontFamily: "var(--font-head)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 16,
                    }}
                  >
                    Corps enseignant
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {filiere.enseignants.map((e) => (
                      <div
                        key={e.id_enseignant}
                        onClick={() =>
                          navigate(`/enseignants/${e.id_enseignant}`)
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "#f8fafc",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                        onMouseEnter={(e2) => {
                          e2.currentTarget.style.borderColor = "var(--cyan)";
                          e2.currentTarget.style.background =
                            "var(--cyan-light)";
                        }}
                        onMouseLeave={(e2) => {
                          e2.currentTarget.style.borderColor = "var(--border)";
                          e2.currentTarget.style.background = "#f8fafc";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 9,
                              background: "var(--cyan-light)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MdSchool size={18} color="var(--cyan-dark)" />
                          </div>
                          <div>
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 600,
                                fontSize: 13,
                                color: "var(--text)",
                              }}
                            >
                              {e.nom}
                            </p>
                            <p style={{ fontSize: 11, color: "var(--muted)" }}>
                              {e.role || e.poste}
                            </p>
                          </div>
                        </div>
                        <MdArrowForward size={16} color="var(--cyan)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar infos */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Durée", value: filiere.duree, icon: MdAccessTime },
                {
                  label: "Places",
                  value: filiere.places ? `${filiere.places} places` : null,
                  icon: MdPeople,
                },
                {
                  label: "Département",
                  value: filiere.departement?.nom,
                  icon: MdSchool,
                },
              ]
                .filter((i) => i.value)
                .map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      padding: "18px",
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "var(--cyan-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={18} color="var(--cyan-dark)" />
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
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

              <button
                onClick={() =>
                  navigate(`/departements/${filiere.id_departement}`)
                }
                style={{
                  padding: "12px",
                  background: "var(--cyan)",
                  color: "var(--cyan-text)",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                Voir le département <MdArrowForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
