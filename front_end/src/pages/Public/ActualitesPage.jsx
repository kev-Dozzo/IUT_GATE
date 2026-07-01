import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdClose, MdCampaign } from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getActualites } from "../../services/actualiteService";
import SEO from "../../components/ui/SEO";
import { BASE_URL } from "../../config/constants";

const CATEGORIES = [
  "Toutes",
  "Examens",
  "Événement",
  "Stage",
  "Administration",
  "Infrastructure",
  "Général",
];

const catColors = {
  Examens: { color: "#991b1b" },
  Événement: { color: "#0e7490" },
  Infrastructure: { color: "#1e40af" },
  Administration: { color: "#1e40af" },
  Stage: { color: "#065f46" },
  Général: { color: "#0e7490" },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    getActualites()
      .then(setActualites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = actualites.filter((a) => {
    const matchSearch = a.titre?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Toutes" || a.categorie === categorie;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const getCover = (a) => {
    if (a.photos?.[0]?.url) return `${BASE_URL}${a.photos[0].url}`;
    if (a.photo_url) return `${BASE_URL}${a.photo_url}`;
    return null;
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <SEO
        title="Actualités"
        description="Toutes les actualités de l'IUT de Douala : examens, événements, stages et informations campus."
        url={`${window.location.origin}/actualites`}
      />
      <Navbar />

      {/* ── HERO NAVY — même style que les autres pages ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(32px, 6vw, 56px) 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            IUT Douala
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -1,
                margin: 0,
              }}
            >
              Actualités
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 8,
                padding: "9px 14px",
                minWidth: 240,
                backdropFilter: "blur(8px)",
              }}
            >
              <MdSearch
                size={16}
                style={{ color: "rgba(255,255,255,.6)", flexShrink: 0 }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "#fff",
                  background: "transparent",
                }}
              />
              {search && (
                <MdClose
                  size={14}
                  style={{ color: "rgba(255,255,255,.6)", cursor: "pointer" }}
                  onClick={() => setSearch("")}
                />
              )}
            </div>
          </div>

          {/* Onglets catégories */}
          <div
            style={{
              display: "flex",
              gap: 0,
              borderTop: "1px solid rgba(255,255,255,.15)",
              overflowX: "auto",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategorie(cat)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: 12,
                  color:
                    categorie === cat ? "var(--cyan)" : "rgba(255,255,255,.5)",
                  borderBottom: `2px solid ${categorie === cat ? "var(--cyan)" : "transparent"}`,
                  whiteSpace: "nowrap",
                  transition: "all .2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 56px) 24px",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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
            <MdCampaign size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucune actualité
            </p>
          </div>
        )}

        {/* ARTICLE FEATURED */}
        {!loading &&
          featured &&
          (() => {
            const cover = getCover(featured);
            const cat = catColors[featured.categorie] || catColors["Général"];
            return (
              <div
                onClick={() => navigate(`/actualites/${featured.id_actualite}`)}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : cover
                      ? "1fr 1fr"
                      : "1fr",
                  marginBottom: 64,
                  cursor: "pointer",
                  border: "1px solid #f1f5f9",
                  transition: "box-shadow .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {cover && (
                  <div
                    style={{
                      height: isMobile ? 220 : "clamp(280px, 35vw, 420px)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={cover}
                      alt={featured.titre}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform .5s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  </div>
                )}
                <div
                  style={{
                    padding: "clamp(24px, 5vw, 48px)",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 16,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: cat.color,
                      fontFamily: "var(--font-head)",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      marginBottom: 0,
                    }}
                  >
                    {featured.categorie || "Actualité"}
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(20px, 3vw, 30px)",
                      fontWeight: 800,
                      color: "var(--cyan-dark)",
                      lineHeight: 1.3,
                      letterSpacing: -0.5,
                      margin: 0,
                    }}
                  >
                    {featured.titre}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.8,
                      margin: 0,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {featured.contenu?.slice(0, 200)}
                  </p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    {featured.date_publication
                      ? formatDate(featured.date_publication)
                      : ""}
                  </p>
                </div>
              </div>
            );
          })()}

        {/* GRID "Autres actualités" style uliege.be */}
        {!loading && rest.length > 0 && (
          <>
            {/* Titre section style uliege — gros texte semi-transparent */}
            <div style={{ position: "relative", marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(36px, 7vw, 80px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  opacity: 0.08,
                  letterSpacing: -2,
                  margin: 0,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                Actualités
              </h2>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                <button
                  onClick={() => navigate("/actualites")}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "var(--cyan-dark)",
                    fontFamily: "var(--font-head)",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Toutes les actualités
                </button>
                <div
                  style={{
                    width: "100%",
                    height: 2,
                    background: "var(--cyan)",
                  }}
                />
              </div>
            </div>

            {/* Desktop : 3 colonnes — Mobile : liste horizontale photo+texte */}
            {isMobile ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {rest.map((a, i) => {
                  const cover = getCover(a);
                  const cat = catColors[a.categorie] || catColors["Général"];
                  return (
                    <div
                      key={a.id_actualite}
                      onClick={() => navigate(`/actualites/${a.id_actualite}`)}
                      style={{
                        display: "flex",
                        gap: 16,
                        padding: "20px 0",
                        cursor: "pointer",
                        borderBottom:
                          i < rest.length - 1 ? "1px solid #f1f5f9" : "none",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Photo miniature */}
                      <div
                        style={{
                          width: 110,
                          height: 80,
                          flexShrink: 0,
                          overflow: "hidden",
                          background: "#f1f5f9",
                        }}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt={a.titre}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MdCampaign size={28} color="#cbd5e1" />
                          </div>
                        )}
                      </div>
                      {/* Texte */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: cat.color,
                            fontFamily: "var(--font-head)",
                            textTransform: "uppercase",
                            letterSpacing: 1.5,
                            marginBottom: 6,
                          }}
                        >
                          {a.categorie || "Actualité"}
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: 14,
                            color: "var(--cyan-dark)",
                            lineHeight: 1.35,
                            margin: 0,
                          }}
                        >
                          {a.titre}
                        </h3>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => navigate("/actualites")}
                  style={{
                    marginTop: 24,
                    fontSize: 11,
                    fontWeight: 800,
                    color: "var(--cyan-dark)",
                    fontFamily: "var(--font-head)",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Toutes les actualités
                  <div
                    style={{ height: 2, width: 40, background: "var(--cyan)" }}
                  />
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 32,
                }}
              >
                {rest.slice(0, 6).map((a) => {
                  const cover = getCover(a);
                  const cat = catColors[a.categorie] || catColors["Général"];
                  return (
                    <div
                      key={a.id_actualite}
                      onClick={() => navigate(`/actualites/${a.id_actualite}`)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                      }}
                    >
                      {/* Photo */}
                      <div
                        style={{
                          height: 220,
                          overflow: "hidden",
                          background: "#f1f5f9",
                          marginBottom: 0,
                        }}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt={a.titre}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                              transition: "transform .4s",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.transform = "scale(1)")
                            }
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MdCampaign size={40} color="#cbd5e1" />
                          </div>
                        )}
                      </div>

                      {/* Texte */}
                      <div
                        style={{
                          padding: "20px 0",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: cat.color,
                            fontFamily: "var(--font-head)",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            margin: 0,
                          }}
                        >
                          {a.categorie || "Actualité"}
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: "clamp(15px, 2vw, 18px)",
                            color: "var(--cyan-dark)",
                            lineHeight: 1.35,
                            margin: 0,
                          }}
                        >
                          {a.titre}
                        </h3>
                        {a.contenu && (
                          <p
                            style={{
                              fontSize: 13,
                              color: "#475569",
                              lineHeight: 1.7,
                              margin: 0,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {a.contenu.slice(0, 150)}
                          </p>
                        )}
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
