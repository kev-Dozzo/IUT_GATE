import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdPeople,
  MdCheckCircle,
  MdWarning,
  MdEmail,
  MdPhone,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getEnseignants,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
} from "../../services/enseignantService";
import { getDepartements } from "../../services/departementService";

const ROLES = [
  "Enseignant",
  "Directeur De IUT",
  "Maître de conférences",
  "Responsable Academique(RA)",
  "Chef de département",
  "Enseignant chercheur",
  "Chargé de cours",
  "Assistant",
];
import PhotoUpload from "../../components/ui/PhotoUpload";
import Avatar from "../../components/ui/Avatar";
import { BASE_URL } from "../../config/constants";

const AVATAR_COLORS = [
  { bg: "#cffafe", color: "#0e7490" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fee2e2", color: "#991b1b" },
  { bg: "#fce7f3", color: "#9d174d" },
];

const getInitials = (nom) => {
  if (!nom) return "??";
  const parts = nom
    .replace(/^(Prof\.|Dr\.|M\.|Mme\.)\s*/i, "")
    .trim()
    .split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

const emptyForm = {
  nom: "",
  email: "",
  telephone: "",
  role: "Chargé de cours",
  poste: "",
  bureau: "",
  id_departement: "",
};

export default function EnseignantsAdmin() {
  const [enseignants, setEnseignants] = useState([]);
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ens, depts] = await Promise.all([
        getEnseignants(),
        getDepartements(),
      ]);
      setEnseignants(ens);
      setDepartements(depts);
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
    setForm({
      ...emptyForm,
      id_departement: departements[0]?.id_departement || "",
    });
    setPhoto(null);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (ens) => {
    setForm({
      nom: ens.nom || "",
      email: ens.email || "",
      telephone: ens.telephone || "",
      role: ens.role || "Chargé de cours",
      poste: ens.poste || "",
      bureau: ens.bureau || "",
      id_departement: ens.id_departement || "",
    });
    setPhoto(null);
    setSelected(ens);
    setModal("edit");
  };

  const openDelete = (ens) => {
    setSelected(ens);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.nom.trim() || !form.email.trim()) {
      showToast("Nom et email sont obligatoires.", "error");
      return;
    }
    setSaving(true);
    try {
      if (modal === "add") {
        await createEnseignant(form, photo);
        showToast("Enseignant ajouté avec succès !");
      } else {
        await updateEnseignant(selected.id_enseignant, form, photo);
        showToast("Enseignant modifié avec succès !");
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
      await deleteEnseignant(selected.id_enseignant);
      showToast("Enseignant supprimé.");
      await fetchData();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = enseignants.filter(
    (e) =>
      e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.role?.toLowerCase().includes(search.toLowerCase()),
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
            Gestion des Enseignants
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {enseignants.length} enseignant{enseignants.length > 1 ? "s" : ""}{" "}
            au total
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
          <MdAdd size={18} /> Ajouter un enseignant
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
          placeholder="Rechercher un enseignant..."
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
            <MdPeople size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucun enseignant trouvé
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((ens, i) => {
              const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const dept = departements.find(
                (d) => d.id_departement === ens.id_departement,
              );
              const photoURL = ens.photo_url
                ? `${BASE_URL}${ens.photo_url}`
                : null;
              return (
                <div
                  key={ens.id_enseignant}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    overflow: "hidden",
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 180,
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt={ens.nom}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 84,
                          height: 84,
                          borderRadius: "50%",
                          background: av.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-head)",
                            fontSize: 22,
                            fontWeight: 800,
                            color: av.color,
                          }}
                        >
                          {getInitials(ens.nom)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
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
                          {ens.nom}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dept?.nom || "Département non renseigné"}
                        </p>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "7px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                          background: "var(--cyan-light)",
                          color: "var(--cyan-dark)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ens.role || ens.poste || "—"}
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      {ens.bureau && (
                        <div style={{ fontSize: 13, color: "var(--text)" }}>
                          <strong>Bureau :</strong> {ens.bureau}
                        </div>
                      )}
                      <div style={{ display: "grid", gap: 8 }}>
                        {ens.email && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              color: "var(--muted)",
                              fontSize: 13,
                            }}
                          >
                            <MdEmail size={16} />
                            <span>{ens.email}</span>
                          </div>
                        )}
                        {ens.telephone && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              color: "var(--muted)",
                              fontSize: 13,
                            }}
                          >
                            <MdPhone size={16} />
                            <span>{ens.telephone}</span>
                          </div>
                        )}
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
                        onClick={() => openEdit(ens)}
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
                        onClick={() => openDelete(ens)}
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
                  {modal === "add"
                    ? "Ajouter un enseignant"
                    : "Modifier l'enseignant"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  Remplissez les informations de l'enseignant.
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
                marginBottom: 8,
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
                shape="circle"
                label="Photo de profil"
              />
            </div>

            {/* Champs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Nom + Email */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Nom complet <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder=""
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Email <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder=""
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              </div>

              {/* Téléphone + Bureau */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input
                    value={form.telephone}
                    onChange={(e) =>
                      setForm({ ...form, telephone: e.target.value })
                    }
                    placeholder="+237 6XX XXX XXX"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
                <div>
                  <label style={labelStyle}>Bureau</label>
                  <input
                    value={form.bureau}
                    onChange={(e) =>
                      setForm({ ...form, bureau: e.target.value })
                    }
                    placeholder=""
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              </div>

              {/* Rôle + Département */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>Rôle</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--cyan)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
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
              </div>

              {/* Poste */}
              <div>
                <label style={labelStyle}>Poste / Spécialité</label>
                <input
                  value={form.poste}
                  onChange={(e) => setForm({ ...form, poste: e.target.value })}
                  placeholder="Ex: Développement logiciel, Réseaux..."
                  style={inputStyle}
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
                      ? "Ajouter"
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
              Supprimer l'enseignant ?
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
