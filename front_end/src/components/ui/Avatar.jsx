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
const DEFAULT_PHOTO = "/noprofil.jpg";

export default function Avatar({ nom, photoUrl, size = 48, index = 0 }) {
  const av = COLORS[index % COLORS.length]; 
  const radius = Math.round(size * 0.22); 

  const src = photoUrl
    ? photoUrl.startsWith("http")
      ? photoUrl
      : `${BASE_URL}${photoUrl}`
    : DEFAULT_PHOTO;

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <img
        src={src}
        alt={nom || ""}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: "cover",
          objectPosition: "center top",
          border: "2px solid var(--cyan-light)",
          display: "block",
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_PHOTO;
        }}
      />
    </div>
  );
}
