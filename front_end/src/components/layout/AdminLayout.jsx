import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <header
          style={{
            height: 56,
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            marginTop: 0,
          }}
        >
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              Bonjour,{" "}
              <strong
                style={{ color: "var(--navy)", fontFamily: "var(--font-head)" }}
              >
                {admin?.nom || "Admin"}
              </strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#fee2e2",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 11,
                color: "#991b1b",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "24px",
            background: "var(--bg)",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
