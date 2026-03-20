

const sizes = {
  sm: { img: 80, font: 14, sub: 9 },
  md: { img: 120, font: 18, sub: 11 },
  lg: { img: 160, font: 22, sub: 13 },
  xl: { img: 220, font: 28, sub: 15 },
};

export default function Logo({
  variant = "full",
  size = "md",
  onClick,
  white = false,
  style = {},
}) {
  const s = sizes[size] || sizes.md;

  // ── FULL : image complète avec tagline
  if (variant === "full") {
    return (
      <div
        onClick={onClick}
        style={{
          cursor: onClick ? "pointer" : "default",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          ...style,
        }}
      >
        <img
          src="/logo.png"
          alt="IUTGate Logo"
          style={{ width: s.img, objectFit: "contain" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  }

  // ── COMPACT : image sans tagline, taille réduite
  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        style={{
          cursor: onClick ? "pointer" : "default",
          display: "inline-flex",
          alignItems: "center",
          ...style,
        }}
      >
        <img
          src="/logo.png"
          alt="IUTGate"
          style={{ width: s.img * 0.6, objectFit: "contain" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  }

  // ── TEXT : version CSS pure (fallback ou footer)
  if (variant === "text") {
    return (
      <div
        onClick={onClick}
        style={{
          cursor: onClick ? "pointer" : "default",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          ...style,
        }}
      >
        {/* Logo box + texte */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: s.font + 14,
              height: s.font + 14,
              background: "var(--cyan)",
              borderRadius: Math.round((s.font + 14) * 0.25),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: s.font * 0.55,
                fontWeight: 800,
                color: "var(--navy)",
              }}
            >
              IG
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-head)",
              fontSize: s.font,
              fontWeight: 800,
              color: white ? "#fff" : "var(--navy)",
              letterSpacing: -0.5,
            }}
          >
            IUT<span style={{ color: "var(--cyan)" }}>Gate</span>
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            fontSize: s.sub,
            fontFamily: "var(--font-body)",
            color: white ? "rgba(255,255,255,.55)" : "var(--subtle)",
            letterSpacing: 0.5,
            paddingLeft: s.font + 14 + 8,
          }}
        >
          Connecter • Informer • Localiser
        </span>
      </div>
    );
  }

  return null;
}
