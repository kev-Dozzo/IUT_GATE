import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdLink,
  MdSchool,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getProgrammesAdmin,
  createProgramme,
  updateProgramme,
  deleteProgramme,
} from "../../services/programmeService";

const CYCLES = ["DUT", "BTS", "LICENCE", "MASTER"];
const CYCLE_COLORS = {
  DUT: "#0e7490",
  BTS: "#065f46",
  LICENCE: "#5b21b6",
  MASTER: "#92400e",
};

export default function ProgrammesAdmin() {
  const [programmes, setProgrammes] = useState([]);
  const [cycle, setCycle] = useState("tous");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    cycle: "DUT",
    departement: "",
    lien_cours: "",
    lien_externe: "",
    ordre: 0,
  });
  const [saving, setSaving] = useState(false);

  const load = () =>
    getProgrammesAdmin().then(setProgrammes).catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const filtered =
    cycle === "tous" ? programmes : programmes.filter((p) => p.cycle === cycle);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nom: "",
      description: "",
      cycle: cycle !== "tous" ? cycle : "DUT",
      departement: "",
      lien_cours: "",
      lien_externe: "",
      ordre: filtered.length,
    });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      nom: p.nom,
      description: p.description || "",
      cycle: p.cycle,
      departement: p.departement || "",
      lien_cours: p.lien_cours || "",
      lien_externe: p.lien_externe || "",
      ordre: p.ordre,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.nom || !form.cycle) return alert("Nom et cycle requis");
    setSaving(true);
    try {
      if (editing) await updateProgramme(editing.id_programme, form);
      else await createProgramme(form);
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
    await deleteProgramme(p.id_programme);
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
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
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
              Programmes Scolaires
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              {programmes.length} programme(s)
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

        {/* Filtres cycle */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {["tous", ...CYCLES].map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: `1.5px solid ${cycle === c ? "var(--cyan)" : "var(--border)"}`,
                background: cycle === c ? "var(--cyan-light)" : "#fff",
                color: cycle === c ? "var(--cyan-dark)" : "var(--muted)",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {c === "tous" ? "Tous" : c}
              <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>
                (
                {c === "tous"
                  ? programmes.length
                  : programmes.filter((p) => p.cycle === c).length}
                )
              </span>
            </button>
          ))}
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
                {editing ? "Modifier le programme" : "Nouveau programme"}
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
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Nom du programme *</label>
                <input
                  value={form.nom}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nom: e.target.value }))
                  }
                  placeholder="Ex: Génie Informatique"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Cycle *</label>
                <select
                  value={form.cycle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cycle: e.target.value }))
                  }
                  style={inp}
                >
                  {CYCLES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Département</label>
                <input
                  value={form.departement}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, departement: e.target.value }))
                  }
                  placeholder="Ex: GEII"
                  style={inp}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  style={{ ...inp, resize: "vertical" }}
                />
              </div>
              <div>
                <label style={lbl}>Lien cours (téléchargement)</label>
                <input
                  value={form.lien_cours}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lien_cours: e.target.value }))
                  }
                  placeholder="https://..."
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Lien externe (site étudiants)</label>
                <input
                  value={form.lien_externe}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lien_externe: e.target.value }))
                  }
                  placeholder="https://..."
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

        {/* Liste groupée par cycle */}
        {CYCLES.filter((c) => cycle === "tous" || c === cycle).map((c) => {
          const items = filtered.filter((p) => p.cycle === c);
          if (items.length === 0) return null;
          return (
            <div key={c} style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    padding: "3px 14px",
                    borderRadius: 999,
                    background: `${CYCLE_COLORS[c]}22`,
                    color: CYCLE_COLORS[c],
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {c}
                </span>
                <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {items.length} programme(s)
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {items.map((p, i) => (
                  <div
                    key={p.id_programme}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderTop: i === 0 ? "1px solid #e2e8f0" : "none",
                      borderRadius:
                        i === 0
                          ? "12px 12px 0 0"
                          : i === items.length - 1
                            ? "0 0 12px 12px"
                            : 0,
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 40,
                        borderRadius: 2,
                        background: CYCLE_COLORS[c],
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#0f172a",
                          marginBottom: 2,
                        }}
                      >
                        {p.nom}
                      </p>
                      <div
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                      >
                        {p.departement && (
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>
                            Dept: {p.departement}
                          </span>
                        )}
                        {p.lien_cours && (
                          <span style={{ fontSize: 11, color: "var(--cyan)" }}>
                            📥 Cours
                          </span>
                        )}
                        {p.lien_externe && (
                          <span style={{ fontSize: 11, color: "#5b21b6" }}>
                            🔗 Site
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "var(--cyan-light)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <MdEdit size={15} color="var(--cyan-dark)" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#fee2e2",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <MdDelete size={15} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
