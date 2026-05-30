import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdAccessTime,
  MdPeople,
  MdSchool,
  MdArrowForward,
  MdLocationOn,
  MdDirections,
  MdAccountBalance,
  MdOpenInNew,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Avatar from "../../components/ui/Avatar";
import DebouchesIA from "../../components/ui/DebouchesIA";
import { getFiliereById } from "../../services/filiereService";
import SEO from "../../components/ui/SEO";

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

const BASE_URL = "http://localhost:5000";

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

  const photoSrc = filiere?.photo_url
    ? `${BASE_URL}${filiere.photo_url}`
    : null;

  return (
    <div>
      <SEO
        title={filiere?.nom}
        description={filiere?.description?.slice(0, 150)}
        url={`https://iutgate.vercel.app/filieres/${id}`}
      />
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
            onClick={() => navigate("/filieres")}
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

      {!loading && filiere && (
        <>
          {/* ── HERO AVEC PHOTO PLEIN HAUT ── */}
          <div
            style={{
              position: "relative",
              minHeight: "clamp(260px, 40vw, 380px)",
              overflow: "hidden",
            }}
          >
            {/* Fond photo ou gradient */}
            {photoSrc ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${photoSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(3px) brightness(.3)",
                  transform: "scale(1.08)",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
                }}
              />
            )}

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

            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: 1000,
                margin: "0 auto",
                padding: "clamp(24px, 5vw, 44px) 24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Retour */}
              <button
                onClick={() => navigate("/filieres")}
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
                  marginBottom: "clamp(24px, 5vw, 44px)",
                  backdropFilter: "blur(8px)",
                  alignSelf: "flex-start",
                }}
              >
                <MdArrowBack size={16} /> Retour aux filières
              </button>

              {/* Infos filière */}
              <div
                style={{
                  display: "flex",
                  gap: "clamp(16px, 3vw, 24px)",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                {/* Photo/logo carré */}
                <div style={{ flexShrink: 0 }}>
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt={filiere.nom}
                      style={{
                        width: "clamp(70px, 12vw, 100px)",
                        height: "clamp(70px, 12vw, 100px)",
                        borderRadius: 14,
                        objectFit: "cover",
                        border: "3px solid rgba(255,255,255,.8)",
                        boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "clamp(70px, 12vw, 100px)",
                        height: "clamp(70px, 12vw, 100px)",
                        borderRadius: 14,
                        background: "rgba(6,182,212,.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "3px solid rgba(6,182,212,.4)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <MdSchool size={40} color="var(--cyan)" />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--cyan)",
                      fontFamily: "var(--font-head)",
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      marginBottom: 8,
                    }}
                  >
                    Filière
                  </p>
                  <h1
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(20px, 4vw, 32px)",
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 14,
                      textShadow: "0 2px 8px rgba(0,0,0,.4)",
                    }}
                  >
                    {filiere.nom}
                  </h1>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {filiere.duree && (
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
                          border: "1px solid rgba(255,255,255,.2)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <MdPeople size={13} /> {filiere.places} places
                      </span>
                    )}
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
                {/* Description */}
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
                    {filiere.description || "Aucune description disponible."}
                  </p>
                </div>

                {/* Conditions */}
                {filiere.condition_admission && (
                  <div
                    style={{
                      borderRadius: 14,
                      border: "1px solid #67e8f9",
                      padding: "20px",
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
                        marginBottom: 10,
                      }}
                    >
                      Conditions d'admission
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text)",
                        lineHeight: 1.8,
                      }}
                    >
                      {filiere.condition_admission}
                    </p>
                  </div>
                )}

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
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
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
                            e2.currentTarget.style.borderColor =
                              "var(--border)";
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
                              <p
                                style={{ fontSize: 11, color: "var(--muted)" }}
                              >
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

              {/* COLONNE DROITE */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Infos */}
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
                    {
                      icon: MdAccessTime,
                      label: "Durée",
                      value: filiere.duree,
                    },
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
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
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
                            flexShrink: 0,
                          }}
                        >
                          <Icon icon={Icon} size={17} color="var(--cyan-dark)" />
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

                {/* Préinscription */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #0c1a40, #0e5f75)",
                    borderRadius: 16,
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(6,182,212,.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 22,
                      }}
                    >
                      <MdSchool color="var(--cyan)" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 800,
                          fontSize: 15,
                          color: "#fff",
                          marginBottom: 3,
                        }}
                      >
                        Candidater à l'IUT
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8" }}>
                        Concours d'entrée — {filiere.nom}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}
                  >
                    Déposez votre dossier de préinscription pour intégrer cette
                    filière.
                  </p>
                  <a
                    href="https://www.iut-dla.cm/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px",
                      background: "var(--cyan)",
                      color: "var(--cyan-text)",
                      borderRadius: 10,
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--cyan-dark)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--cyan)")
                    }
                  >
                    <MdOpenInNew size={16} /> Préinscription en ligne
                  </a>
                </div>

                {/* Carte */}
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
                        padding: "14px 18px",
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
                          Localisation
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
                    <div style={{ height: 220 }}>
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

            {/* Débouchés IA */}
            <div style={{ marginTop: 32 }}>
              <DebouchesIA filiere={filiere} />
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
