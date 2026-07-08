import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const { admin } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <Sidebar />

      {/* Contenu principal */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Topbar desktop */}
        <header
          className="admin-header-desktop"
          style={{
            height: 56,
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            flexShrink: 0,
          }}
        >
          <span
            onClick={() => navigate("/admin/profil")}
            style={{
              fontSize: 13,
              color: "var(--muted)",
              cursor: "pointer",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Bonjour,{" "}
            <strong
              style={{ color: "var(--navy)", fontFamily: "var(--font-head)" }}
            >
              {admin?.nom || "Admin"}
            </strong>
          </span>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowX: "hidden" }}>{children}</main>
      </div>
    </div>
  );
}
