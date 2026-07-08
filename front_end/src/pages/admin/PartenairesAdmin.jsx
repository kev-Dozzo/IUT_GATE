import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdLink,
  MdDragIndicator,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getPartenairesAdmin,
  createPartenaire,
  updatePartenaire,
  deletePartenaire,
  getLogoUrl,
} from "../../services/partenaireService";

export default function PartenairesAdmin() {
  const [partenaires, setPartenaires] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    lien: "",
    description: "",
    ordre: 0,
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getPartenairesAdmin().then(setPartenaires).catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nom: "", lien: "", description: "", ordre: partenaires.length });
    setLogo(null);
    setPreview(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      nom: p.nom,
      lien: p.lien || "",
      description: p.description || "",
      ordre: p.ordre,
    });
    setLogo(null);
    setPreview(null);
    setShowForm(true);
  };

  const handleLogo = (e) => {
    const f = e.target.files[0];
    setLogo(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.nom.trim()) return alert("Nom requis");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append("logo", logo);

      if (editing) await updatePartenaire(editing.id_partenaire, fd);
      else await createPartenaire(fd);

      setShowForm(false);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Supprimer "${p.nom}" ?`)) return;
    await deletePartenaire(p.id_partenaire);
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
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "var(--font-body)",
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
              Partenaires
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              {partenaires.length} partenaire(s)
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
                {editing ? "Modifier" : "Nouveau partenaire"}
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
                <label style={lbl}>Nom *</label>
                <input
                  value={form.nom}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nom: e.target.value }))
                  }
                  placeholder="Université de Douala"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Lien (URL)</label>
                <input
                  value={form.lien}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lien: e.target.value }))
                  }
                  placeholder="https://..."
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Description</label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Description courte"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Ordre d'affichage</label>
                <input
                  type="number"
                  value={form.ordre}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      ordre: parseInt(e.target.value) || 0,
                    }))
                  }
                  style={inp}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Logo (PNG, SVG, JPG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogo}
                style={{ ...inp, padding: 8 }}
              />
              {(preview || editing?.logo_url) && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <img
                    src={preview || getLogoUrl(editing?.logo_url)}
                    alt="preview"
                    style={{
                      height: 48,
                      maxWidth: 160,
                      objectFit: "contain",
                      background: "#f8fafc",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                    }}
                  />
                  {preview && (
                    <button
                      onClick={() => {
                        setLogo(null);
                        setPreview(null);
                      }}
                      style={{
                        fontSize: 11,
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Retirer
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
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
                {saving
                  ? "Enregistrement..."
                  : editing
                    ? "Modifier"
                    : "Ajouter"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: "12px",
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
        {partenaires.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
              background: "#f8fafc",
              borderRadius: 16,
              border: "1px dashed var(--border)",
            }}
          >
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucun partenaire
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {partenaires.map((p, i) => (
              <div
                key={p.id_partenaire}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderTop: i === 0 ? "1px solid #e2e8f0" : "none",
                  borderRadius:
                    i === 0
                      ? "12px 12px 0 0"
                      : i === partenaires.length - 1
                        ? "0 0 12px 12px"
                        : 0,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: p.actif ? 1 : 0.5,
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    width: 80,
                    height: 48,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8fafc",
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                  }}
                >
                  {p.logo_url ? (
                    <img
                      src={getLogoUrl(p.logo_url)}
                      alt={p.nom}
                      style={{
                        maxHeight: 40,
                        maxWidth: 72,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        fontWeight: 600,
                        textAlign: "center",
                        padding: 4,
                      }}
                    >
                      Pas de logo
                    </span>
                  )}
                </div>

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
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
                      {p.nom}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "1px 7px",
                        borderRadius: 999,
                        background: p.actif ? "#d1fae5" : "#fee2e2",
                        color: p.actif ? "#065f46" : "#991b1b",
                        fontWeight: 700,
                      }}
                    >
                      {p.actif ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  {p.lien && (
                    <p style={{ fontSize: 11, color: "var(--cyan)" }}>
                      {p.lien}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(p)}
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
                  <button
                    onClick={() => handleDelete(p)}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
