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
            <span
              onClick={() => navigate("/admin/profil")}
              style={{
                fontSize: 13,
                color: "var(--muted)",
                cursor: "pointer",
                transition: "color .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--cyan)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--muted)")
              }
            >
              Bonjour,{" "}
              <strong
                style={{ color: "var(--navy)", fontFamily: "var(--font-head)" }}
              >
                {admin?.nom || "Admin"}
              </strong>
            </span>
          </div>
        </header>

        {/* Content */}
        <main
          className="admin-main"
          style={{ flex: 1, background: "var(--bg)", overflowX: "hidden" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
