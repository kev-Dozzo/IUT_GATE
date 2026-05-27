import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCampaign,
  MdSchool,
  MdPeople,
  MdAccountBalance,
  MdApartment,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/ui/StatCard";
import { getStats } from "../../services/dashboardService";
import { getBatiments } from "../../services/batimentService";
import { getEnseignants } from "../../services/enseignantService";
import { getActualites } from "../../services/actualiteService";
import { getIAStatus } from "../../services/iaService";

const statsConfig = [
  {
    key: "annonces",
    label: "Annonces",
    icon: MdCampaign,
    bg: "#cffafe",
    color: "#0e7490",
  },
  {
    key: "filieres",
    label: "Filières",
    icon: MdSchool,
    bg: "#d1fae5",
    color: "#065f46",
  },
  {
    key: "enseignants",
    label: "Enseignants",
    icon: MdPeople,
    bg: "#fef3c7",
    color: "#92400e",
  },
  {
    key: "services",
    label: "Services",
    icon: MdAccountBalance,
    bg: "#ede9fe",
    color: "#5b21b6",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [batiments, setBatiments] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [iaStatus, setIAStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    Promise.all([getStats(), getBatiments(), getEnseignants(), getActualites()])
      .then(([s, bats, ens, acts]) => {
        setStats(s);
        setBatiments(bats.slice(0, 6));
        setEnseignants(ens.slice(0, 6));
        setActualites(acts.slice(0, 6));
      })
      .catch((err) => console.error("Erreur dashboard data:", err))
      .finally(() => setLoading(false));

    getIAStatus()
      .then((status) => setIAStatus(status))
      .catch((err) => {
        console.error("Erreur IA status:", err);
        setIAStatus({
          healthy: false,
          message:
            "Le service IA de generaion de debouchers est impossible. verifier le solde insuffisant, le message d’erreur vient du compte Anthropic : solde insuffisant veullier de recharger le compte pour rétablir le service IA.",
        });
      });
  }, []);

  const quickActions = [
    { label: "+ Nouvelle annonce", path: "/admin/actualites" },
    { label: "+ Ajouter enseignant", path: "/admin/enseignants" },
    { label: "+ Nouvelle filière", path: "/admin/filieres" },
    { label: "+ Ajouter bâtiment", path: "/admin/batiments" },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--cyan)",
            fontFamily: "var(--font-head)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Vue d'ensemble
        </p>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: -0.5,
          }}
        >
          Tableau de bord
        </h1>

        {iaStatus?.healthy === false && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 16,
              border: "1px solid #fca5a5",
              background: "#fff1f2",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#b91c1c",
                fontFamily: "var(--font-head)",
                fontSize: 14,
              }}
            >
              Alerte IA : service indisponible
            </div>
            <div style={{ color: "#881337", fontSize: 13 }}>
              {iaStatus.message}
            </div>
            {iaStatus.detail && (
              <div
                style={{
                  color: "#5f021f",
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                Détail admin :{" "}
                {typeof iaStatus.detail === "string"
                  ? iaStatus.detail
                  : JSON.stringify(iaStatus.detail)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {statsConfig.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            icon={s.icon}
            bg={s.bg}
            color={s.color}
            value={loading ? "" : (stats?.[s.key] ?? 0)}
          />
        ))}
      </div>

      {/* Activité + Accès rapide */}
      <div
        className="grid-cols-1"
        style={{
          display: "grid ",
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
          gap: 18,
        }}
      >
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            padding: "22px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 18,
            }}
          >
            Accès rapide
          </p>
          {quickActions.map((action) => (
            <button
              key={action.label}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "#f8fafc",
                fontFamily: "var(--font-head)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text)",
                cursor: "pointer",
                marginBottom: 8,
                textAlign: "left",
              }}
              onClick={() => navigate(action.path)}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--cyan-light)";
                e.target.style.borderColor = "var(--cyan)";
                e.target.style.color = "var(--cyan-dark)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#f8fafc";
                e.target.style.borderColor = "var(--border)";
                e.target.style.color = "var(--text)";
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activités récentes */}
      <div style={{ marginTop: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Activités récentes
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(1, 1fr)"
              : "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {/* Batiments */}
          {batiments.map((b) => (
            <div
              key={b.id_batiment}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid var(--border)",
                padding: 12,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {b.photo_url ? (
                  <img
                    src={`http://localhost:5000${b.photo_url}`}
                    alt={b.nom}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "var(--cyan-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdApartment color="var(--cyan-dark)" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {b.nom}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {b.salles?.length
                    ? `${b.salles.length} salle${b.salles.length > 1 ? "s" : ""}`
                    : "—"}
                </div>
              </div>
            </div>
          ))}

          {/* Enseignants */}
          {enseignants.map((e) => (
            <div
              key={e.id_enseignant}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid var(--border)",
                padding: 12,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {e.photo_url ? (
                  <img
                    src={`http://localhost:5000${e.photo_url}`}
                    alt={e.nom}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(ev) => (ev.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#f1f5f9",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {e.nom}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {e.email || e.poste || "Enseignant"}
                </div>
              </div>
            </div>
          ))}

          {/* Actualités */}
          {actualites.map((a) => (
            <div
              key={a.id_actualite}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid var(--border)",
                padding: 12,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {a.fichiers?.[0]?.url ? (
                  <img
                    src={`http://localhost:5000${a.fichiers[0].url}`}
                    alt={a.titre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(ev) => (ev.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#f8fafc",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {a.titre}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {a.contenu?.slice(0, 60) || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
