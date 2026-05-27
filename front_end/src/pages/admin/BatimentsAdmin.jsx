import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdApartment,
  MdCheckCircle,
  MdWarning,
  MdLocationOn,
  MdMeetingRoom,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getBatiments,
  createBatiment,
  updateBatiment,
  deleteBatiment,
} from "../../services/batimentService";
import PhotoUpload from "../../components/ui/PhotoUpload";

const emptyForm = { nom: "", description: "", latitude: "", longitude: "" };

export default function BatimentsAdmin() {
  const [batiments, setBatiments] = useState([]);
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
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getBatiments();
      setBatiments(data);
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
    setPhoto(null);
  };

  const openEdit = (bat) => {
    setForm({
      nom: bat.nom || "",
      description: bat.description || "",
      latitude: bat.latitude || "",
      longitude: bat.longitude || "",
    });
    setSelected(bat);
    setModal("edit");
    setPhoto(null);
  };

  const openDelete = (bat) => {
    setSelected(bat);
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
        await createBatiment(form, photo);
        showToast("Bâtiment créé avec succès !");
      } else {
        await updateBatiment(selected.id_batiment, form, photo);
        showToast("Bâtiment modifié avec succès !");
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
      await deleteBatiment(selected.id_batiment);
      showToast("Bâtiment supprimé.");
      await fetchData();
      closeModal();
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = batiments.filter(
    (b) =>
      b.nom?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()),
  );

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

  const btnSave = {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: 10,
    fontFamily: "var(--font-head)",
    fontWeight: 700,
    fontSize: 13,
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
            Gestion des Bâtiments
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {batiments.length} bâtiment{batiments.length > 1 ? "s" : ""} sur le
            campus
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
          <MdAdd size={18} /> Nouveau bâtiment
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
          marginBottom: 24,
          maxWidth: 400,
        }}
      >
        <MdSearch size={18} style={{ color: "var(--subtle)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un bâtiment..."
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

      <div className="table-responsive">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", gridColumn: "1 / -1" }}>
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
                gridColumn: "1 / -1",
              }}
            >
              <MdApartment size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                Aucun bâtiment trouvé
              </p>
            </div>
          ) : (
            filtered.map((bat) => {
              const imageUrl = bat.photo_url
                ? `http://localhost:5000${bat.photo_url}`
                : null;
              return (
                <div
                  key={bat.id_batiment}
                  style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid var(--border)",
                    overflow: "hidden",
                    boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
                    transition: "transform .2s, box-shadow .2s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 24px 80px rgba(15, 23, 42, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 18px 60px rgba(15, 23, 42, 0.08)";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      minHeight: 150,
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
                        alt={bat.nom}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 18,
                          background: "var(--cyan-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdApartment size={32} color="var(--cyan-dark)" />
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: 18,
                            color: "var(--text)",
                            margin: 0,
                          }}
                        >
                          {bat.nom}
                        </p>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 8,
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: "#def7ec",
                            color: "#0f766e",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          Bâtiment
                        </span>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        lineHeight: 1.8,
                        minHeight: 54,
                        margin: 0,
                      }}
                    >
                      {bat.description?.slice(0, 120) || "Aucune description disponible."}
                      {bat.description?.length > 120 ? "..." : ""}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: 14,
                          background: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 12,
                          color: "var(--text)",
                        }}
                      >
                        <MdLocationOn size={16} color="var(--cyan)" />
                        {bat.latitude ? parseFloat(bat.latitude).toFixed(4) : "—"}
                      </div>
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: 14,
                          background: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 12,
                          color: "var(--text)",
                        }}
                      >
                        <MdLocationOn size={16} color="var(--cyan)" />
                        {bat.longitude ? parseFloat(bat.longitude).toFixed(4) : "—"}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        onClick={() => openEdit(bat)}
                        style={{
                          flex: 1,
                          minWidth: 120,
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: "1px solid var(--cyan)",
                          background: "var(--cyan)",
                          color: "var(--cyan-text)",
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => openDelete(bat)}
                        style={{
                          flex: 1,
                          minWidth: 120,
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: "1px solid #fee2e2",
                          background: "#fff",
                          color: "#dc2626",
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
                  {modal === "add"
                    ? "Nouveau bâtiment"
                    : "Modifier le bâtiment"}
                </h2>
                <p
                  style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
                >
                  Remplissez les informations du bâtiment.
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
                    ? `http://localhost:5000${selected.photo_url}`
                    : null
                }
                onChange={setPhoto}
                size={120}
                shape="rounded"
                label="Photo du bâtiment"
                placeholder="image"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={lbl}>
                  Nom du bâtiment <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Bâtiment A"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label style={lbl}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Ex: Bâtiment administratif principal..."
                  rows={3}
                  style={{ ...inp, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label style={lbl}>
                  <MdLocationOn
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  />
                  Coordonnées GPS
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginBottom: 5,
                      }}
                    >
                      Latitude
                    </p>
                    <input
                      type="number"
                      step="0.0001"
                      value={form.latitude}
                      onChange={(e) =>
                        setForm({ ...form, latitude: e.target.value })
                      }
                      placeholder="Ex: 4.0511"
                      style={inp}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--cyan)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginBottom: 5,
                      }}
                    >
                      Longitude
                    </p>
                    <input
                      type="number"
                      step="0.0001"
                      value={form.longitude}
                      onChange={(e) =>
                        setForm({ ...form, longitude: e.target.value })
                      }
                      placeholder="Ex: 9.7679"
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
                <div
                  style={{
                    marginTop: 8,
                    padding: "10px 14px",
                    background: "var(--cyan-light)",
                    borderRadius: 8,
                    border: "1px solid #67e8f9",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--cyan-dark)",
                      fontWeight: 500,
                    }}
                  >
                    💡 Allez sur{" "}
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--cyan-dark)", fontWeight: 700 }}
                    >
                      Google Maps
                    </a>
                    , clic droit sur l'emplacement → les coordonnées
                    apparaissent.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    ...btnSave,
                    background: saving ? "var(--subtle)" : "var(--cyan)",
                    color: saving ? "#fff" : "var(--cyan-text)",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving
                    ? "Enregistrement..."
                    : modal === "add"
                      ? "Créer le bâtiment"
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
              Supprimer le bâtiment ?
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
              Toutes les salles et services de ce bâtiment seront affectés.
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
