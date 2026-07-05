import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdCalendarToday,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getEvenements,
  createEvenement,
  updateEvenement,
  deleteEvenement,
} from "../../services/calendrierService";

const TYPES = [
  "Examens",
  "Cours",
  "Congé",
  "Événement",
  "Concours",
  "Résultats",
];
const CYCLES = ["tous", "DUT", "BTS", "LICENCE", "MASTER"];

const TYPE_COLORS = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Cours: { bg: "#d1fae5", color: "#065f46" },
  Congé: { bg: "#ede9fe", color: "#5b21b6" },
  Événement: { bg: "#cffafe", color: "#0e7490" },
  Concours: { bg: "#dbeafe", color: "#1e40af" },
  Résultats: { bg: "#fef3c7", color: "#92400e" },
};

const MOIS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`;
};

export default function CalendrierAdmin() {
  const [evenements, setEvenements] = useState([]);
  const [filtreCycle, setFiltreCycle] = useState("tous");
  const [filtreType, setFiltreType] = useState("tous");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    type: "Cours",
    cycle: "tous",
    couleur: "#0e7490",
  });

  const load = () => getEvenements().then(setEvenements).catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const filtered = evenements
    .filter((e) => {
      const okCycle =
        filtreCycle === "tous" || e.cycle === filtreCycle || e.cycle === "tous";
      const okType = filtreType === "tous" || e.type === filtreType;
      return okCycle && okType;
    })
    .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));

  // Groupe par mois
  const grouped = filtered.reduce((acc, ev) => {
    const d = new Date(ev.date_debut);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = `${MOIS[d.getMonth()]} ${d.getFullYear()}`;
    if (!acc[key]) acc[key] = { label, events: [] };
    acc[key].events.push(ev);
    return acc;
  }, {});

  const openCreate = () => {
    setEditing(null);
    setForm({
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      type: "Cours",
      cycle: "tous",
      couleur: "#0e7490",
    });
    setShowForm(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      titre: ev.titre,
      description: ev.description || "",
      date_debut: ev.date_debut,
      date_fin: ev.date_fin || "",
      type: ev.type,
      cycle: ev.cycle,
      couleur: ev.couleur || "#0e7490",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.titre || !form.date_debut)
      return alert("Titre et date de début requis");
    setSaving(true);
    try {
      if (editing) await updateEvenement(editing.id_evenement, form);
      else await createEvenement(form);
      setShowForm(false);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev) => {
    if (!confirm(`Supprimer "${ev.titre}" ?`)) return;
    await deleteEvenement(ev.id_evenement);
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
  const today = new Date().toISOString().split("T")[0];

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
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
              Calendrier Académique
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              {evenements.length} événement(s)
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

        {/* Filtres */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {CYCLES.map((c) => (
              <button
                key={c}
                onClick={() => setFiltreCycle(c)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: `1.5px solid ${filtreCycle === c ? "var(--cyan)" : "var(--border)"}`,
                  background: filtreCycle === c ? "var(--cyan-light)" : "#fff",
                  color:
                    filtreCycle === c ? "var(--cyan-dark)" : "var(--muted)",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {c === "tous" ? "Tous cycles" : c}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["tous", ...TYPES].map((t) => (
              <button
                key={t}
                onClick={() => setFiltreType(t)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: `1.5px solid ${filtreType === t ? "#0f172a" : "var(--border)"}`,
                  background: filtreType === t ? "#0f172a" : "#fff",
                  color: filtreType === t ? "#fff" : "var(--muted)",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {t === "tous" ? "Tous types" : t}
              </button>
            ))}
          </div>
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
                {editing ? "Modifier l'événement" : "Nouvel événement"}
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
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Titre *</label>
                <input
                  value={form.titre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titre: e.target.value }))
                  }
                  placeholder="Ex: Concours d'entrée FI 2026"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Date de début *</label>
                <input
                  type="date"
                  value={form.date_debut}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date_debut: e.target.value }))
                  }
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Date de fin (optionnel)</label>
                <input
                  type="date"
                  value={form.date_fin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date_fin: e.target.value }))
                  }
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  style={inp}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Cycle concerné</label>
                <select
                  value={form.cycle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cycle: e.target.value }))
                  }
                  style={inp}
                >
                  {CYCLES.map((c) => (
                    <option key={c} value={c}>
                      {c === "tous" ? "Tous les cycles" : c}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Détails de l'événement..."
                  style={{ ...inp, resize: "vertical" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
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

        {/* Liste groupée par mois */}
        {Object.keys(grouped).length === 0 ? (
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
            <MdCalendarToday
              size={40}
              style={{ opacity: 0.2, marginBottom: 12 }}
            />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucun événement
            </p>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              Cliquez sur "Ajouter" pour créer un événement
            </p>
          </div>
        ) : (
          Object.values(grouped).map(({ label, events }) => (
            <div key={label} style={{ marginBottom: 32 }}>
              {/* Header mois */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {label}
                </h2>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {events.length} événement(s)
                </span>
              </div>

              {/* Événements du mois */}
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {events.map((ev, i) => {
                  const conf = TYPE_COLORS[ev.type] || {
                    bg: "#f1f5f9",
                    color: "#475569",
                  };
                  const d = new Date(ev.date_debut);
                  const isPast = ev.date_debut < today;
                  const isToday = ev.date_debut === today;
                  const isFirst = i === 0;
                  const isLast = i === events.length - 1;

                  return (
                    <div
                      key={ev.id_evenement}
                      style={{
                        background: isToday ? "var(--cyan-light)" : "#fff",
                        border: `1px solid ${isToday ? "var(--cyan)" : "#e2e8f0"}`,
                        borderTop: isFirst ? undefined : "none",
                        borderRadius: isFirst
                          ? "12px 12px 0 0"
                          : isLast
                            ? "0 0 12px 12px"
                            : 0,
                        padding: "14px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        opacity: isPast && !isToday ? 0.55 : 1,
                      }}
                    >
                      {/* Date */}
                      <div
                        style={{
                          flexShrink: 0,
                          textAlign: "center",
                          width: 44,
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: 22,
                            color: isToday ? "var(--cyan-dark)" : "#0f172a",
                            lineHeight: 1,
                          }}
                        >
                          {d.getDate()}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "var(--muted)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {MOIS[d.getMonth()]}
                        </p>
                      </div>

                      <div
                        style={{
                          width: 1,
                          height: 36,
                          background: "#f1f5f9",
                          flexShrink: 0,
                        }}
                      />

                      {/* Infos */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              padding: "2px 10px",
                              borderRadius: 999,
                              background: conf.bg,
                              color: conf.color,
                              fontSize: 10,
                              fontWeight: 700,
                              fontFamily: "var(--font-head)",
                            }}
                          >
                            {ev.type}
                          </span>
                          {ev.cycle !== "tous" && (
                            <span
                              style={{
                                padding: "2px 10px",
                                borderRadius: 999,
                                background: "#f1f5f9",
                                color: "#475569",
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "var(--font-head)",
                              }}
                            >
                              {ev.cycle}
                            </span>
                          )}
                          {isToday && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "var(--cyan-dark)",
                                fontFamily: "var(--font-head)",
                              }}
                            >
                              · Aujourd'hui
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#0f172a",
                            marginBottom: 2,
                          }}
                        >
                          {ev.titre}
                        </p>
                        {ev.date_fin && ev.date_fin !== ev.date_debut && (
                          <p style={{ fontSize: 11, color: "var(--muted)" }}>
                            Jusqu'au {formatDate(ev.date_fin)}
                          </p>
                        )}
                        {ev.description && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--muted)",
                              marginTop: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ev.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => openEdit(ev)}
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
                          onClick={() => handleDelete(ev)}
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
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
