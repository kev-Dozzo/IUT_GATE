import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdMeetingRoom,
  MdCheckCircle,
  MdWarning,
  MdPeople,
  MdApartment,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getSalles,
  createSalle,
  updateSalle,
  deleteSalle,
} from "../../services/salleService";
import { getBatiments } from "../../services/batimentService";

const TYPES = [
  "Salle de cours",
  "Amphithéâtre",
  "Laboratoire Informatique",
  "Laboratoire Sciences",
  "Salle de réunion",
  "Bureau",
  "Bibliothèque",
  "Autre",
];

const typeColors = {
  Amphithéâtre: { bg: "#cffafe", color: "#0e7490" },
  "Laboratoire Informatique": { bg: "#d1fae5", color: "#065f46" },
  "Laboratoire Sciences": { bg: "#fef3c7", color: "#92400e" },
  "Salle de cours": { bg: "#dbeafe", color: "#1e40af" },
  "Salle de réunion": { bg: "#ede9fe", color: "#5b21b6" },
  Bureau: { bg: "#fee2e2", color: "#991b1b" },
  Bibliothèque: { bg: "#fce7f3", color: "#9d174d" },
  Autre: { bg: "#f1f5f9", color: "#475569" },
};

const emptyForm = {
  nom: "",
  capacite: "",
  type: "Salle de cours",
  id_batiment: "",
};

export default function SallesAdmin() {
  const [salles, setSalles] = useState([]);
  const [batiments, setBatiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sals, bats] = await Promise.all([getSalles(), getBatiments()]);
      setSalles(sals);
      setBatiments(bats);
    } catch {
      showToast("Erreur lors du chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, id_batiment: batiments[0]?.id_batiment || "" });
    setSelected(null);
    setModal("add");
  };

  const openEdit = (salle) => {
    setForm({
      nom: salle.nom || "",
      capacite: salle.capacite || "",
      type: salle.type || "Salle de cours",
      id_batiment: salle.id_batiment || "",
    });
    setSelected(salle);
    setModal("edit");
  };

  const openDelete = (salle) => {
    setSelected(salle);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.nom.trim()) {
      showToast("Le nom est obligatoire.", "error");
      return;
    }
    setSaving(true);
    try {
      if (modal === "add") {
        await createSalle(form);
        showToast("Salle créée avec succès !");
      } else {
        await updateSalle(selected.id_salle, form);
        showToast("Salle modifiée avec succès !");
      }
      await fetchData();
      closeModal();
    } catch {
      showToast("Une erreur est survenue.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteSalle(selected.id_salle);
      showToast("Salle supprimée.");
      await fetchData();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = salles.filter((s) => {
    const matchSearch =
      s.nom?.toLowerCase().includes(search.toLowerCase()) ||
      s.type?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Tous" || s.type === filterType;
    return matchSearch && matchType;
  });

  const inp = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    color: "var(--text)",
    transition: "border .2s",
    background: "#fff",
  };

  const lbl = {
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    fontFamily: "var(--font-head)",
    display: "block",
    marginBottom: 6,
  };

  const btnCancel = {
    flex: 1,
    padding: "12px",
    background: "transparent",
    color: "var(--muted)",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    fontFamily: "var(--font-head)",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  };

  return (
    <AdminLayout>
      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            background: toast.type === "error" ? "#fee2e2" : "#d1fae5",
            border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#6ee7b7"}`,
            borderRadius: 10,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            fontFamily: "var(--font-head)",
            fontWeight: 600,
            fontSize: 13,
            color: toast.type === "error" ? "#991b1b" : "#065f46",
          }}
        >
          {toast.type === "error" ? (
            <MdWarning size={18} />
          ) : (
            <MdCheckCircle size={18} />
          )}
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
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
            Infrastructure
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: -0.5,
            }}
          >
            Gestion des Salles
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {salles.length} salle{salles.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--cyan)",
            color: "var(--cyan-text)",
            border: "none",
            borderRadius: 10,
            padding: "11px 20px",
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--cyan-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--cyan)")
          }
        >
          <MdAdd size={18} /> Nouvelle salle
        </button>
      </div>

      {/* SEARCH + FILTRE TYPE */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            border: "1.5px solid var(--border)",
            borderRadius: 10,
            padding: "10px 14px",
            flex: 1,
            minWidth: 220,
          }}
        >
          <MdSearch size={18} style={{ color: "var(--subtle)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une salle..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              background: "transparent",
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
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ ...inp, width: 200, cursor: "pointer" }}
        >
          <option value="Tous">Tous les types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* En-tête */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
            padding: "12px 20px",
            background: "#f8fafc",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Salle", "Type", "Capacité", "Bâtiment", "Actions"].map((h) => (
            <p
              key={h}
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 11,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {h}
            </p>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto 12px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "var(--muted)", fontSize: 13 }}>Chargement...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Vide */}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
            }}
          >
            <MdMeetingRoom
              size={40}
              style={{ opacity: 0.3, marginBottom: 12 }}
            />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucune salle trouvée
            </p>
          </div>
        )}

        {/* Lignes */}
        {!loading &&
          filtered.map((salle, i) => {
            const tc = typeColors[salle.type] || typeColors["Autre"];
            const bat = batiments.find(
              (b) => b.id_batiment === salle.id_batiment,
            );
            return (
              <div
                key={salle.id_salle}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                  padding: "14px 20px",
                  alignItems: "center",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Salle */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: tc.bg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdMeetingRoom size={20} color={tc.color} />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--text)",
                    }}
                  >
                    {salle.nom}
                  </p>
                </div>

                {/* Type */}
                <span
                  style={{
                    display: "inline-flex",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-head)",
                    background: tc.bg,
                    color: tc.color,
                  }}
                >
                  {salle.type || "—"}
                </span>

                {/* Capacité */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MdPeople size={14} color="var(--subtle)" />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {salle.capacite ? `${salle.capacite} places` : "—"}
                  </span>
                </div>

                {/* Bâtiment */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MdApartment size={14} color="var(--subtle)" />
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bat?.nom || "—"}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openEdit(salle)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--cyan-light)";
                      e.currentTarget.style.borderColor = "var(--cyan)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <MdEdit size={15} color="var(--cyan-dark)" />
                  </button>
                  <button
                    onClick={() => openDelete(salle)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #fee2e2",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.borderColor = "#fca5a5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#fee2e2";
                    }}
                  >
                    <MdDelete size={15} color="#dc2626" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* MODAL ADD / EDIT */}
      {(modal === "add" || modal === "edit") && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(12,26,64,.6)",
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
              borderRadius: 18,
              padding: "36px",
              width: "100%",
              maxWidth: 520,
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {modal === "add" ? "Nouvelle salle" : "Modifier la salle"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  Remplissez les informations de la salle.
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <MdClose size={18} color="var(--muted)" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Nom */}
              <div>
                <label style={lbl}>
                  Nom de la salle <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Salle 101, Amphi A..."
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Type + Capacité */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={lbl}>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={{ ...inp, cursor: "pointer" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Capacité (places)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacite}
                    onChange={(e) =>
                      setForm({ ...form, capacite: e.target.value })
                    }
                    placeholder="Ex: 40"
                    style={inp}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              </div>

              {/* Bâtiment */}
              <div>
                <label style={lbl}>Bâtiment</label>
                <select
                  value={form.id_batiment}
                  onChange={(e) =>
                    setForm({ ...form, id_batiment: e.target.value })
                  }
                  style={{ ...inp, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                >
                  <option value="">-- Choisir un bâtiment --</option>
                  {batiments.map((b) => (
                    <option key={b.id_batiment} value={b.id_batiment}>
                      {b.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons */}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    borderRadius: 10,
                    background: saving ? "var(--subtle)" : "var(--cyan)",
                    color: saving ? "#fff" : "var(--cyan-text)",
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving
                    ? "Enregistrement..."
                    : modal === "add"
                      ? "Créer la salle"
                      : "Enregistrer"}
                </button>
                <button onClick={closeModal} style={btnCancel}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modal === "delete" && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(12,26,64,.6)",
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
              borderRadius: 18,
              padding: "36px",
              width: "100%",
              maxWidth: 420,
              textAlign: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <MdDelete size={28} color="#dc2626" />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 18,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 8,
              }}
            >
              Supprimer la salle ?
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
              Vous allez supprimer
            </p>
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: "#0f172a",
                marginBottom: 8,
              }}
            >
              {selected?.nom}
            </p>
            <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 24 }}>
              Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: saving ? "var(--subtle)" : "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Suppression..." : "Oui, supprimer"}
              </button>
              <button onClick={closeModal} style={btnCancel}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
