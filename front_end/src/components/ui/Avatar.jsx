const getInitials = (nom) => {
  if (!nom) return "??";
  const parts = nom
    .replace(/^(Prof\.|Dr\.|M\.|Mme\.)\s*/i, "")
    .trim()
    .split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

const COLORS = [
  { bg: "#cffafe", color: "#0e7490" },
  { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fee2e2", color: "#991b1b" },
  { bg: "#fce7f3", color: "#9d174d" },
];

const BASE_URL = "http://localhost:5000";

export default function Avatar({
  nom,
  photoUrl,
  size = 48,
  index = 0,
  shape = "rounded",
}) {

    console.log('📸 photoUrl reçu:', photoUrl);
  console.log('🔗 fullUrl construit:', fullUrl);

  const av = COLORS[index % COLORS.length];
  const radius = shape === "circle" ? "50%" : Math.round(size * 0.28);
  const fullUrl = photoUrl
    ? photoUrl.startsWith("http")
      ? photoUrl
      : `${BASE_URL}${photoUrl}`
    : null;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>

      {/* ✅ Fallback initiales — toujours rendu, caché si photo OK */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: av.bg,
          display: "flex",             // ← Toujours visible par défaut
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontSize: size * 0.32,
            fontWeight: 800,
            color: av.color,
          }}
        >
          {getInitials(nom)}
        </span>
      </div>

      {/* ✅ Image — cache le fallback si elle charge */}
      {fullUrl && (
        <img
          src={fullUrl}
          alt={nom}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            border: "2px solid var(--cyan-light)",
          }}
          onError={(e) => {
            // Image cassée → cache l'img, le fallback est déjà visible dessous
            e.target.style.display = "none"
          }}
        />
      )}

    </div>
  );
}