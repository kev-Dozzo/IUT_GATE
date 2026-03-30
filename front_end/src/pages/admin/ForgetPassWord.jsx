import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { forgotPassword } from "../../services/authService";
import Logo from "../../components/ui/logo";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Retour login */}
        <button
          onClick={() => navigate("/admin/login")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            marginBottom: 28,
            padding: 0,
            transition: "color .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <MdArrowBack size={16} />
          Retour à la connexion
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Logo
            variant="compact"
            size="200%"
            white
            onClick={() => navigate("/")}
          />

          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Mot de passe oublié
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 13,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Entrez votre email, on vous envoie un lien pour réinitialiser votre
            mot de passe.
          </p>
        </div>

        {/* Succès */}
        {success ? (
          <div
            style={{
              background: "#d1fae5",
              borderRadius: 12,
              border: "1px solid #6ee7b7",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <MdCheckCircle
              size={40}
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
              Email envoyé !
            </p>
            <p style={{ fontSize: 13, color: "#047857", lineHeight: 1.6 }}>
              Un lien de réinitialisation a été envoyé à{" "}
              <strong>{email}</strong>. Vérifiez votre boîte mail.
            </p>
            <button
              onClick={() => navigate("/admin/login")}
              style={{
                marginTop: 20,
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
              Retour à la connexion
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
                  fontFamily: "var(--font-body)",
                }}
              >
                {error}
              </div>
            )}

            {/* Email */}
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
                Adresse email
              </label>
              <div style={{ position: "relative" }}>
                <MdEmail
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@iut.cm"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px 11px 36px",
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
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "var(--subtle)" : "var(--cyan)",
                color: loading ? "#fff" : "var(--cyan-text)",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}
            >
              {loading
                ? "Envoi en cours..."
                : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
