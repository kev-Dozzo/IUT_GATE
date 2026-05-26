import React, { useState, useEffect } from "react";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdEdit,
  MdSave,
  MdClose,
  MdCheckCircle,
  MdWarning,
  MdVisibility,
  MdVisibilityOff,
  MdAdminPanelSettings,
  MdCalendarToday,
  MdShield,
  MdSquare,
  MdPeople,
  MdDashboard,
  MdCampaign,
  MdSchool,
} from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../../services/authService";

export default function ProfilAdmin() {
  const { login: updateAuth } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("profil");

  // Formulaire profil
  const [formProfil, setFormProfil] = useState({ nom: "", email: "" });
  const [editProfil, setEditProfil] = useState(false);
  const [savingProfil, setSavingProfil] = useState(false);

  // Formulaire mot de passe
  const [formPass, setFormPass] = useState({
    ancien_mot_de_passe: "",
    nouveau_mot_de_passe: "",
    confirmer: "",
  });
  const [showPass, setShowPass] = useState({
    ancien: false,
    nouveau: false,
    confirmer: false,
  });
  const [savingPass, setSavingPass] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setFormProfil({ nom: data.nom, email: data.email });
      })
      .catch(() => showToast("Erreur de chargement du profil", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfil = async () => {
    if (!formProfil.nom.trim() || !formProfil.email.trim()) {
      showToast("Nom et email sont obligatoires", "error");
      return;
    }
    setSavingProfil(true);
    try {
      const res = await updateProfile(formProfil);
      setProfile({ ...profile, ...formProfil });
      // Met à jour le contexte auth
      const token = localStorage.getItem("token");
      updateAuth(token, res.admin);
      setEditProfil(false);
      showToast("Profil mis à jour avec succès !");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Erreur lors de la mise à jour",
        "error",
      );
    } finally {
      setSavingProfil(false);
    }
  };

  const handleSavePass = async () => {
    if (
      !formPass.ancien_mot_de_passe ||
      !formPass.nouveau_mot_de_passe ||
      !formPass.confirmer
    ) {
      showToast("Tous les champs sont requis", "error");
      return;
    }
    if (formPass.nouveau_mot_de_passe !== formPass.confirmer) {
      showToast("Les mots de passe ne correspondent pas", "error");
      return;
    }
    if (formPass.nouveau_mot_de_passe.length < 6) {
      showToast("Le mot de passe doit faire au moins 6 caractères", "error");
      return;
    }
    setSavingPass(true);
    try {
      await updatePassword({
        ancien_mot_de_passe: formPass.ancien_mot_de_passe,
        nouveau_mot_de_passe: formPass.nouveau_mot_de_passe,
      });
      setFormPass({
        ancien_mot_de_passe: "",
        nouveau_mot_de_passe: "",
        confirmer: "",
      });
      showToast("Mot de passe modifié avec succès !");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Erreur lors du changement",
        "error",
      );
    } finally {
      setSavingPass(false);
    }
  };

  const getInitials = (nom) => {
    if (!nom) return "AD";
    const parts = nom.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  const inp = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    color: "var(--text)",
    background: "#fff",
    transition: "border .2s",
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
            borderRadius: 12,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            fontFamily: "var(--font-head)",
            fontWeight: 600,
            fontSize: 13,
            color: toast.type === "error" ? "#991b1b" : "#065f46",
            animation: "fadeIn .3s ease",
          }}
        >
          {toast.type === "error" ? (
            <MdWarning size={20} />
          ) : (
            <MdCheckCircle size={20} />
          )}
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
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
          Compte administrateur
        </p>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: -0.5,
          }}
        >
          Mon Profil
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "3px solid var(--cyan-light)",
              borderTop: "3px solid var(--cyan)",
              margin: "0 auto",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {/* ── COLONNE GAUCHE — Carte profil ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Avatar card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid var(--border)",
                padding: "32px 24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Déco fond */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  background: "linear-gradient(135deg, #0c1a40, #0e5f75)",
                }}
              />

              {/* Avatar */}
              <div
                style={{ position: "relative", zIndex: 1, marginBottom: 16 }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "var(--cyan)",
                    margin: "28px auto 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid #fff",
                    boxShadow: "0 8px 24px rgba(6,182,212,.3)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 30,
                      fontWeight: 800,
                      color: "var(--navy)",
                    }}
                  >
                    {getInitials(profile?.nom)}
                  </span>
                </div>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                {profile?.nom}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  marginBottom: 16,
                }}
              >
                {profile?.email}
              </p>

              {/* Badge admin */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "var(--cyan-light)",
                  marginBottom: 20,
                }}
              >
                <MdAdminPanelSettings size={15} color="var(--cyan-dark)" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--cyan-dark)",
                    fontFamily: "var(--font-head)",
                  }}
                >
                  Administrateur
                </span>
              </div>

              {/* Infos compte */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textAlign: "left",
                }}
              >
                {[
                  { icon: MdEmail, label: "Email", value: profile?.email },
                  {
                    icon: MdCalendarToday,
                    label: "Membre depuis",
                    value: profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "long", year: "numeric" },
                        )
                      : "—",
                  },
                  {
                    icon: MdShield,
                    label: "Rôle",
                    value: "Super Administrateur",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      padding: "10px 12px",
                      background: "#f8fafc",
                      borderRadius: 10,
                    }}
                  >
                    {Icon && <Icon size={16} color="var(--cyan-dark)" />}
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--subtle)",
                          fontFamily: "var(--font-head)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text)",
                          fontWeight: 500,
                          marginTop: 1,
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats rapides */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#0f172a",
                  marginBottom: 14,
                }}
              >
                Accès rapide
              </p>
              {[
                {
                  label: "Tableau de bord",
                  path: "/admin/dashboard",
                  emoji: <MdDashboard/>,
                },
                { label: "Actualités", path: "/admin/actualites", emoji: <MdCampaign/> },
                {
                  label: "Enseignants",
                  path: "/admin/enseignants",
                  emoji: <MdPeople/>,
                },
                { label: "Filières", path: "/admin/filieres", emoji: <MdSchool/> },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 9,
                    textDecoration: "none",
                    color: "var(--text)",
                    fontSize: 13,
                    fontFamily: "var(--font-head)",
                    fontWeight: 500,
                    transition: "background .15s",
                    marginBottom: 4,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--cyan-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── COLONNE DROITE — Formulaires ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                background: "#fff",
                borderRadius: 12,
                border: "1px solid var(--border)",
                padding: 4,
                gap: 4,
              }}
            >
              {[
                { key: "profil", label: "Informations", icon: MdPerson },
                { key: "securite", label: "Sécurité", icon: MdLock },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 9,
                    background:
                      activeTab === key ? "var(--cyan-light)" : "transparent",
                    color:
                      activeTab === key ? "var(--cyan-dark)" : "var(--muted)",
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all .2s",
                  }}
                >
                  {Icon && React.createElement(Icon, { size: 16 })} {label}
                </button>
              ))}
            </div>

            {/* ── TAB PROFIL ── */}
            {activeTab === "profil" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  padding: "clamp(20px, 4vw, 32px)",
                  animation: "fadeIn .2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      Informations personnelles
                    </h3>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      Modifiez votre nom et email
                    </p>
                  </div>
                  {!editProfil ? (
                    <button
                      onClick={() => setEditProfil(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "var(--cyan-light)",
                        color: "var(--cyan-dark)",
                        border: "none",
                        borderRadius: 8,
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <MdEdit size={15} /> Modifier
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditProfil(false);
                        setFormProfil({
                          nom: profile?.nom,
                          email: profile?.email,
                        });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "#f1f5f9",
                        color: "var(--muted)",
                        border: "none",
                        borderRadius: 8,
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <MdClose size={15} /> Annuler
                    </button>
                  )}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {/* Nom */}
                  <div>
                    <label style={lbl}>
                      <MdPerson
                        size={13}
                        style={{ verticalAlign: "middle", marginRight: 5 }}
                      />
                      Nom complet
                    </label>
                    {editProfil ? (
                      <input
                        value={formProfil.nom}
                        onChange={(e) =>
                          setFormProfil({ ...formProfil, nom: e.target.value })
                        }
                        placeholder="Votre nom"
                        style={inp}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--cyan)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border)")
                        }
                      />
                    ) : (
                      <div
                        style={{
                          padding: "12px 14px",
                          background: "#f8fafc",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          fontSize: 13,
                          color: "var(--text)",
                        }}
                      >
                        {profile?.nom}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={lbl}>
                      <MdEmail
                        size={13}
                        style={{ verticalAlign: "middle", marginRight: 5 }}
                      />
                      Adresse email
                    </label>
                    {editProfil ? (
                      <input
                        type="email"
                        value={formProfil.email}
                        onChange={(e) =>
                          setFormProfil({
                            ...formProfil,
                            email: e.target.value,
                          })
                        }
                        placeholder="Votre email"
                        style={inp}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--cyan)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border)")
                        }
                      />
                    ) : (
                      <div
                        style={{
                          padding: "12px 14px",
                          background: "#f8fafc",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          fontSize: 13,
                          color: "var(--text)",
                        }}
                      >
                        {profile?.email}
                      </div>
                    )}
                  </div>

                  {/* Bouton save */}
                  {editProfil && (
                    <button
                      onClick={handleSaveProfil}
                      disabled={savingProfil}
                      style={{
                        padding: "13px",
                        background: savingProfil
                          ? "var(--subtle)"
                          : "var(--cyan)",
                        color: savingProfil ? "#fff" : "var(--cyan-text)",
                        border: "none",
                        borderRadius: 10,
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: savingProfil ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "all .2s",
                      }}
                    >
                      <MdSave size={18} />
                      {savingProfil
                        ? "Enregistrement..."
                        : "Sauvegarder les modifications"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB SÉCURITÉ ── */}
            {activeTab === "securite" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  padding: "clamp(20px, 4vw, 32px)",
                  animation: "fadeIn .2s ease",
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#0f172a",
                      marginBottom: 4,
                    }}
                  >
                    Changer le mot de passe
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    Choisissez un mot de passe fort d'au moins 6 caractères
                  </p>
                </div>

                {/* Indicateur force mot de passe */}
                {formPass.nouveau_mot_de_passe &&
                  (() => {
                    const pwd = formPass.nouveau_mot_de_passe;
                    let force = 0;
                    if (pwd.length >= 6) force++;
                    if (pwd.length >= 10) force++;
                    if (/[A-Z]/.test(pwd)) force++;
                    if (/[0-9]/.test(pwd)) force++;
                    if (/[^A-Za-z0-9]/.test(pwd)) force++;
                    const niveaux = [
                      { label: "Très faible", color: "#ef4444" },
                      { label: "Faible", color: "#f97316" },
                      { label: "Moyen", color: "#eab308" },
                      { label: "Fort", color: "#22c55e" },
                      { label: "Très fort", color: "#06b6d4" },
                    ];
                    const n = niveaux[Math.min(force, 4)];
                    return (
                      <div style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--muted)",
                              fontFamily: "var(--font-head)",
                              fontWeight: 600,
                            }}
                          >
                            Force du mot de passe
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: "var(--font-head)",
                              color: n.color,
                            }}
                          >
                            {n.label}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                background: i < force ? n.color : "#f1f5f9",
                                transition: "background .3s",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Ancien */}
                  <div>
                    <label style={lbl}>Mot de passe actuel</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass.ancien ? "text" : "password"}
                        value={formPass.ancien_mot_de_passe}
                        onChange={(e) =>
                          setFormPass({
                            ...formPass,
                            ancien_mot_de_passe: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        style={{ ...inp, paddingRight: 44 }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--cyan)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border)")
                        }
                      />
                      <button
                        onClick={() =>
                          setShowPass((p) => ({ ...p, ancien: !p.ancien }))
                        }
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--subtle)",
                        }}
                      >
                        {showPass.ancien ? (
                          <MdVisibilityOff size={18} />
                        ) : (
                          <MdVisibility size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nouveau */}
                  <div>
                    <label style={lbl}>Nouveau mot de passe</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass.nouveau ? "text" : "password"}
                        value={formPass.nouveau_mot_de_passe}
                        onChange={(e) =>
                          setFormPass({
                            ...formPass,
                            nouveau_mot_de_passe: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        style={{ ...inp, paddingRight: 44 }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--cyan)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border)")
                        }
                      />
                      <button
                        onClick={() =>
                          setShowPass((p) => ({ ...p, nouveau: !p.nouveau }))
                        }
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--subtle)",
                        }}
                      >
                        {showPass.nouveau ? (
                          <MdVisibilityOff size={18} />
                        ) : (
                          <MdVisibility size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmer */}
                  <div>
                    <label style={lbl}>Confirmer le nouveau mot de passe</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass.confirmer ? "text" : "password"}
                        value={formPass.confirmer}
                        onChange={(e) =>
                          setFormPass({
                            ...formPass,
                            confirmer: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        style={{
                          ...inp,
                          paddingRight: 44,
                          borderColor:
                            formPass.confirmer &&
                            formPass.confirmer !== formPass.nouveau_mot_de_passe
                              ? "#fca5a5"
                              : "var(--border)",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--cyan)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            formPass.confirmer &&
                            formPass.confirmer !== formPass.nouveau_mot_de_passe
                              ? "#fca5a5"
                              : "var(--border)")
                        }
                      />
                      <button
                        onClick={() =>
                          setShowPass((p) => ({
                            ...p,
                            confirmer: !p.confirmer,
                          }))
                        }
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--subtle)",
                        }}
                      >
                        {showPass.confirmer ? (
                          <MdVisibilityOff size={18} />
                        ) : (
                          <MdVisibility size={18} />
                        )}
                      </button>
                    </div>
                    {formPass.confirmer &&
                      formPass.confirmer !== formPass.nouveau_mot_de_passe && (
                        <p
                          style={{
                            fontSize: 11,
                            color: "#ef4444",
                            marginTop: 4,
                            fontFamily: "var(--font-head)",
                            fontWeight: 500,
                          }}
                        >
                          ⚠️ Les mots de passe ne correspondent pas
                        </p>
                      )}
                    {formPass.confirmer &&
                      formPass.confirmer === formPass.nouveau_mot_de_passe && (
                        <p
                          style={{
                            fontSize: 11,
                            color: "#22c55e",
                            marginTop: 4,
                            fontFamily: "var(--font-head)",
                            fontWeight: 500,
                          }}
                        >
                          ✓ Les mots de passe correspondent
                        </p>
                      )}
                  </div>

                  {/* Bouton */}
                  <button
                    onClick={handleSavePass}
                    disabled={savingPass}
                    style={{
                      padding: "13px",
                      border: "none",
                      borderRadius: 10,
                      background: savingPass ? "var(--subtle)" : "var(--navy)",
                      color: "#fff",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: savingPass ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "all .2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!savingPass)
                        e.currentTarget.style.background = "var(--blue)";
                    }}
                    onMouseLeave={(e) => {
                      if (!savingPass)
                        e.currentTarget.style.background = "var(--navy)";
                    }}
                  >
                    <MdLock size={18} />
                    {savingPass ? "Modification..." : "Changer le mot de passe"}
                  </button>

                  {/* Tips sécurité */}
                  <div
                    style={{
                      padding: "14px 16px",
                      background: "var(--cyan-light)",
                      borderRadius: 10,
                      border: "1px solid #67e8f9",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--cyan-dark)",
                        fontFamily: "var(--font-head)",
                        marginBottom: 8,
                      }}
                    >
                      Conseils de sécurité
                    </p>
                    {[
                      "Utilisez au moins 8 caractères",
                      "Mélangez majuscules, chiffres et symboles",
                      "N'utilisez pas votre nom ou date de naissance",
                      "Ne partagez jamais votre mot de passe",
                    ].map((tip, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: 11,
                          color: "var(--cyan-dark)",
                          marginBottom: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span style={{ color: "var(--cyan)" }}>•</span> {tip}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
