import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdCampaign,
  MdCheckCircle,
  MdWarning,
  MdCalendarToday,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getAnnonces,
  createAnnonce,
  updateAnnonce,
  deleteAnnonce,
} from "../../services/annonceService";
import { FiPaperclip } from "react-icons/fi";

const CATEGORIES = [
  "Examens",
  "Événement",
  "Infrastructure",
  "Administration",
  "Stage",
  "Général",
];

const catColors = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Événement: { bg: "#cffafe", color: "#164e63" },
  Infrastructure: { bg: "#dbeafe", color: "#1e40af" },
  Administration: { bg: "#dbeafe", color: "#1e40af" },
  Stage: { bg: "#d1fae5", color: "#065f46" },
  Général: { bg: "#f1f5f9", color: "#475569" },
};

const emptyForm = { titre: "", contenu: "", categorie: "Général" };

export default function AnnoncesAdmin() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef();
  const [files, setFiles] = useState([]);


  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const data = await getAnnonces();
      setAnnonces(data);
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

  const openEdit = (annonce) => {
    setForm({
      titre: annonce.titre,
      contenu: annonce.contenu,
      categorie: annonce.categorie || "Général",
    });
    setSelected(annonce);
    setModal("edit");
  };

  const openDelete = (annonce) => {
    setSelected(annonce);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.titre.trim() || !form.contenu.trim()) {
      showToast("Titre et contenu sont obligatoires.", "error");
      return;
    }
    setSaving(true);
    try {
      if (modal === "add") {
        await createAnnonce(form);
        showToast("Annonce créée avec succès !");
      } else {
        await updateAnnonce(selected.id_annonce, form);
        showToast("Annonce modifiée avec succès !");
      }
      await fetchAnnonces();
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
      await deleteAnnonce(selected.id_annonce);
      showToast("Annonce supprimée.");
      await fetchAnnonces();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = annonces.filter(
    (a) =>
      a.titre?.toLowerCase().includes(search.toLowerCase()) ||
      a.categorie?.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
            Gestion des Annonces
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {annonces.length} annonce{annonces.length > 1 ? "s" : ""} au total
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
          <MdAdd size={18} /> Nouvelle annonce
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
          placeholder="Rechercher une annonce..."
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

      {/* ── TABLE ── */}
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
            gridTemplateColumns: "2fr 1fr 1fr 120px",
            padding: "12px 20px",
            background: "#f8fafc",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Titre", "Catégorie", "Date", "Actions"].map((h) => (
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
            <MdCampaign size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucune annonce trouvée
            </p>
          </div>
        )}

        {/* Lignes */}
        {!loading &&
          filtered.map((annonce, i) => {
            const cat = catColors[annonce.categorie] || catColors["Général"];
            return (
              <div
                key={annonce.id_annonce}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 120px",
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
                {/* Titre */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      flexShrink: 0,
                      background: "var(--cyan-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdCampaign size={18} color="var(--cyan-dark)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "var(--text)",
                        marginBottom: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                      }}
                    >
                      {annonce.titre}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                      }}
                    >
                      {annonce.contenu?.slice(0, 60)}...
                    </p>
                  </div>
                </div>

                {/* Catégorie */}
                <span
                  style={{
                    display: "inline-flex",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-head)",
                    background: cat.bg,
                    color: cat.color,
                  }}
                >
                  {annonce.categorie || "Général"}
                </span>

                {/* Date */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "var(--muted)",
                  }}
                >
                  <MdCalendarToday size={13} />
                  <span style={{ fontSize: 12 }}>
                    {annonce.date_publication
                      ? formatDate(annonce.date_publication)
                      : "—"}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openEdit(annonce)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "#fff",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                    title="Modifier"
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
                    onClick={() => openDelete(annonce)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #fee2e2",
                      background: "#fff",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                    title="Supprimer"
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
              maxWidth: 520,
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
            {/* Header modal */}
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
                  {modal === "add" ? "Nouvelle annonce" : "Modifier l'annonce"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  {modal === "add"
                    ? "Remplissez les champs ci-dessous."
                    : "Modifiez les informations de l'annonce."}
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

            {/* Champs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Titre */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "var(--font-head)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Titre <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Titre de l'annonce"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    transition: "border .2s",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "var(--font-head)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Catégorie
                </label>
                <select
                  value={form.categorie}
                  onChange={(e) =>
                    setForm({ ...form, categorie: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    background: "#fff",
                    color: "var(--text)",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contenu */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "var(--font-head)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Contenu <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={form.contenu}
                  onChange={(e) =>
                    setForm({ ...form, contenu: e.target.value })
                  }
                  placeholder="Rédigez le contenu de l'annonce..."
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    resize: "vertical",
                    transition: "border .2s",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClick}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <FiPaperclip size={20} />
                  </button>

                  <span className="text-sm text-gray-500">
                    Ajouter image / vidéo
                  </span>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,video/*"
                    hidden
                  />
                </div>

                {/* Preview */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {files.map((file, index) => (
                    <div key={index} className="border p-2 rounded">
                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-20 object-cover"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-20"
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
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
                    transition: "all .2s",
                  }}
                >
                  {saving
                    ? "Enregistrement..."
                    : modal === "add"
                      ? "Publier l'annonce"
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
              Supprimer l'annonce ?
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 6,
                lineHeight: 1.6,
              }}
            >
              Vous allez supprimer
            </p>
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: "#0f172a",
                marginBottom: 24,
              }}
            >
              "{selected?.titre}"
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
