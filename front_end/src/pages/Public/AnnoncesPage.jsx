import { useState, useEffect } from "react"
//import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdCalendarToday,
  MdArrowForward,
  MdFilterList,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getAnnonces } from "../../services/annonceService";

const catColors = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Événement: { bg: "#cffafe", color: "#164e63" },
  Infrastructure: { bg: "#dbeafe", color: "#1e40af" },
  Administration: { bg: "#dbeafe", color: "#1e40af" },
  Stage: { bg: "#d1fae5", color: "#065f46" },
  Général: { bg: "#f1f5f9", color: "#475569" },
};

const CATEGORIES = [
  "Tous",
  "Examens",
  "Événement",
  "Infrastructure",
  "Administration",
  "Stage",
];

export default function AnnoncesPage() {
  //const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState("Tous");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAnnonces()
      .then((data) => setAnnonces(data))
      .catch(() => setError("Impossible de charger les annonces."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = annonces.filter((a) => {
    const matchCat = filtre === "Tous" || a.categorie === filtre;
    const matchSearch =
      a.titre?.toLowerCase().includes(search.toLowerCase()) ||
      a.contenu?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div>
      <Navbar />

      {/* ── HEADER ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "48px 32px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Campus
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 36,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.8,
              marginBottom: 8,
            }}
          >
            Annonces & Actualités
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14 }}>
            Restez informé de toutes les actualités du campus IUT.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}
      >
        {/* Filtres + Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Catégories */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <MdFilterList
              size={18}
              style={{ color: "var(--muted)", marginTop: 6 }}
            />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltre(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1.5px solid ${filtre === cat ? "var(--cyan)" : "var(--border)"}`,
                  background: filtre === cat ? "var(--cyan)" : "#fff",
                  color: filtre === cat ? "var(--cyan-text)" : "var(--muted)",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              padding: "8px 14px",
              transition: "border .2s",
            }}
          >
            <MdSearch size={18} style={{ color: "var(--subtle)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une annonce..."
              style={{
                border: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--text)",
                width: 220,
                background: "transparent",
              }}
            />
          </div>
        </div>
        {/* Compteur */}
        {!loading && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            {filtered.length} annonce{filtered.length > 1 ? "s" : ""} trouvée
            {filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {/* États */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Chargement des annonces...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* {error && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#991b1b",
              background: "#fee2e2",
              borderRadius: 12,
              border: "1px solid #fca5a5",
            }}
          >
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              {error}
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Vérifiez que le serveur backend est bien démarré.
            </p>
          </div>
        )} */}

        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--muted)",
            }}
          >
            <MdSearch size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucune annonce trouvée
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Essayez un autre filtre ou mot-clé.
            </p>
          </div>
        )}

        {/* Grille annonces */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-auto">
            {filtered.map((annonce) => {
              const cat = catColors[annonce.categorie] || catColors["Général"];
              return (
                <div
                  key={annonce.id_annonce}
                  onClick={() => setSelected(annonce)}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all .25s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 32px rgba(6,182,212,.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: cat.bg,
                        color: cat.color,
                      }}
                    >
                      {annonce.categorie || "Général"}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "var(--subtle)",
                      }}
                    >
                      <MdCalendarToday size={12} />
                      <span style={{ fontSize: 11 }}>
                        {formatDate(annonce.date_publication)}
                      </span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text)",
                      lineHeight: 1.4,
                    }}
                  >
                    {annonce.titre}
                  </h3>

                  {/* Contenu */}
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--muted)",
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {annonce.contenu?.slice(0, 120)}
                    {annonce.contenu?.length > 120 ? "..." : ""}
                  </p>

                  {/* Lire la suite */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--cyan)",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-head)",
                      marginTop: 4,
                    }}
                  >
                    Lire la suite <MdArrowForward size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL DÉTAIL ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(12,26,64,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: "36px",
              width: "100%",
              maxWidth: 560,
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,.2)",
            }}
          >
            {/* Header modal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "var(--font-head)",
                  background: (
                    catColors[selected.categorie] || catColors["Général"]
                  ).bg,
                  color: (catColors[selected.categorie] || catColors["Général"])
                    .color,
                }}
              >
                {selected.categorie || "Général"}
              </span>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "var(--subtle)",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 12,
                lineHeight: 1.3,
              }}
            >
              {selected.titre}
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--subtle)",
                fontSize: 12,
                marginBottom: 20,
              }}
            >
              <MdCalendarToday size={14} />
              <span>{formatDate(selected.date_publication)}</span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "var(--text)",
                lineHeight: 1.8,
              }}
            >
              {selected.contenu}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
