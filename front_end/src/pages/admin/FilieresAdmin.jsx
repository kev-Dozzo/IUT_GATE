import { useState, useEffect, useCallback } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdSchool,
  MdCheckCircle,
  MdWarning,
  MdAccessTime,
  MdPeople,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getFilieres,
  createFiliere,
  updateFiliere,
  deleteFiliere,
} from "../../services/filiereService";
import { getDepartements } from "../../services/departementService";
import PhotoUpload from "../../components/ui/PhotoUpload";
import { BASE_URL } from "../../config/constants";

const DUREES = ["1 an", "2 ans", "3 ans", "4 ans", "5 ans"];

const dureeColors = {
  "2 ans": { bg: "#d1fae5", color: "#065f46" },
  "3 ans": { bg: "#cffafe", color: "#164e63" },
  "4 ans": { bg: "#ede9fe", color: "#5b21b6" },
};

const emptyForm = {
  nom: "",
  description: "",
  duree: "3 ans",
  condition_admission: "",
  places: "",
  id_departement: "",
};

export default function FilieresAdmin() {
  const [filieres, setFilieres] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fils, depts] = await Promise.all([
        getFilieres(),
        getDepartements(),
      ]);
      setFilieres(fils);
      setDepartements(depts);
    } catch {
      showToast("Erreur lors du chargement.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setForm({
      ...emptyForm,
      id_departement: departements[0]?.id_departement || "",
    });
    setSelected(null);
    setModal("add");
  };

  const openEdit = (filiere) => {
    setForm({
      nom: filiere.nom || "",
      description: filiere.description || "",
      duree: filiere.duree || "3 ans",
      condition_admission: filiere.condition_admission || "",
      places: filiere.places || "",
      id_departement: filiere.id_departement || "",
    });
    setSelected(filiere);
    setModal("edit");
  };

  const openDelete = (filiere) => {
    setSelected(filiere);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.nom.trim() || !form.description.trim()) {
      showToast("Nom et description sont obligatoires.", "error");
      return;
    }
    setSaving(true);
    try {
      if (modal === "add") {
        await createFiliere(form, photo);
        showToast("Filière créée avec succès !");
      } else {
        await updateFiliere(selected.id_filiere, form, photo);
        showToast("Filière modifiée avec succès !");
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
      await deleteFiliere(selected.id_filiere);
      showToast("Filière supprimée.");
      await fetchData();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = filieres.filter(
    (f) =>
      f.nom?.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()),
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
            Gestion des Filières
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {filieres.length} filière{filieres.length > 1 ? "s" : ""} au total
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
          <MdAdd size={18} /> Nouvelle filière
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
          placeholder="Rechercher une filière..."
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

      {/* ── LISTE RESPONSIVE EN CARDS ── */}
      <div style={{ marginTop: 6 }}>
        {loading ? (
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
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
            }}
          >
            <MdSchool size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucune filière trouvée
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 18,
            }}
          >
            {filtered.map((filiere) => {
              const duree = dureeColors[filiere.duree] || dureeColors["3 ans"];
              const dept = departements.find(
                (d) => d.id_departement === filiere.id_departement,
              );
              const imageUrl = filiere.photo_url
                ? `${BASE_URL}${filiere.photo_url}`
                : null;
              return (
                <div
                  key={filiere.id_filiere}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    overflow: "hidden",
                    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      minHeight: 140,
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={filiere.nom}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    ) : (
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 14,
                          background: "var(--cyan-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdSchool size={28} color="var(--cyan-dark)" />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: 16,
                            color: "var(--text)",
                            marginBottom: 4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {filiere.nom}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {filiere.description}
                        </p>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "7px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          background: duree.bg,
                          color: duree.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <MdAccessTime size={14} />
                        {filiere.duree}
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={{ fontSize: 13, color: "var(--text)" }}>
                        <strong>Département :</strong> {dept?.nom || "—"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "var(--muted)",
                          fontSize: 13,
                        }}
                      >
                        <MdPeople size={16} />
                        {filiere.places
                          ? `${filiere.places} places`
                          : "Places non définies"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => openEdit(filiere)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                        title="Modifier"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "var(--cyan-light)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                        }}
                      >
                        <MdEdit size={16} color="var(--cyan-dark)" /> Modifier
                      </button>
                      <button
                        onClick={() => openDelete(filiere)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: "1px solid #fee2e2",
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                        title="Supprimer"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                        }}
                      >
                        <MdDelete size={16} color="#dc2626" /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              maxWidth: 560,
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
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
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {modal === "add" ? "Nouvelle filière" : "Modifier la filière"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  Remplissez les informations de la filière.
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <PhotoUpload
                value={
                  selected?.photo_url
                    ? `${BASE_URL}${selected.photo_url}`
                    : null
                }
                onChange={setPhoto}
                size={90}
                shape="rounded"
                label="Logo de la filière"
                placeholder="image"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Nom */}
              <div>
                <label style={labelStyle}>
                  Nom de la filière <span style={{ color: "#ef4444" }}>*</span>
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

              {/* Département + Durée */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>Département</label>
                  <select
                    value={form.id_departement}
                    onChange={(e) =>
                      setForm({ ...form, id_departement: e.target.value })
                    }
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  >
                    <option value="">-- Choisir --</option>
                    {departements.map((d) => (
                      <option key={d.id_departement} value={d.id_departement}>
                        {d.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Durée</label>
                  <select
                    value={form.duree}
                    onChange={(e) =>
                      setForm({ ...form, duree: e.target.value })
                    }
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  >
                    {DUREES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Places */}
              <div>
                <label style={labelStyle}>Nombre de places</label>
                <input
                  type="number"
                  value={form.places}
                  onChange={(e) => setForm({ ...form, places: e.target.value })}
                  placeholder="Ex: 50"
                  min={1}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>
                  Description <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Décrivez la filière..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.7,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Conditions d'admission */}
              <div>
                <label style={labelStyle}>Conditions d'admission</label>
                <textarea
                  value={form.condition_admission}
                  onChange={(e) =>
                    setForm({ ...form, condition_admission: e.target.value })
                  }
                  placeholder="Ex: Baccalauréat C, D ou TI avec mention..."
                  rows={2}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.7,
                  }}
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
                      ? "Créer la filière"
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
              Supprimer la filière ?
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
