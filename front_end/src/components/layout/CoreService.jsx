import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  MdSearch,
  MdClose,
  MdLocationOn,
  MdEmail,
  MdArrowForward,
  MdBusiness,
  MdAssignment,
  MdLocalLibrary,
  MdComputer,
  MdLocalHospital,
  MdAttachMoney,
  MdHandshake,
} from "react-icons/md";

import { getServices } from "../../services/serviceAdminService";

const SERVICE_ICONS = [
  MdAssignment,
  MdLocalLibrary,
  MdComputer,
  MdLocalHospital,
  MdAttachMoney,
  MdHandshake,
  MdBusiness,
];

const SERVICE_COLORS = [
  { bg: "#cffafe", color: "#0e7490", border: "#67e8f9" },
  { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
  { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
  { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
];

function CoreService() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data || []);
      })
      .catch(() => setError("Impossible de charger les services."))
      .finally(() => setLoading(false));
  }, []);

  // Filtrage des services
  const filtered = services.filter((s) =>
    (s.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (s.description?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>

        <div style={{
          textAlign: "center",
          margin: "10px auto",
        }}>
          <h2 style={{fontSize:"4rem", textAlign: "center", fontWeight:"bolder"}} >Nos <span style={{color:"#06B6D4"}} >Services</span></h2>
          <p style={{textAlign: "center", fontSize: "16px", color:"#7DD3FC"}} >Tout ce dont vous avez besoin pour votre vie universitaire, au même endroit.</p>
        </div>

        {/* Barre de recherche */}
        <div style={{ marginBottom: 32, position: "relative", maxWidth: 500 }}>
          <div style={{ position: "relative" }}>
            <MdSearch
              size={20}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un service (scolarité, stages, finances...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 52px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                outline: "none",
              }}
            />
            {search && (
              <MdClose
                size={20}
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </div>

        {/* Compteur */}
        {!loading && !error && (
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
            {filtered.length} service{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid #e0f2fe",
                borderTop: "3px solid #06b6d4",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "#64748b", fontSize: 14 }}>Chargement des services...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#fee2e2",
              borderRadius: 12,
              border: "1px solid #fca5a5",
            }}
          >
            <p style={{ fontWeight: 600, color: "#991b1b", marginBottom: 8 }}>{error}</p>
            <p style={{ fontSize: 13, color: "#b91c1c" }}>
              Vérifiez que le serveur backend est bien démarré.
            </p>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
            <MdBusiness size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p style={{ fontWeight: 600, fontSize: 16 }}>Aucun service trouvé</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Essayez un autre mot-clé.</p>
          </div>
        )}

        {/* Grille des services */}
        {!loading && !error && filtered.length > 0 && (
          <div
            className="grid-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {filtered.map((service, index) => {
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              const col = SERVICE_COLORS[index % SERVICE_COLORS.length];

              return (
                <div
                  key={service.id_service || service.id}
                  onClick={() => navigate(`/services/${service.id_service || service.id}`)}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    padding: "26px",
                    cursor: "pointer",
                    transition: "all .25s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = col.border;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 36px ${col.bg}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icône */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: col.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={26} color={col.color} />
                  </div>

                  {/* Nom */}
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0f172a",
                      lineHeight: 1.3,
                    }}
                  >
                    {service.nom}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#64748b",
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {service.description?.slice(0, 110)}
                    {service.description?.length > 110 ? "..." : ""}
                  </p>

                  {/* Localisation */}
                  {service.batiment?.nom || service.localisation && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#64748b",
                        fontSize: 12.5,
                      }}
                    >
                      <MdLocationOn size={15} color={col.color} />
                      <span>{service.batiment?.nom || service.localisation}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: col.color,
                      fontSize: 13,
                      fontWeight: 600,
                      marginTop: "auto",
                      paddingTop: 12,
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    Voir les détails <MdArrowForward size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default CoreService;