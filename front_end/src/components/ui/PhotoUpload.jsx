import { useState, useRef } from "react";
import { MdCameraAlt, MdClose, MdPerson } from "react-icons/md";

export default function PhotoUpload({
  value, // URL photo existante
  onChange, // callback(file) quand photo choisie
  size = 80, // taille en px
  shape = "rounded", // 'rounded' | 'circle'
  label = "Photo",
}) {
  const [preview, setPreview] = useState(value || null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérif type
    if (!file.type.startsWith("image/")) {
      alert("Veuillez choisir une image.");
      return;
    }

    // Vérif taille max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const radius = shape === "circle" ? "50%" : 14;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <label
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#374151",
          fontFamily: "var(--font-head)",
          alignSelf: "flex-start",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative", width: size, height: size }}>
        {/* Photo ou placeholder */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            background: preview ? "transparent" : "var(--cyan-light)",
            border: `2px dashed ${preview ? "var(--cyan)" : "#67e8f9"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            transition: "all .2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--cyan-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = preview
              ? "var(--cyan)"
              : "#67e8f9")
          }
        >
          {preview ? (
            <img
              src={preview}
              alt="Photo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MdPerson
                size={size * 0.35}
                color="var(--cyan-dark)"
                style={{ opacity: 0.5 }}
              />
              <MdCameraAlt size={size * 0.2} color="var(--cyan-dark)" />
            </div>
          )}
        </div>

        {/* Bouton supprimer */}
        {preview && (
          <button
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <MdClose size={12} color="#fff" />
          </button>
        )}

        {/* Bouton caméra sur la photo */}
        {preview && (
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--cyan)",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <MdCameraAlt size={13} color="var(--cyan-text)" />
          </button>
        )}

        {/* Input caché */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>

      <p style={{ fontSize: 10, color: "var(--subtle)", textAlign: "center" }}>
        Cliquez pour {preview ? "changer" : "ajouter"} la photo
        <br />
        JPG, PNG · Max 5MB
      </p>
    </div>
  );
}
