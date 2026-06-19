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

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

const DEFAULT_PHOTO = "/noprofil.jpg";

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

  const openItineraire = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  const photoSrc = ens?.photo_url
    ? `${BASE_URL}${ens.photo_url}`
    : DEFAULT_PHOTO;

  return (
    <div>
      <Navbar />

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
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            {error}
          </p>
          <button
            onClick={() => navigate("/enseignants")}
            style={{
              padding: "10px 20px",
              background: "var(--cyan)",
              color: "var(--cyan-text)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
            }}
          >
            Retour
          </button>
        </div>
      )}

      {!loading && ens && (
        <>
          {/* ── HERO AVEC PHOTO PLEIN HAUT ── */}
          <div
            style={{
              position: "relative",
              minHeight: "clamp(280px, 45vw, 420px)",
              overflow: "hidden",
            }}
          >
            {/* Image de fond floutée */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${photoSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "blur(3px) brightness(.3)",
                transform: "scale(1.08)",
              }}
            />

            {/* Gradient bas */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                background: "linear-gradient(to bottom, transparent, #0c1a40)",
              }}
            />

            {/* Contenu hero */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: 1000,
                margin: "0 auto",
                padding: "clamp(24px, 5vw, 44px) 24px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Bouton retour */}
              <button
                onClick={() => navigate("/enseignants")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.25)",
                  borderRadius: 8,
                  padding: "7px 14px",
                  cursor: "pointer",
                  color: "#fff",
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: "clamp(24px, 5vw, 48px)",
                  backdropFilter: "blur(8px)",
                  alignSelf: "flex-start",
                }}
              >
                <MdArrowBack size={16} /> Retour
              </button>

              {/* Profil */}
              <div
                style={{
                  display: "flex",
                  gap: "clamp(16px, 3vw, 28px)",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                {/* Photo */}
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={photoSrc}
                    alt={ens.nom}
                    style={{
                      width: "clamp(80px, 14vw, 120px)",
                      height: "clamp(80px, 14vw, 120px)",
                      borderRadius: 16,
                      objectFit: "cover",
                      objectPosition: "center top",
                      border: "3px solid rgba(255,255,255,.8)",
                      boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PHOTO;
                    }}
                  />
                </div>

                {/* Nom + infos */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h1
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(22px, 4vw, 32px)",
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 6,
                      textShadow: "0 2px 8px rgba(0,0,0,.4)",
                    }}
                  >
                    {ens.nom}
                  </h1>
                  {(ens.role || ens.poste) && (
                    <p
                      style={{
                        fontSize: "clamp(13px, 2vw, 15px)",
                        color: "var(--cyan)",
                        fontWeight: 600,
                        marginBottom: 14,
                      }}
                    >
                      {ens.role || ens.poste}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {ens.departement?.nom && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 14px",
                          borderRadius: 999,
                          background: "rgba(6,182,212,.3)",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          color: "var(--cyan)",
                          border: "1px solid rgba(6,182,212,.5)",
                          backdropFilter: "blur(8px)",
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
                        padding: "5px 14px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,.15)",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,.2)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <MdPeople size={13} /> Enseignant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTENU ── */}
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "clamp(20px, 4vw, 40px) 24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {/* COLONNE GAUCHE */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
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
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
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
                        value: "",
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
                            <Icon
                              icon={Icon}
                              size={18}
                              color="var(--cyan-dark)"
                            />
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
                      padding: "16px 20px",
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
                        Localisation du bureau
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
                        <MdLocationOn size={15} /> Campus
                      </button>
                    </div>
                  </div>

                  {ens.batiment?.latitude && ens.batiment?.longitude ? (
                    <div style={{ height: 280 }}>
                      <MapContainer
                        center={[
                          parseFloat(ens.batiment.latitude),
                          parseFloat(ens.batiment.longitude),
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
                            parseFloat(ens.batiment.latitude),
                            parseFloat(ens.batiment.longitude),
                          ]}
                          icon={markerIcon}
                        >
                          <Popup>
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                              }}
                            >
                              {ens.batiment?.nom}
                            </p>
                            {ens.bureau && (
                              <p style={{ fontSize: 12, color: "#64748b" }}>
                                Bureau : {ens.bureau}
                              </p>
                            )}
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
                        size={36}
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
                        Voir sur la carte
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
