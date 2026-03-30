import { useState, useEffect } from "react";
import {
  MdCampaign,
  MdSchool,
  MdPeople,
  MdAccountBalance,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/ui/StatCard";
import { getStats } from "../../services/dashboardService";

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Erreur stats:", err))
      .finally(() => setLoading(false));
  }, []);

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
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
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
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
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
            Activité récente
          </p>
          {loading ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</p>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              Aucune activité récente.
            </p>
          )}
        </div>

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
          {[
            "+ Nouvelle annonce",
            "+ Ajouter enseignant",
            "+ Nouvelle filière",
            "+ Ajouter bâtiment",
          ].map((action) => (
            <button
              key={action}
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
              {action}
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
