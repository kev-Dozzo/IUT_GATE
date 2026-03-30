import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";
import Logo from "../../components/ui/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(email, password);
      login(data.token, data.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect.",
      );
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
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(6,182,212,.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          
            <Logo
              variant="compact"
              size="300%"
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
            Espace Admin
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            Connectez-vous à votre tableau de bord
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
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
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

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
              Mot de passe
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 36px",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

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
            }}
          >
            {loading ? "Connexion..." : "Se connecter →"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            <span
              onClick={() => navigate("/admin/forgot-password")}
              style={{
                color: "var(--cyan)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Mot de passe oublié ?
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
