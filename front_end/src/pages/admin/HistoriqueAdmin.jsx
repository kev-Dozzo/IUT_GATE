import { useState, useEffect } from "react";
import { MdHistory, MdPerson, MdGroup } from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const actionLabels = {
  CREATE: { label: "Création", color: "#065f46", bg: "#d1fae5" },
  UPDATE: { label: "Modification", color: "#92400e", bg: "#fef3c7" },
  DELETE: { label: "Suppression", color: "#991b1b", bg: "#fee2e2" },
  CREATE_USER: { label: "Création user", color: "#1e40af", bg: "#dbeafe" },
  UPDATE_USER: { label: "Modif. user", color: "#92400e", bg: "#fef3c7" },
  DELETE_USER: { label: "Suppression user", color: "#991b1b", bg: "#fee2e2" },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ActivityItem({ a }) {
  const conf = actionLabels[a.action] || {
    label: a.action,
    color: "#475569",
    bg: "#f1f5f9",
  };
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "14px 20px",
        borderBottom: "1px solid #f1f5f9",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          padding: "2px 10px",
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "var(--font-head)",
          background: conf.bg,
          color: conf.color,
          whiteSpace: "nowrap",
          marginTop: 2,
        }}
      >
        {conf.label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 600,
            fontSize: 13,
            color: "#0f172a",
            marginBottom: 2,
          }}
        >
          {a.entity_name || a.entity_type || "—"}
          {a.admin && (
            <span
              style={{ fontWeight: 400, color: "var(--muted)", fontSize: 12 }}
            >
              {" "}
              — par {a.admin.nom}
            </span>
          )}
        </p>
        {a.details && (
          <p style={{ fontSize: 11, color: "var(--muted)" }}>{a.details}</p>
        )}
      </div>
      <p style={{ fontSize: 11, color: "var(--subtle)", flexShrink: 0 }}>
        {formatDate(a.createdAt)}
      </p>
    </div>
  );
}

export default function HistoriqueAdmin() {
  const { isSuperAdmin } = useAuth();
  const [tab, setTab] = useState("me");
  const [myActivity, setMy] = useState([]);
  const [allActivity, setAll] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api
      .get("/admin/users/activities/me")
      .then((r) => setMy(r.data))
      .catch(console.error);

    if (isSuperAdmin()) {
      api
        .get("/admin/users/activities/all")
        .then((r) => setAll(r.data))
        .catch(console.error);
    }

    setLoading(false);
  }, [isSuperAdmin]);

  const current = tab === "me" ? myActivity : allActivity;

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <MdHistory size={28} color="var(--cyan)" />
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Historique des activités
          </h1>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid #e2e8f0",
            marginBottom: 24,
          }}
        >
          {[
            { key: "me", label: "Mes actions", icon: MdPerson },
            ...(isSuperAdmin()
              ? [{ key: "all", label: "Toutes les actions", icon: MdGroup }]
              : []),
          // eslint-disable-next-line no-unused-vars
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 13,
                color: tab === key ? "var(--cyan)" : "var(--muted)",
                borderBottom: `2px solid ${tab === key ? "var(--cyan)" : "transparent"}`,
              }}
            >
              <Icon size={16}  /> {label}
              <span
                style={{
                  background: tab === key ? "var(--cyan-light)" : "#f1f5f9",
                  color: tab === key ? "var(--cyan-dark)" : "var(--muted)",
                  padding: "1px 7px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  marginLeft: 4,
                }}
              >
                {key === "me" ? myActivity.length : allActivity.length}
              </span>
            </button>
          ))}
        </div>

        {/* Liste */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {current.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--muted)",
              }}
            >
              <MdHistory size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                Aucune activité pour le moment
              </p>
            </div>
          ) : (
            current.map((a) => <ActivityItem key={a.id_activity} a={a} />)
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
