import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdAccessTime,
  MdPeople,
  MdSchool,
  MdCheckCircle,
  MdArrowForward,
  MdLocationOn,
  MdDirections,
  MdAccountBalance,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Avatar from "../../components/ui/Avatar";
import { getFiliereById } from "../../services/filiereService";

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
              marginBottom: 24,
              padding: 0,
            }}
          >
            <MdArrowBack size={16} /> Retour aux filières
          </button>

          {!loading && filiere && (
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {filiere.photo_url && (
                <img
                  src={`http://localhost:5000${filiere.photo_url}`}
                  alt={filiere.nom}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 16,
                    objectFit: "cover",
                    border: "3px solid var(--cyan)",
                    flexShrink: 0,
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
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
                  Filière
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(22px, 4vw, 34px)",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  {filiere.nom}
                </h1>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

        {!loading && filiere && (
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
                  {filiere.description}
                </p>
              </div>

              {/* Conditions */}
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

              {/* Infos sidebar */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  { icon: MdAccessTime, label: "Durée", value: filiere.duree },
                  {
                    icon: MdPeople,
                    label: "Places",
                    value: filiere.places ? `${filiere.places} places` : null,
                  },
                  {
                    icon: MdAccountBalance,
                    label: "Département",
                    value: filiere.departement?.nom,
                  },
                ]
                  .filter((i) => i.value)
                  .map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
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
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={17} color="var(--cyan-dark)" />
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

                {filiere.departement && (
                  <button
                    onClick={() =>
                      navigate(`/departements/${filiere.id_departement}`)
                    }
                    style={{
                      marginTop: 4,
                      padding: "10px",
                      background: "var(--navy)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    Voir le département <MdArrowForward size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* COLONNE DROITE */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Enseignants */}
              {filiere.enseignants?.length > 0 && (
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
                    Corps enseignant
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {filiere.enseignants.map((e, i) => (
                      <div
                        key={e.id_enseignant}
                        onClick={() =>
                          navigate(`/enseignants/${e.id_enseignant}`)
                        }
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
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
                          <Avatar
                            nom={e.nom}
                            photoUrl={e.photo_url}
                            size={36}
                            index={i}
                            shape="rounded"
                          />
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

              {/* Carte département */}
              {filiere.departement?.batiment?.latitude && (
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
                        📍 Localisation
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginTop: 2,
                        }}
                      >
                        {filiere.departement.batiment.nom}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() =>
                          openItineraire(
                            filiere.departement.batiment.latitude,
                            filiere.departement.batiment.longitude,
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
                        <MdDirections size={14} /> Itinéraire
                      </button>
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
                        <MdLocationOn size={14} /> Campus
                      </button>
                    </div>
                  </div>
                  <div style={{ height: 260 }}>
                    <MapContainer
                      center={[
                        parseFloat(filiere.departement.batiment.latitude),
                        parseFloat(filiere.departement.batiment.longitude),
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
                          parseFloat(filiere.departement.batiment.latitude),
                          parseFloat(filiere.departement.batiment.longitude),
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
                            {filiere.departement.batiment.nom}
                          </p>
                          <p style={{ fontSize: 12, color: "#64748b" }}>
                            {filiere.nom}
                          </p>
                        </Popup>
                      </Marker>
                    </MapContainer>
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
