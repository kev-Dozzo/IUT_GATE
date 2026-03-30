import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSchool,
  MdPeople,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getEnseignantById } from "../../services/enseignantService";

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

export default function EnseignantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ens, setEns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEnseignantById(id)
      .then((data) => setEns(data))
      .catch(() => setError("Enseignant introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px" }}>
        <button
          onClick={() => navigate("/enseignants")}
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
            marginBottom: 28,
            padding: 0,
          }}
        >
          <MdArrowBack size={16} /> Retour aux enseignants
        </button>

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
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && ens && (
          <>
            {/* Header profil */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "32px",
                marginBottom: 20,
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
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
                  {getInitials(ens.nom)}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 6,
                  }}
                >
                  {ens.nom}
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--cyan)",
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {ens.role || ens.poste}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ens.departement?.nom && (
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
                      <MdSchool size={13} /> {ens.departement.nom}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Infos contact */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 20,
              }}
            >
              {[
                { icon: MdEmail, label: "Email", value: ens.email },
                { icon: MdPhone, label: "Téléphone", value: ens.telephone },
                {
                  icon: MdLocationOn,
                  label: "Bureau",
                  value: ens.bureau || ens.coordonnees_bureau,
                },
                {
                  icon: MdPeople,
                  label: "Département",
                  value: ens.departement?.nom,
                },
              ]
                .filter((item) => item.value)
                .map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      padding: "18px",
                      display: "flex",
                      gap: 14,
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
                        flexShrink: 0,
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
                          marginBottom: 4,
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
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

            {/* Voir sur la carte */}
            <div
              style={{
                background: "var(--cyan-light)",
                borderRadius: 12,
                border: "1px solid #67e8f9",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--cyan-dark)",
                    marginBottom: 4,
                  }}
                >
                  Localiser ce bureau
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--cyan-dark)",
                    opacity: 0.8,
                  }}
                >
                  Retrouvez ce bureau sur la carte interactive du campus
                </p>
              </div>
              <button
                onClick={() => navigate("/carte")}
                style={{
                  background: "var(--cyan)",
                  color: "var(--cyan-text)",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Voir sur la carte
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
