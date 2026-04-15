import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdLocationOn,
  MdApartment,
  MdBusiness,
  MdDirections,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getServiceById } from "../../services/serviceAdminService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;background:#06B6D4;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(6,182,212,.5);"></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const SERVICE_ICONS = ["📋", "📚", "💻", "🏥", "💰", "🤝", "🏢"];

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

  const openItineraire = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  return (
    <div>
      <Navbar />

      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(32px, 6vw, 56px) 24px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              marginBottom: 24,
              padding: 0,
            }}
          >
            <MdArrowBack size={16} /> Retour aux services
          </button>

          {!loading && service && (
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 18,
                  background: "rgba(6,182,212,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  flexShrink: 0,
                }}
              >
                {SERVICE_ICONS[(parseInt(id) - 1) % SERVICE_ICONS.length]}
              </div>
              <div>
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
                  Service administratif
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(22px, 4vw, 34px)",
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {service.nom}
                </h1>
              </div>
            </div>
          )}
        </div>
      </section>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 40px) 24px",
        }}
      >
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {/* COLONNE GAUCHE */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Description */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
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
                  {service.description || "Aucune description disponible."}
                </p>
              </div>

              {/* Contact + Bâtiment */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  {
                    icon: MdApartment,
                    label: "Bâtiment",
                    value: service.batiment?.nom,
                  },
                  {
                    icon: MdEmail,
                    label: "Contact",
                    value: service.contact,
                    link: `mailto:${service.contact}`,
                  },
                  {
                    icon: MdLocationOn,
                    label: "Adresse",
                    value: service.batiment?.description,
                  },
                ]
                  .filter((i) => i.value)
                  .map(({ icon: Icon, label, value, link }) => (
                    <div
                      key={label}
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
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
                            marginBottom: 2,
                          }}
                        >
                          {label}
                        </p>
                        {link ? (
                          <a
                            href={link}
                            style={{
                              fontSize: 13,
                              color: "var(--cyan)",
                              fontWeight: 500,
                              textDecoration: "none",
                            }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--text)",
                              fontWeight: 500,
                            }}
                          >
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* COLONNE DROITE — Carte */}
            <div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "18px 20px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0f172a",
                      }}
                    >
                      📍 Localisation
                    </p>
                    {service.batiment?.nom && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginTop: 2,
                        }}
                      >
                        {service.batiment.nom}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {service.batiment?.latitude && (
                      <button
                        onClick={() =>
                          openItineraire(
                            service.batiment.latitude,
                            service.batiment.longitude,
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 14px",
                          background: "var(--cyan)",
                          color: "var(--cyan-text)",
                          border: "none",
                          borderRadius: 8,
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        <MdDirections size={16} /> Itinéraire
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/carte")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 14px",
                        background: "var(--cyan-light)",
                        color: "var(--cyan-dark)",
                        border: "none",
                        borderRadius: 8,
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <MdLocationOn size={16} /> Carte campus
                    </button>
                  </div>
                </div>

                {service.batiment?.latitude && service.batiment?.longitude ? (
                  <div style={{ height: 320 }}>
                    <MapContainer
                      center={[
                        parseFloat(service.batiment.latitude),
                        parseFloat(service.batiment.longitude),
                      ]}
                      zoom={17}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap"
                        maxZoom={22}
                        maxNativeZoom={19}
                      />
                      <Marker
                        position={[
                          parseFloat(service.batiment.latitude),
                          parseFloat(service.batiment.longitude),
                        ]}
                        icon={markerIcon}
                      >
                        <Popup>
                          <div style={{ fontFamily: "var(--font-body)" }}>
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                                fontSize: 13,
                                marginBottom: 4,
                              }}
                            >
                              {service.batiment.nom}
                            </p>
                            <p style={{ fontSize: 12, color: "#64748b" }}>
                              {service.nom}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div
                    onClick={() => navigate("/carte")}
                    style={{
                      height: 200,
                      background: "var(--cyan-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <MdLocationOn
                      size={40}
                      color="var(--cyan-dark)"
                      style={{ opacity: 0.5 }}
                    />
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "var(--cyan-dark)",
                      }}
                    >
                      Voir sur la carte du campus
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
