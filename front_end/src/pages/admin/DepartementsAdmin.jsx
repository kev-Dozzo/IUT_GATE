import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdAccountBalance,
  MdCheckCircle,
  MdWarning,
  MdPeople,
  MdBook,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getDepartements,
  createDepartement,
  updateDepartement,
  deleteDepartement,
} from "../../services/departementService";

const DEPT_COLORS = [
  { bg: "#cffafe", color: "#0e7490" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fee2e2", color: "#991b1b" },
  { bg: "#fce7f3", color: "#9d174d" },
];

const emptyForm = { nom: "", description: "" };

export default function DepartementsAdmin() {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
      const data = await getDepartements();
      setDepartements(data);
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
    setForm(emptyForm);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (dept) => {
    setForm({ nom: dept.nom || "", description: dept.description || "" });
    setSelected(dept);
    setModal("edit");
  };

  const openDelete = (dept) => {
    setSelected(dept);
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
        await createDepartement(form);
        showToast("Département créé avec succès !");
      } else {
        await updateDepartement(selected.id_departement, form);
        showToast("Département modifié avec succès !");
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
      await deleteDepartement(selected.id_departement);
      showToast("Département supprimé.");
      await fetchData();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = departements.filter(
    (d) =>
      d.nom?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const inputStyle = {
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

  const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    fontFamily: "var(--font-head)",
    display: "block",
    marginBottom: 6,
  };

  return (
    <AdminLayout>
      {/* ── TOAST ── */}
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

      {/* ── HEADER ── */}
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
            Administration
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
            Gestion des Départements
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {departements.length} département
            {departements.length > 1 ? "s" : ""} au total
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
            transition: "all .2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--cyan-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--cyan)")
          }
        >
          <MdAdd size={18} /> Nouveau département
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          border: "1.5px solid var(--border)",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 20,
          maxWidth: 400,
        }}
      >
        <MdSearch size={18} style={{ color: "var(--subtle)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un département..."
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

      {/* ── GRILLE CARDS ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
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

      {!loading && filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "var(--muted)",
          }}
        >
          <MdAccountBalance
            size={40}
            style={{ opacity: 0.3, marginBottom: 12 }}
          />
          <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
            Aucun département trouvé
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((dept, i) => {
            const col = DEPT_COLORS[i % DEPT_COLORS.length];
            return (
              <div
                key={dept.id_departement}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  padding: "22px",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = col.color;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${col.bg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 13,
                      background: col.bg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdAccountBalance size={24} color={col.color} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => openEdit(dept)}
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
                        transition: "all .2s",
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
                      onClick={() => openDelete(dept)}
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
                        transition: "all .2s",
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

                {/* Nom */}
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  {dept.nom}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    lineHeight: 1.6,
                    marginBottom: 14,
                    minHeight: 36,
                  }}
                >
                  {dept.description?.slice(0, 90) || "Aucune description."}
                  {dept.description?.length > 90 ? "..." : ""}
                </p>

                {/* Stats */}
                <div
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: 12,
                    display: "flex",
                    gap: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <MdPeople size={14} color={col.color} />
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {dept.enseignants_count ?? 0} enseignant
                      {(dept.enseignants_count ?? 0) > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <MdBook size={14} color={col.color} />
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {dept.filieres_count ?? 0} filière
                      {(dept.filieres_count ?? 0) > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL ADD / EDIT ── */}
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
              maxWidth: 480,
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
                  {modal === "add"
                    ? "Nouveau département"
                    : "Modifier le département"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  Remplissez les informations du département.
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
                <label style={labelStyle}>
                  Nom du département <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Génie Informatique"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Décrivez le département..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Boutons */}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: saving ? "var(--subtle)" : "var(--cyan)",
                    color: saving ? "#fff" : "var(--cyan-text)",
                    border: "none",
                    borderRadius: 10,
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving
                    ? "Enregistrement..."
                    : modal === "add"
                      ? "Créer"
                      : "Enregistrer"}
                </button>
                <button
                  onClick={closeModal}
                  style={{
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
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ── */}
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
              Supprimer le département ?
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
              Toutes les filières rattachées seront également affectées.
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
              <button
                onClick={closeModal}
                style={{
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
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
