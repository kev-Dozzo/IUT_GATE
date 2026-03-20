import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdLocationOn,
  MdApartment,
  MdBusiness,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getServiceById } from "../../services/serviceAdminService";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServiceById(id)
      .then((data) => setService(data))
      .catch(() => setError("Service introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px" }}>
        <button
          onClick={() => navigate("/services")}
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
          <MdArrowBack size={16} /> Retour aux services
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

        {!loading && service && (
          <>
            {/* Header */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "32px",
                marginBottom: 20,
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdBusiness size={30} color="var(--cyan-dark)" />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 8,
                  }}
                >
                  {service.nom}
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>

            {/* Infos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {[
                {
                  icon: MdApartment,
                  label: "Bâtiment",
                  value:
                    service.batiment?.nom || `Bâtiment ${service.id_batiment}`,
                },
                { icon: MdEmail, label: "Contact", value: service.contact },
                {
                  icon: MdLocationOn,
                  label: "Adresse",
                  value: service.batiment?.description,
                },
              ]
                .filter((i) => i.value)
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
                          fontWeight: 500,
                          color: "var(--text)",
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
                marginTop: 20,
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
                  Localiser ce service
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--cyan-dark)",
                    opacity: 0.8,
                  }}
                >
                  Retrouvez ce service sur la carte interactive du campus
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
