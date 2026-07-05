import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdMenu, MdClose, MdHandshake } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdCampaign,
  MdSchool,
  MdApartment,
  MdPeople,
  MdLocationOn,
  MdMeetingRoom,
  MdBusiness,
  MdSupervisorAccount,
  MdHistory,
  MdPerson,
  MdLogout,
  MdMenuBook,
  MdCalendarToday,
} from "react-icons/md";
import campusLogo from "../../assets/public/logo.png";
import Logo from "../ui/logo";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: MdDashboard,
    always: true,
  },
  {
    label: "Utilisateurs",
    path: "/admin/utilisateurs",
    icon: MdSupervisorAccount,
    permission: "manage_users",
  },
  {
    label: "Actualités",
    path: "/admin/actualites",
    icon: MdCampaign,
    permission: "manage_actualites",
  },
  {
    label: "Filières",
    path: "/admin/filieres",
    icon: MdSchool,
    permission: "manage_filieres",
  },
  {
    label: "Départements",
    path: "/admin/departements",
    icon: MdApartment,
    permission: "manage_departements",
  },
  {
    label: "Enseignants",
    path: "/admin/enseignants",
    icon: MdPeople,
    permission: "manage_enseignants",
  },
  {
    label: "Bâtiments",
    path: "/admin/batiments",
    icon: MdLocationOn,
    permission: "manage_batiments",
  },
  {
    label: "Salles",
    path: "/admin/salles",
    icon: MdMeetingRoom,
    permission: "manage_salles",
  },
  {
    label: "Services",
    path: "/admin/services",
    icon: MdBusiness,
    permission: "manage_services",
  },
  {
    label: "Partenaires",
    path: "/admin/partenaires",
    icon: MdHandshake,
    permission: "manage_services",
  },
  {
    label: "Programmes",
    path: "/admin/programmes",
    icon: MdMenuBook,
    permission: "manage_filieres",
  },
  {
    label: "Calendrier",
    path: "/admin/calendrier",
    icon: MdCalendarToday,
    permission: "manage_actualites",
  },
  {
    label: "Historique",
    path: "/admin/historique",
    icon: MdHistory,
    permission: "view_logs",
  },
  { label: "Mon profil", path: "/admin/profil", icon: MdPerson, always: true },
];

export function AdminSidebar({ onNavigate }) {
  const { admin, hasPermission, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path) => {
    navigate(path);
    onNavigate?.();
  };

  const visible = NAV_ITEMS.filter(
    (item) => item.always || hasPermission(item.permission),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "8px 10px 16px",
          borderBottom: "1px solid var(--border)",
          marginBottom: 8,
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <img
            src={`${campusLogo}`}
            alt="IUTGate"
            style={{
              width: 60,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid var(--cyan)",
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
        <p
          style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 6 }}
        >
          {admin?.role === "super_admin"
            ? " Super Admin"
            : admin?.role === "admin"
              ? "Admin"
              : "Éditeur"}
        </p>
      </div>

      {/* Navigation — scrollable */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {visible.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <div
              key={path}
              onClick={() => go(path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                cursor: "pointer",
                transition: "all .2s",
                background: isActive ? "rgba(6,182,212,.2)" : "transparent",
                borderLeft: isActive
                  ? "3px solid var(--cyan)"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon
                icon={Icon}
                size={18}
                color={isActive ? "var(--cyan)" : "rgba(255,255,255,.55)"}
              />
              <span
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  color: isActive ? "#fff" : "rgba(255,255,255,.55)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Profil + Logout */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid rgba(255,255,255,.1)",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            fontFamily: "var(--font-head)",
            marginBottom: 2,
          }}
        >
          {admin?.nom}
        </p>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,.4)",
            marginBottom: 10,
          }}
        >
          {admin?.email}
        </p>
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,.5)",
            fontSize: 12,
            fontFamily: "var(--font-head)",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,.5)")
          }
        >
          <MdLogout size={16} /> Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  // const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── DESKTOP — sidebar sticky ── */}
      <aside
        style={{
          width: 240,
          background: "var(--navy)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          // Caché sur mobile
          ...(window.innerWidth < 768 ? { display: "none" } : {}),
        }}
        className="admin-sidebar-desktop"
      >
        <AdminSidebar />
      </aside>

      {/* ── MOBILE — topbar fixe ── */}
      <div
        className="admin-topbar-mobile"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: "var(--navy)",
          borderBottom: "1px solid rgba(255,255,255,.1)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            padding: "8px 10px 16px",
            borderBottom: "1px solid var(--border)",
            marginBottom: 8,
          }}
        >
          <div
                    onClick={() => navigate("/")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={`${campusLogo}`}
                      alt="IUTGate"
                      style={{
                        width: 60,
                        height: 44,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid var(--cyan)",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          {open ? (
            <MdClose size={24} color="#fff" />
          ) : (
            <MdMenu size={24} color="#fff" />
          )}
        </button>
      </div>

      {/* ── MOBILE — drawer ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 199,
            background: "rgba(0,0,0,.5)",
          }}
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 260,
              height: "100%",
              background: "var(--navy)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
