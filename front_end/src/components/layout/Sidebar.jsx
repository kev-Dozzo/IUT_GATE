import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdCampaign,
  MdPeople,
  MdSchool,
  MdAccountBalance,
  MdApartment,
  MdMeetingRoom,
  MdSettings,
  MdArrowBack,
  MdMenu,
  MdClose,
  MdPerson,
} from "react-icons/md";
import Logo from "../../components/ui/logo";

const navItems = [
  { Icon: MdDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { Icon: MdCampaign, label: "Annonces", path: "/admin/annonces" },
  { Icon: MdPeople, label: "Enseignants", path: "/admin/enseignants" },
  { Icon: MdSchool, label: "Filières", path: "/admin/filieres" },
  {
    Icon: MdAccountBalance,
    label: "Départements",
    path: "/admin/departements",
  },
  { Icon: MdApartment, label: "Bâtiments", path: "/admin/batiments" },
  { Icon: MdMeetingRoom, label: "Salles", path: "/admin/salles" },
  { Icon: MdSettings, label: "Services", path: "/admin/services" },
  { Icon: MdPerson, label: "Profile", path: "/admin/profile" },
];

function SidebarContent({ navigate, location, closeSidebar }) {
  return (
    <>
      {/* Logo */}
      <div
        style={{
          padding: "8px 10px 16px",
          borderBottom: "1px solid var(--border)",
          marginBottom: 8,
        }}
      >
        <Logo
          variant="compact"
          size="300%"
          white
          onClick={() => navigate("/")}
        />
        <p style={{ fontSize: 11, color: "var(--subtle)", marginTop: 2 }}>
          Espace administrateur
        </p>
      </div>

      {/* Nav items */}
      {navItems.map((item) => {
        const Icon = item.Icon;
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => {
              navigate(item.path);
              closeSidebar();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-head)",
              fontSize: 12,
              fontWeight: 600,
              color: isActive ? "var(--cyan-dark)" : "var(--muted)",
              background: isActive ? "var(--cyan-light)" : "transparent",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = "#f0fdfe";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </div>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* Retour portail */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 12px",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          fontFamily: "var(--font-head)",
          fontSize: 12,
          fontWeight: 600,
          color: "#ef4444",
          borderTop: "1px solid var(--border)",
          paddingTop: 14,
          transition: "all .2s",
        }}
      >
        <MdArrowBack size={18} />
        <span>Retour au portail</span>
      </div>
    </>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar desktop */}
      <aside
        className="desktop-only"
        style={{
          width: 220,
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          padding: "16px 12px",
          flexDirection: "column",
          gap: 4,
          minHeight: "100vh",
          flexShrink: 0,
        }}
      >
        <SidebarContent
          navigate={navigate}
          location={location}
          closeSidebar={() => setOpen(false)}
        />
      </aside>

      {/* Topbar mobile pour admin */}
      <div
        className="mobile-only"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          zIndex: 100,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Logo
          variant="compact"
          size="300%"
          white
          onClick={() => navigate("/")}
        />
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          {open ? (
            <MdClose size={22} color="var(--text)" />
          ) : (
            <MdMenu size={22} color="var(--text)" />
          )}
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,.4)",
          }}
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 260,
              height: "100%",
              background: "var(--card)",
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <SidebarContent
              navigate={navigate}
              location={location}
              closeSidebar={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
