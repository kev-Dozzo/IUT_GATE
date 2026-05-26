// src/pages/Public/ActualitesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCalendarToday,
  MdArrowForward,
  MdSearch,
  MdClose,
  MdSpeaker,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getActualites } from "../../services/actualiteService";

const catColors = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Événement: { bg: "#cffafe", color: "#164e63" },
  Infrastructure: { bg: "#dbeafe", color: "#1e40af" },
  Administration: { bg: "#dbeafe", color: "#1e40af" },
  Stage: { bg: "#d1fae5", color: "#065f46" },
  Général: { bg: "#f1f5f9", color: "#475569" },
};

const CATEGORIES = [
  "Toutes",
  "Examens",
  "Événement",
  "Stage",
  "Administration",
  "Infrastructure",
  "Général",
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function ActualitesPage() {
  const navigate = useNavigate();
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Toutes");

  useEffect(() => {
    getActualites()
      .then((data) => setActualites(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = actualites.filter((a) => {
    const matchSearch =
      a.titre?.toLowerCase().includes(search.toLowerCase()) ||
      a.contenu?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Toutes" || a.categorie === categorie;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(32px, 6vw, 56px) 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 10,
            }}
          >
            Portail IUT Douala
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(26px, 5vw, 44px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -1,
              marginBottom: 20,
            }}
          >
            Actualités du campus
          </h1>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,.12)",
              borderRadius: 12,
              padding: "12px 18px",
              maxWidth: 500,
              border: "1px solid rgba(255,255,255,.2)",
            }}
          >
            <MdSearch size={18} style={{ color: "#94a3b8", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une actualité..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                background: "transparent",
                color: "#fff",
                fontFamily: "var(--font-body)",
              }}
            />
            {search && (
              <MdClose
                size={16}
                style={{ color: "#94a3b8", cursor: "pointer" }}
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 48px) 24px",
        }}
      >
        {/* Filtres catégories */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: `1.5px solid ${categorie === cat ? "var(--cyan)" : "var(--border)"}`,
                background: categorie === cat ? "var(--cyan)" : "#fff",
                color: categorie === cat ? "var(--cyan-text)" : "var(--muted)",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--muted)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucune actualité trouvée
            </p>
          </div>
        )}

        {!loading && featured && (
          <>
            {/* ── FEATURED — Article principal ── */}
            <div
              onClick={() => navigate(`/actualites/${featured.id_actualite}`)}
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid var(--border)",
                overflow: "hidden",
                cursor: "pointer",
                marginBottom: 32,
                display: "grid",
                gridTemplateColumns: featured.photo_url ? "1fr 1fr" : "1fr",
                minHeight: 300,
                transition: "all .25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,.1)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Photo */}
              {featured.photo_url ? (
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={`http://localhost:5000${featured.photo_url}`}
                    alt={featured.titre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      minHeight: 280,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(12,26,64,.3), transparent)",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    background: "linear-gradient(135deg, #0c1a40, #0e5f75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                  }}
                >
                  <span style={{ fontSize: 64, opacity: 0.3 }}><MdSearch/></span>
                </div>
              )}

              {/* Contenu */}
              <div
                style={{
                  padding: "clamp(24px, 4vw, 36px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 16,
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
                          catColors[featured.categorie] || catColors["Général"]
                        ).bg,
                        color: (
                          catColors[featured.categorie] || catColors["Général"]
                        ).color,
                      }}
                    >
                       À la une · {featured.categorie || "Général"}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(18px, 3vw, 26px)",
                      fontWeight: 800,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      marginBottom: 14,
                      letterSpacing: -0.5,
                    }}
                  >
                    {featured.titre}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--muted)",
                      lineHeight: 1.8,
                    }}
                  >
                    {featured.contenu?.slice(0, 180)}...
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--muted)",
                      fontSize: 12,
                    }}
                  >
                    <MdCalendarToday size={13} />
                    {featured.date_publication
                      ? formatDate(featured.date_publication)
                      : ""}
                  </div>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 13,
                      color: "var(--cyan)",
                      fontWeight: 700,
                      fontFamily: "var(--font-head)",
                    }}
                  >
                    Lire plus <MdArrowForward size={15} />
                  </span>
                </div>
              </div>
            </div>

            {/* ── RESTE DES ARTICLES ── */}
            {rest.length > 0 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  Autres actualités
                </p>
                {rest.map((a) => {
                  const cat = catColors[a.categorie] || catColors["Général"];
                  return (
                    <div
                      key={a.id_actualite}
                      onClick={() => navigate(`/actualites/${a.id_actualite}`)}
                      style={{
                        background: "#fff",
                        borderRadius: 14,
                        border: "1px solid var(--border)",
                        padding: "0",
                        cursor: "pointer",
                        overflow: "hidden",
                        display: "flex",
                        transition: "all .2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--cyan)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {/* Bande couleur gauche */}
                      <div
                        style={{
                          width: 5,
                          background: cat.color,
                          flexShrink: 0,
                        }}
                      />

                      {/* Photo miniature */}
                      {a.photo_url && (
                        <img
                          src={`http://localhost:5000${a.photo_url}`}
                          alt={a.titre}
                          style={{
                            width: 120,
                            height: "100%",
                            objectFit: "cover",
                            flexShrink: 0,
                            minHeight: 90,
                          }}
                        />
                      )}

                      {/* Contenu */}
                      <div
                        style={{
                          flex: 1,
                          padding: "16px 20px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minWidth: 0,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                padding: "2px 9px",
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "var(--font-head)",
                                background: cat.bg,
                                color: cat.color,
                              }}
                            >
                              {a.categorie || "Général"}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--subtle)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <MdCalendarToday size={11} />
                              {a.date_publication
                                ? formatDate(a.date_publication)
                                : ""}
                            </span>
                          </div>
                          <h3
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 700,
                              fontSize: "clamp(13px, 2vw, 15px)",
                              color: "#0f172a",
                              lineHeight: 1.4,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {a.titre}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            marginTop: 6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {a.contenu?.slice(0, 90)}...
                        </p>
                      </div>

                      {/* Flèche droite */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          paddingRight: 16,
                          flexShrink: 0,
                        }}
                      >
                        <MdArrowForward size={18} color="var(--cyan)" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
