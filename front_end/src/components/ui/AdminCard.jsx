import { MdEdit, MdDelete } from "react-icons/md";

export default function AdminCard({ children, onEdit, onDelete }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid var(--border)",
        padding: "16px",
        marginBottom: 12,
        boxShadow: "0 8px 24px rgba(2,6,23,0.04)",
        position: "relative",
        overflow: "hidden",
        transition: "transform .18s, box-shadow .18s, border-color .18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 18px 48px rgba(2,6,23,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(2,6,23,0.04)";
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>{children}</div>

      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={onEdit}
          aria-label="Modifier"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MdEdit size={16} color="var(--cyan-dark)" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Supprimer"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "1px solid #fee2e2",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MdDelete size={16} color="#dc2626" />
        </button>
      </div>
    </div>
  );
}
