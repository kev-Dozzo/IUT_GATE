import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdPeople,
  MdSchool,
  MdBook,
  MdArrowForward,
  MdAccountBalance,
  MdLocationOn,
  MdDirections,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Avatar from "../../components/ui/Avatar";
import { getDepartementById } from "../../services/departementService";

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
              marginBottom: 24,
              padding: 0,
            }}
          >
            <MdArrowBack size={16} /> Retour aux départements
          </button>

          {!loading && dept && (
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
                  flexShrink: 0,
                }}
              >
                <MdAccountBalance size={34} color="var(--cyan)" />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(22px, 4vw, 34px)",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 12,
                  }}
                >
                  {dept.nom}
                </h1>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {dept.enseignants_count !== undefined && (
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
                      <MdPeople size={13} /> {dept.enseignants_count}{" "}
                      enseignants
                    </span>
                  )}
                  {dept.filieres_count !== undefined && (
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
                      <MdBook size={13} /> {dept.filieres_count} filières
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

        {!loading && dept && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.8 }}
              >
                {dept.description || "Aucune description disponible."}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {/* Filières */}
              {dept.filieres?.length > 0 && (
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
                    Enseignants
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {dept.enseignants.map((e, i) => (
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
            </div>

            {/* Carte bâtiment principal */}
            {dept.batiment?.latitude && dept.batiment?.longitude && (
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
                    gap: 10,
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
                      {dept.batiment.nom}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        openItineraire(
                          dept.batiment.latitude,
                          dept.batiment.longitude,
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
                <div style={{ height: 320 }}>
                  <MapContainer
                    center={[
                      parseFloat(dept.batiment.latitude),
                      parseFloat(dept.batiment.longitude),
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
                        parseFloat(dept.batiment.latitude),
                        parseFloat(dept.batiment.longitude),
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
                          {dept.batiment.nom}
                        </p>
                        <p style={{ fontSize: 12, color: "#64748b" }}>
                          {dept.nom}
                        </p>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
