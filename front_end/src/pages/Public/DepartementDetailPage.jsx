import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdPeople,
  MdSchool,
  MdBook,
  MdArrowForward,
  MdAccountBalance,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getDepartementById } from "../../services/departementService";

export default function DepartementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDepartementById(id)
      .then((data) => setDept(data))
      .catch(() => setError("Département introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Navbar />

      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "40px 32px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/departements")}
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
            <MdArrowBack size={16} /> Retour aux départements
          </button>
          {dept && (
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
                Département
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
                {dept.nom}
              </h1>
              <div style={{ display: "flex", gap: 12 }}>
                {dept.enseignants_count !== undefined && (
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
                    <MdPeople size={13} /> {dept.enseignants_count} enseignants
                  </span>
                )}
                {dept.filieres_count !== undefined && (
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
                    <MdBook size={13} /> {dept.filieres_count} filières
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px" }}>
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

        {!loading && dept && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
                style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.8 }}
              >
                {dept.description || "Aucune description disponible."}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {/* Filières */}
              {dept.filieres?.length > 0 && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    padding: "24px",
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
                    Filières
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {dept.filieres.map((f) => (
                      <div
                        key={f.id_filiere}
                        onClick={() => navigate(`/filieres/${f.id_filiere}`)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 14px",
                          background: "#f8fafc",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--cyan)";
                          e.currentTarget.style.background =
                            "var(--cyan-light)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.background = "#f8fafc";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <MdBook size={16} color="var(--cyan-dark)" />
                          <div>
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 600,
                                fontSize: 13,
                                color: "var(--text)",
                              }}
                            >
                              {f.nom}
                            </p>
                            <p style={{ fontSize: 11, color: "var(--muted)" }}>
                              {f.duree}
                            </p>
                          </div>
                        </div>
                        <MdArrowForward size={15} color="var(--cyan)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enseignants */}
              {dept.enseignants?.length > 0 && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    padding: "24px",
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
                    Enseignants
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {dept.enseignants.map((e) => (
                      <div
                        key={e.id_enseignant}
                        onClick={() =>
                          navigate(`/enseignants/${e.id_enseignant}`)
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 14px",
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
                          <MdPeople size={16} color="var(--cyan-dark)" />
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
                        <MdArrowForward size={15} color="var(--cyan)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
