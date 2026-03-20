import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
} from "react-icons/md";
import { resetPassword } from "../../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Validation force mot de passe
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isStrong = Object.values(checks).every(Boolean);
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrong)
      return setError("Le mot de passe ne respecte pas les critères.");
    if (!passwordsMatch)
      return setError("Les mots de passe ne correspondent pas.");
    if (!token) return setError("Token invalide ou expiré.");

    setLoading(true);
    setError(null);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Token invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  // Token manquant
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ecfeff, #cffafe)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "40px 36px",
            textAlign: "center",
            maxWidth: 400,
            boxShadow: "0 20px 60px rgba(6,182,212,.12)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 18,
              fontWeight: 700,
              color: "#991b1b",
              marginBottom: 12,
            }}
          >
            Lien invalide
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <button
            onClick={() => navigate("/admin/forgot-password")}
            style={{
              background: "var(--cyan)",
              color: "var(--cyan-text)",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Redemander un lien
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ecfeff, #cffafe)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid var(--border)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(6,182,212,.12)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "var(--navy)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          ></div>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Nouveau mot de passe
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
            Choisissez un mot de passe sécurisé pour votre compte.
          </p>
        </div>

        {/* Succès */}
        {success ? (
          <div
            style={{
              background: "#d1fae5",
              borderRadius: 12,
              border: "1px solid #6ee7b7",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <MdCheckCircle
              size={44}
              color="#065f46"
              style={{ marginBottom: 12 }}
            />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 15,
                color: "#065f46",
                marginBottom: 8,
              }}
            >
              Mot de passe modifié !
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#047857",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Votre mot de passe a été réinitialisé avec succès.
            </p>
            <button
              onClick={() => navigate("/admin/login")}
              style={{
                background: "var(--cyan)",
                color: "var(--cyan-text)",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Erreur */}
            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  borderRadius: 8,
                  border: "1px solid #fca5a5",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#991b1b",
                }}
              >
                {error}
              </div>
            )}

            {/* Nouveau mot de passe */}
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
                Nouveau mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <MdLock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--subtle)",
                  }}
                />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 40px 11px 36px",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    transition: "border .2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--subtle)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPwd ? (
                    <MdVisibilityOff size={16} />
                  ) : (
                    <MdVisibility size={16} />
                  )}
                </button>
              </div>

              {/* Critères mot de passe */}
              {password.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {[
                    { key: "length", label: "8 caractères minimum" },
                    { key: "upper", label: "Une lettre majuscule" },
                    { key: "number", label: "Un chiffre" },
                    { key: "special", label: "Un caractère spécial" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: checks[key] ? "#10b981" : "#d1d5db",
                          transition: "background .2s",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: checks[key] ? "#065f46" : "var(--subtle)",
                          transition: "color .2s",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmer mot de passe */}
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
                Confirmer le mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <MdLock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--subtle)",
                  }}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 40px 11px 36px",
                    border: `1.5px solid ${confirm.length > 0 ? (passwordsMatch ? "#10b981" : "#ef4444") : "var(--border)"}`,
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    transition: "border .2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--subtle)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showConfirm ? (
                    <MdVisibilityOff size={16} />
                  ) : (
                    <MdVisibility size={16} />
                  )}
                </button>
              </div>
              {confirm.length > 0 && (
                <p
                  style={{
                    fontSize: 11,
                    marginTop: 5,
                    color: passwordsMatch ? "#065f46" : "#991b1b",
                  }}
                >
                  {passwordsMatch
                    ? "✓ Les mots de passe correspondent"
                    : "✗ Les mots de passe ne correspondent pas"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isStrong || !passwordsMatch}
              style={{
                width: "100%",
                padding: "13px",
                background:
                  loading || !isStrong || !passwordsMatch
                    ? "#e2e8f0"
                    : "var(--cyan)",
                color:
                  loading || !isStrong || !passwordsMatch
                    ? "#94a3b8"
                    : "var(--cyan-text)",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                cursor:
                  loading || !isStrong || !passwordsMatch
                    ? "not-allowed"
                    : "pointer",
                transition: "all .2s",
                marginTop: 4,
              }}
            >
              {loading
                ? "Réinitialisation..."
                : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
