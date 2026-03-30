import { useState, useEffect } from "react";
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
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
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

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getServices()
      .then((data) => setServices(data))
      .catch(() => setError("Impossible de charger les services."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(
    (s) =>
      s.nom?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Navbar /> 

      {/* ── HEADER ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "48px 32px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
            Campus
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 36,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.8,
              marginBottom: 8,
            }}
          >
            Services Administratifs
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Tous les services disponibles sur le campus de l'IUT.
          </p>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,.95)",
              borderRadius: 10,
              padding: "10px 16px",
              maxWidth: 480,
              boxShadow: "0 4px 24px rgba(0,0,0,.2)",
            }}
          >
            <MdSearch
              size={18}
              style={{ color: "var(--subtle)", flexShrink: 0 }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un service..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                background: "transparent",
                color: "var(--text)",
              }}
            />
            {search && (
              <MdClose
                size={16}
                style={{ color: "var(--subtle)", cursor: "pointer" }}
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}
      >
        {/* Compteur */}
        {!loading && !error && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {filtered.length} service{filtered.length > 1 ? "s" : ""} disponible
            {filtered.length > 1 ? "s" : ""}
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
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Chargement des services...
            </p>
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
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                color: "#991b1b",
                marginBottom: 8,
              }}
            >
              {error}
            </p>
            <p style={{ fontSize: 13, color: "#b91c1c" }}>
              Vérifiez que le serveur backend est bien démarré.
            </p>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--muted)",
            }}
          >
            <MdBusiness size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucun service trouvé
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Essayez un autre mot-clé.
            </p>
          </div>
        )}

        {/* Grille services */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-auto">
            {filtered.map((service, i) => {
              const col = SERVICE_COLORS[i % SERVICE_COLORS.length];
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
                <div
                  key={service.id_service}
                  onClick={() => setSelected(service)}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
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
                    e.currentTarget.style.boxShadow = `0 12px 36px ${col.bg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
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
                      fontFamily: "var(--font-head)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text)",
                      lineHeight: 1.3,
                    }}
                  >
                    {service.nom}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--muted)",
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {service.description?.slice(0, 100)}
                    {service.description?.length > 100 ? "..." : ""}
                  </p>

                  {/* Localisation */}
                  {service.batiment?.nom && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--muted)",
                        fontSize: 12,
                      }}
                    >
                      <MdLocationOn size={14} color={col.color} />
                      <span>{service.batiment.nom}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: col.color,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-head)",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: 14,
                    }}
                  >
                    Voir les détails <MdArrowForward size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL DÉTAIL ── */}
      {selected &&
        (() => {
          const i = services.findIndex(
            (s) => s.id_service === selected.id_service,
          );
          const col = SERVICE_COLORS[i % SERVICE_COLORS.length];
          const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
          return (
            <div
              onClick={() => setSelected(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(12,26,64,.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 200,
                padding: 20,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "36px",
                  width: "100%",
                  maxWidth: 520,
                  maxHeight: "85vh",
                  overflow: "auto",
                  boxShadow: "0 24px 64px rgba(0,0,0,.2)",
                }}
              >
                {/* Close */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 20,
                  }}
                >
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <MdClose size={18} color="var(--muted)" />
                  </button>
                </div>

                {/* Header modal */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      background: col.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={30} color={col.color} />
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {selected.nom}
                  </h2>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 24 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--cyan)",
                      fontFamily: "var(--font-head)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 10,
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
                    {selected.description}
                  </p>
                </div>

                {/* Infos contact */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {selected.batiment?.nom && (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        background: "#f8fafc",
                        borderRadius: 12,
                        padding: "14px 16px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: col.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <MdLocationOn size={18} color={col.color} />
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
                          Localisation
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--text)",
                            fontWeight: 500,
                          }}
                        >
                          {selected.batiment.nom}
                        </p>
                      </div>
                    </div>
                  )}

                  {selected.contact && (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        background: "#f8fafc",
                        borderRadius: 12,
                        padding: "14px 16px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: col.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <MdEmail size={18} color={col.color} />
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
                          Contact
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--cyan)",
                            fontWeight: 500,
                          }}
                        >
                          {selected.contact}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      <Footer /> 
    </div>
  );
}
