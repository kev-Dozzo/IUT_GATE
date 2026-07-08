import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdCheck } from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";
import {  ROLE_PERMISSIONS } from "../../config/permissions"; 

const ROLES = ["super_admin", "admin", "editeur"];

const PERMS_LIST = [
  { key: "manage_actualites", label: "Actualités" },
  { key: "manage_filieres", label: "Filières" },
  { key: "manage_departements", label: "Départements" },
  { key: "manage_enseignants", label: "Enseignants" },
  { key: "manage_batiments", label: "Bâtiments" },
  { key: "manage_salles", label: "Salles" },
  { key: "manage_services", label: "Services" },
  { key: "manage_users", label: "Utilisateurs admin" },
  { key: "view_logs", label: "Historique" },
];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    role: "editeur",
    permissions: [],
  });
  const [saving, setSaving] = useState(false);

  const load = () =>
    api
      .get("/admin/users")
      .then((r) => setUsers(r.data))
      .catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nom: "",
      email: "",
      mot_de_passe: "",
      role: "editeur",
      permissions: ROLE_PERMISSIONS.editeur || [],
    });
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      nom: u.nom,
      email: u.email,
      mot_de_passe: "",
      role: u.role,
      permissions: u.permissions || [],
    });
    setShowForm(true);
  };

  const handleRoleChange = (role) => {
    // Pré-remplit les permissions selon le rôle
    const defaultPerms =
      role === "super_admin" ? ["all"] : ROLE_PERMISSIONS[role] || [];
    setForm((f) => ({ ...f, role, permissions: defaultPerms }));
  };

  const togglePerm = (perm) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const handleSave = async () => {
    if (!form.nom || !form.email) return alert("Nom et email requis");
    if (!editing && !form.mot_de_passe)
      return alert("Mot de passe requis pour un nouvel utilisateur");

    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/users/${editing.id_admin}`, form);
      } else {
        await api.post("/admin/users", form);
      }
      setShowForm(false);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Supprimer ${u.nom} ?`)) return;
    await api.delete(`/admin/users/${u.id_admin}`);
    load();
  };

  const lbl = {
    fontSize: 11,
    fontWeight: 700,
    color: "#374151",
    fontFamily: "var(--font-head)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    display: "block",
    marginBottom: 6,
  };
  const inp = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
  };

  const roleBadge = (role) => {
    const c =
      role === "super_admin"
        ? { bg: "#fef3c7", color: "#92400e" }
        : role === "admin"
          ? { bg: "#cffafe", color: "#0e7490" }
          : { bg: "#f1f5f9", color: "#475569" };
    return (
      <span
        style={{
          padding: "2px 10px",
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "var(--font-head)",
          ...c,
        }}
      >
        {role}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Utilisateurs
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              {users.length} utilisateur(s) admin
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "var(--cyan)",
              color: "var(--navy)",
              border: "none",
              borderRadius: 10,
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <MdAdd size={18} /> Ajouter
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid var(--border)",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {editing ? `Modifier ${editing.nom}` : "Nouvel utilisateur"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <MdClose size={20} color="var(--subtle)" />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={lbl}>Nom complet *</label>
                <input
                  value={form.nom}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nom: e.target.value }))
                  }
                  style={inp}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label style={lbl}>Email *</label>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  style={inp}
                  placeholder="email@iut.cm"
                  type="email"
                />
              </div>
              <div>
                <label style={lbl}>
                  Mot de passe {editing ? "(laisser vide = inchangé)" : "*"}
                </label>
                <input
                  value={form.mot_de_passe}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mot_de_passe: e.target.value }))
                  }
                  style={inp}
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div>
                <label style={lbl}>Rôle *</label>
                <select
                  value={form.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  style={{ ...inp }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permissions */}
            {form.role !== "super_admin" && (
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Permissions</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PERMS_LIST.map(({ key, label }) => {
                    const active = form.permissions.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => togglePerm(key)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 999,
                          border: `1.5px solid ${active ? "var(--cyan)" : "var(--border)"}`,
                          background: active ? "var(--cyan-light)" : "#f8fafc",
                          color: active ? "var(--cyan-dark)" : "var(--muted)",
                          fontFamily: "var(--font-head)",
                          fontWeight: 600,
                          fontSize: 11,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {active && <MdCheck size={12} />} {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: saving ? "var(--subtle)" : "var(--cyan)",
                  color: "var(--navy)",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Enregistrement..." : editing ? "Modifier" : "Créer"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  color: "var(--muted)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {users.map((u, i) => {
            const isFirst = i === 0,
              isLast = i === users.length - 1;
            return (
              <div
                key={u.id_admin}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderTop: isFirst ? "1px solid #e2e8f0" : "none",
                  borderRadius: isFirst
                    ? "12px 12px 0 0"
                    : isLast
                      ? "0 0 12px 12px"
                      : 0,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--navy)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      fontSize: 14,
                      color: "var(--cyan)",
                    }}
                  >
                    {u.nom.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0f172a",
                      }}
                    >
                      {u.nom}
                    </p>
                    {roleBadge(u.role)}
                    {!u.is_active && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#ef4444",
                          fontWeight: 700,
                        }}
                      >
                        DÉSACTIVÉ
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    {u.email}
                  </p>
                  {u.permissions?.length > 0 &&
                    !u.permissions.includes("all") && (
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--subtle)",
                          marginTop: 3,
                        }}
                      >
                        {u.permissions.slice(0, 3).join(" · ")}
                        {u.permissions.length > 3
                          ? ` +${u.permissions.length - 3}`
                          : ""}
                      </p>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(u)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "var(--cyan-light)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <MdEdit size={16} color="var(--cyan-dark)" />
                  </button>
                  {u.id_admin !== 1 && (
                    <button
                      onClick={() => handleDelete(u)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: "#fee2e2",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <MdDelete size={16} color="#dc2626" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
