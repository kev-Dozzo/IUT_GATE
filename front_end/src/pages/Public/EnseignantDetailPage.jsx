import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSchool,
  MdPeople,
  MdDirections,
  MdApartment,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Avatar from "../../components/ui/Avatar";
import { getEnseignantById } from "../../services/enseignantService";

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

  // const getInitials = (nom) => {
  //   if (!nom) return "??";
  //   const parts = nom
  //     .replace(/^(Prof\.|Dr\.|M\.|Mme\.)\s*/i, "")
  //     .trim()
  //     .split(" ");
  //   return parts.length >= 2
  //     ? (parts[0][0] + parts[1][0]).toUpperCase()
  //     : parts[0].slice(0, 2).toUpperCase();
  // };

  const openItineraire = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  return (
    <div>
      <Navbar />

      {/* HEADER HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(32px, 6vw, 56px) 24px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              marginBottom: 24,
              padding: 0,
            }}
          >
            <MdArrowBack size={16} /> Retour aux enseignants
          </button>

          {!loading && ens && (
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Avatar
                nom={ens.nom}
                photoUrl={ens.photo_url}
                size={90}
                shape="circle"
                index={0}
              />
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(22px, 4vw, 34px)",
                    fontWeight: 800,
                    color: "#fff",
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
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 14px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,.15)",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "var(--font-head)",
                      color: "#fff",
                    }}
                  >
                    <MdPeople size={13} /> Enseignant
                  </span>
                </div>
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
            <button
              onClick={() => navigate("/enseignants")}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: "var(--cyan)",
                color: "var(--cyan-text)",
                border: "none",
                borderRadius: 8,
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Retour
            </button>
          </div>
        )}

        {!loading && ens && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {/* COLONNE GAUCHE */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Infos contact */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
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
                  Informations de contact
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    {
                      icon: MdEmail,
                      label: "Email",
                      value: ens.email,
                      link: `mailto:${ens.email}`,
                    },
                    {
                      icon: MdPhone,
                      label: "Téléphone",
                      value: ens.telephone,
                      link: `tel:${ens.telephone}`,
                    },
                    {
                      icon: MdApartment,
                      label: "Bureau",
                      value: ens.bureau || ens.coordonnees_bureau,
                    },
                    {
                      icon: MdSchool,
                      label: "Département",
                      value: ens.departement?.nom,
                    },
                  ]
                    .filter((i) => i.value)
                    .map(({ icon: Icon, label, value, link }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
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

              {/* Voir département */}
              {ens.departement && (
                <button
                  onClick={() =>
                    navigate(`/departements/${ens.id_departement}`)
                  }
                  style={{
                    padding: "13px",
                    background: "var(--navy)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--blue)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--navy)")
                  }
                >
                  <MdSchool size={16} /> Voir le département
                </button>
              )}
            </div>

            {/* COLONNE DROITE — Carte */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                      📍 Localisation du bureau
                    </p>
                    {ens.bureau && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginTop: 2,
                        }}
                      >
                        {ens.bureau}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {ens.batiment?.latitude && ens.batiment?.longitude && (
                      <button
                        onClick={() =>
                          openItineraire(
                            ens.batiment.latitude,
                            ens.batiment.longitude,
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 12px",
                          background: "var(--cyan)",
                          color: "var(--cyan-text)",
                          border: "none",
                          borderRadius: 8,
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        <MdDirections size={15} /> Itinéraire
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/carte")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 12px",
                        background: "var(--cyan-light)",
                        color: "var(--cyan-dark)",
                        border: "none",
                        borderRadius: 8,
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      <MdLocationOn size={15} /> Carte campus
                    </button>
                  </div>
                </div>

                {/* Mini carte */}
                {ens.batiment?.latitude && ens.batiment?.longitude ? (
                  <div style={{ height: 280 }}>
                    <MapContainer
                      center={[
                        parseFloat(ens.batiment.latitude),
                        parseFloat(ens.batiment.longitude),
                      ]}
                      zoom={17}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={true}
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
                          parseFloat(ens.batiment.latitude),
                          parseFloat(ens.batiment.longitude),
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
                              {ens.batiment?.nom || "Bâtiment"}
                            </p>
                            {ens.bureau && (
                              <p style={{ fontSize: 12, color: "#64748b" }}>
                                Bureau : {ens.bureau}
                              </p>
                            )}
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
                      transition: "background .2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#a5f3fc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--cyan-light)")
                    }
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
