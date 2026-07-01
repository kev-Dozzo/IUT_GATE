import { useState, useEffect, useCallback } from "react";
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
  MdUpload,
  MdImage,
  MdPictureAsPdf,
  MdVideoFile,
  MdInsertDriveFile,
  MdAudioFile,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getActualites,
  createActualite,
  updateActualite,
  deleteActualite,
} from "../../services/actualiteService";
import { BASE_URL } from "../../config/constants";

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
const ACTUALITES_DRAFT_KEY = "iutgate_actualites_draft";

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(ACTUALITES_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearDraft = () => {
  try {
    localStorage.removeItem(ACTUALITES_DRAFT_KEY);
  } catch {
    // ignore
  }
};

// ── Icône selon type de fichier ──
const FileIcon = ({ type }) => {
  if (type?.startsWith("image/")) return <MdImage size={18} color="#0e7490" />;
  if (type?.startsWith("video/"))
    return <MdVideoFile size={18} color="#5b21b6" />;
  if (type?.startsWith("audio/"))
    return <MdAudioFile size={18} color="#92400e" />;
  if (type === "application/pdf")
    return <MdPictureAsPdf size={18} color="#991b1b" />;
  return <MdInsertDriveFile size={18} color="#475569" />;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export default function ActualitesAdmin() {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Fichiers
  const [fichiers, setFichiers] = useState([]); // File[] — nouveaux
  const [previews, setPreviews] = useState([]); // {url, nom, type, taille}[]
  const [dragOver, setDragOver] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await getActualites();
      setActualites(data);
    } catch {
      showToast("Erreur lors du chargement.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (modal === "add" || modal === "edit") {
      const draft = {
        form,
        fichiersMeta: fichiers.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      };

      if (
        draft.form.titre.trim() ||
        draft.form.contenu.trim() ||
        draft.fichiersMeta.length > 0
      ) {
        try {
          localStorage.setItem(ACTUALITES_DRAFT_KEY, JSON.stringify(draft));
        } catch {
          // ignore
        }
      } else {
        clearDraft();
      }
    }
  }, [form, fichiers, modal]);

  // Gestion fichiers

  const addFichiers = (files) => {
    const arr = Array.from(files);
    const restant = 5 - fichiers.length;
    if (restant <= 0) {
      showToast("Maximum 5 fichiers atteint.", "error");
      return;
    }
    const toAdd = arr.slice(0, restant);
    if (toAdd.length < arr.length)
      showToast(`Seulement ${restant} fichier(s) ajouté(s) — max 5.`, "error");

    setFichiers((prev) => [...prev, ...toAdd]);

    // Générer previews
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [
          ...prev,
          {
            url: file.type.startsWith("image/") ? e.target.result : null,
            nom: file.originalname || file.name,
            type: file.type,
            taille: file.size,
            local: true,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFichier = (index) => {
    setFichiers((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFichiers(e.dataTransfer.files);
  };

  const openAdd = () => {
    const draft = loadDraft();

    if (draft?.form && (draft.form.titre || draft.form.contenu)) {
      setForm({ ...emptyForm, ...draft.form });
      showToast("Brouillon restauré automatiquement.", "success");
    } else {
      setForm(emptyForm);
    }

    setFichiers([]);
    setPreviews([]);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (a) => {
    clearDraft();
    setForm({
      titre: a.titre,
      contenu: a.contenu,
      categorie: a.categorie || "Général",
    });
    setFichiers([]);
    // Charger fichiers existants en preview
    const existants = a.fichiers ? JSON.parse(a.fichiers) : [];
    setPreviews(
      existants.map((f) => ({
        url: f.type?.startsWith("image/") ? `${BASE_URL}${f.url}` : null,
        nom: f.nom,
        type: f.type,
        taille: f.taille,
        local: false,
        url_serveur: `${BASE_URL}${f.url}`,
      })),
    );
    setSelected(a);
    setModal("edit");
  };

  const openDelete = (a) => {
    setSelected(a);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(emptyForm);
    setFichiers([]);
    setPreviews([]);
  };

  const handleSave = async () => {
    if (!form.titre.trim() || !form.contenu.trim()) {
      showToast("Titre et contenu sont obligatoires.", "error");
      return;
    }
    setSaving(true);
    try {
      if (modal === "add") {
        await createActualite(form, fichiers);
        showToast("Actualité créée avec succès !");
      } else {
        await updateActualite(selected.id_actualite, form, fichiers);
        showToast("Actualité modifiée avec succès !");
      }
      clearDraft();
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
      await deleteActualite(selected.id_actualite);
      showToast("Actualité supprimée.");
      await fetchData();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = actualites.filter(
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

  return (
    <AdminLayout>
      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
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
            Gestion des Actualités
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {actualites.length} actualité{actualites.length > 1 ? "s" : ""} au
            total
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
          <MdAdd size={18} /> Nouvelle actualité
        </button>
      </div>

      {/* SEARCH */}
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
          placeholder="Rechercher une actualité..."
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

      {/* LISTE - Cartes responsive */}
      {modal === null && (
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
              <p style={{ color: "var(--muted)", fontSize: 13 }}>
                Chargement...
              </p>
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
              <MdCampaign
                size={40}
                style={{ opacity: 0.3, marginBottom: 12 }}
              />
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                Aucune actualité trouvée
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 12,
              }}
            >
              {filtered.map((a) => {
                const cat = catColors[a.categorie] || catColors["Général"];
                const fics = a.fichiers ? JSON.parse(a.fichiers) : [];
                const img = a.photo_url
                  ? `{BASE_URL}${a.photo_url}`
                  : fics[0] && fics[0].type?.startsWith("image/")
                    ? `{BASE_URL}${fics[0].url}`
                    : null;
                return (
                  <div
                    key={a.id_actualite}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {img ? (
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          overflow: "hidden",
                          borderRadius: 10,
                        }}
                      >
                        <img
                          src={img}
                          alt={a.titre}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 120,
                          borderRadius: 10,
                          background: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdCampaign size={34} color="var(--cyan-dark)" />
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: 16,
                            color: "var(--text)",
                            marginBottom: 6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {a.titre}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                          }}
                        >
                          {a.contenu}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: "var(--font-head)",
                            background: cat.bg,
                            color: cat.color,
                          }}
                        >
                          {a.categorie || "Général"}
                        </span>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          {a.date_publication
                            ? formatDate(a.date_publication)
                            : "—"}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => openEdit(a)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "#fff",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--cyan-light)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#fff")
                        }
                      >
                        <MdEdit size={16} color="var(--cyan-dark)" />
                      </button>
                      <button
                        onClick={() => openDelete(a)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid #fee2e2",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fee2e2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#fff")
                        }
                      >
                        <MdDelete size={16} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PAGE ADD / EDIT ── */}
      {(modal === "add" || modal === "edit") && (
        <div
          style={{
            marginTop: 18,
            background: "#fff",
            borderRadius: 18,
            padding: "28px",
            width: "100%",
            maxWidth: 860,
            marginBottom: 24,
            border: "1px solid var(--border)",
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "100%",
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
                  {modal === "add"
                    ? "Nouvelle actualité"
                    : "Modifier l'actualité"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  Remplissez les informations et ajoutez jusqu'à 5 fichiers.
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--cyan-dark)",
                    marginTop: 6,
                    fontWeight: 600,
                  }}
                >
                  Brouillon sauvegardé automatiquement localement.
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
              {/* Titre */}
              <div>
                <label style={lbl}>
                  Titre <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Titre de l'actualité"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label style={lbl}>Catégorie</label>
                <select
                  value={form.categorie}
                  onChange={(e) =>
                    setForm({ ...form, categorie: e.target.value })
                  }
                  style={{ ...inp, cursor: "pointer" }}
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
                <label style={lbl}>
                  Contenu <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={form.contenu}
                  onChange={(e) =>
                    setForm({ ...form, contenu: e.target.value })
                  }
                  placeholder="Rédigez le contenu de l'actualité..."
                  rows={8}
                  style={{
                    ...inp,
                    resize: "vertical",
                    minHeight: 240,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* ── ZONE UPLOAD ── */}
              <div>
                <label style={lbl}>
                  Fichiers joints
                  <span
                    style={{
                      fontWeight: 400,
                      color: "var(--muted)",
                      marginLeft: 8,
                    }}
                  >
                    {fichiers.length}/5 — photos, vidéos, documents
                  </span>
                </label>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() =>
                    fichiers.length < 5 &&
                    document.getElementById("file-input-actualite").click()
                  }
                  style={{
                    border: `2px dashed ${dragOver ? "var(--cyan)" : fichiers.length >= 5 ? "#e2e8f0" : "#67e8f9"}`,
                    borderRadius: 12,
                    padding: "24px",
                    textAlign: "center",
                    background: dragOver
                      ? "var(--cyan-light)"
                      : fichiers.length >= 5
                        ? "#f8fafc"
                        : "#f0fdfe",
                    cursor: fichiers.length >= 5 ? "not-allowed" : "pointer",
                    transition: "all .2s",
                  }}
                >
                  <input
                    id="file-input-actualite"
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      addFichiers(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <MdUpload
                    size={32}
                    color={
                      fichiers.length >= 5
                        ? "var(--subtle)"
                        : "var(--cyan-dark)"
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 14,
                      color:
                        fichiers.length >= 5
                          ? "var(--subtle)"
                          : "var(--cyan-dark)",
                      marginBottom: 4,
                    }}
                  >
                    {fichiers.length >= 5
                      ? "Maximum atteint (5/5)"
                      : "Glissez vos fichiers ici"}
                  </p>
                  {fichiers.length < 5 && (
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      ou cliquez pour sélectionner • Images, Vidéos, PDF,
                      Documents
                    </p>
                  )}
                </div>

                {/* Previews fichiers */}
                {previews.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    {previews.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          background: "#f8fafc",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                        }}
                      >
                        {/* Thumbnail ou icône */}
                        {f.url ? (
                          <img
                            src={f.url}
                            alt=""
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              background: "#fff",
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FileIcon type={f.type} />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 600,
                              fontSize: 12,
                              color: "var(--text)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginBottom: 2,
                            }}
                          >
                            {f.nom}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                padding: "1px 7px",
                                borderRadius: 999,
                                background: "#f1f5f9",
                                color: "var(--muted)",
                                fontFamily: "var(--font-head)",
                                fontWeight: 600,
                              }}
                            >
                              {f.type?.split("/")[1]?.toUpperCase() ||
                                "FICHIER"}
                            </span>
                            {f.taille && (
                              <span
                                style={{ fontSize: 10, color: "var(--subtle)" }}
                              >
                                {formatSize(f.taille)}
                              </span>
                            )}
                            {!f.local && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#065f46",
                                  fontWeight: 600,
                                  fontFamily: "var(--font-head)",
                                }}
                              >
                                ✓ Enregistré
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Supprimer */}
                        {f.local && (
                          <button
                            onClick={() => removeFichier(i)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 7,
                              background: "#fee2e2",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            <MdClose size={14} color="#dc2626" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                      ? "Publier l'actualité"
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
              Supprimer l'actualité ?
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
                marginBottom: 24,
              }}
            >
              "{selected?.titre}"
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
