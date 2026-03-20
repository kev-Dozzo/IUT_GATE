export default function StatCard({ label, value, icon: Icon, bg, color }) {
  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 32,
            fontWeight: 800,
            color: "var(--navy)",
          }}
        >
          {value}
        </p>
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          background: bg,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} color={color} />
      </div>
    </div>
  );
}
