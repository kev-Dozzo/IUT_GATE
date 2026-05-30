import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdCalendarToday,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdCampaign,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  getActualiteById,
  getActualites,
} from "../../services/actualiteService";
import SEO from "../../components/ui/SEO";

const BASE_URL = "http://localhost:5000";

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

// ── Lightbox plein écran ──
function Lightbox({ photos, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c - 1 + photos.length) % photos.length);
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [photos.length, onClose]);

  const src = (p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.96)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to bottom, rgba(0,0,0,.6), transparent)",
          zIndex: 1,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,.7)",
            fontSize: 13,
            fontFamily: "var(--font-head)",
            fontWeight: 600,
          }}
        >
          {current + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 8,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <MdClose size={20} />
        </button>
      </div>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0 72px",
        }}
      >
        <img
          src={src(photos[current])}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            display: "block",
          }}
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((c) => (c - 1 + photos.length) % photos.length)
              }
              style={{
                position: "absolute",
                left: 16,
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                transition: "all .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.1)")
              }
            >
              <MdChevronLeft size={26} />
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % photos.length)}
              style={{
                position: "absolute",
                right: 16,
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                transition: "all .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.1)")
              }
            >
              <MdChevronRight size={26} />
            </button>
          </>
        )}
      </div>

      {/* Miniatures */}
      {photos.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            padding: "0 24px",
            overflowX: "auto",
            maxWidth: "90vw",
          }}
        >
          {photos.map((p, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 64,
                height: 48,
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                flexShrink: 0,
                border: `2px solid ${i === current ? "var(--cyan)" : "transparent"}`,
                opacity: i === current ? 1 : 0.45,
                transition: "all .2s",
              }}
            >
              <img
                src={src(p)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoMosaic({ photos, onPhotoClick }) {
  if (!photos?.length) return null;
  const src = (p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`);

  if (photos.length === 1)
    return (
      <div
        onClick={() => onPhotoClick(0)}
        style={{
          cursor: "pointer",
          overflow: "hidden",
          marginBottom: 40,
          lineHeight: 0,
        }}
      >
        <img
          src={src(photos[0])}
          alt=""
          style={{
            width: "100%",
            maxHeight: 480,
            objectFit: "cover",
            display: "block",
            transition: "transform .4s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
      </div>
    );

  if (photos.length === 2)
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          marginBottom: 40,
          lineHeight: 0,
        }}
      >
        {photos.slice(0, 2).map((p, i) => (
          <div
            key={i}
            onClick={() => onPhotoClick(i)}
            style={{ height: 300, overflow: "hidden", cursor: "pointer" }}
          >
            <img
              src={src(p)}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform .4s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
    );

  // 3+ photos — mosaïque exacte uliege.be : 2 colonnes gauche + 1 grande droite
  const left = photos.slice(0, Math.ceil((photos.length - 1) / 1));
  const right = photos[photos.length - 1];

  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 3,
          lineHeight: 0,
          position: "relative",
        }}
      >
        {/* 2 colonnes de petites */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 3 }}>
          {photos.slice(0, 2).map((p, i) => (
            <div
              key={i}
              onClick={() => onPhotoClick(i)}
              style={{ height: 150, overflow: "hidden", cursor: "pointer" }}
            >
              <img
                src={src(p)}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform .4s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 3 }}>
          {photos.slice(2, 4).map((p, i) => (
            <div
              key={i}
              onClick={() => onPhotoClick(i + 2)}
              style={{
                height: 150,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <img
                src={src(p)}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform .4s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
              {/* Bouton "VOIR LA GALERIE COMPLÈTE" sur image du milieu */}
              {i === 0 && photos.length > 4 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(12,26,64,.3)",
                  }}
                >
                  <span
                    style={{
                      background: "var(--cyan)",
                      color: "var(--cyan-text)",
                      padding: "8px 14px",
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: "var(--font-head)",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Voir la galerie complète
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Grande photo droite */}
        <div
          onClick={() =>
            onPhotoClick(photos.length > 4 ? 4 : photos.length - 1)
          }
          style={{ overflow: "hidden", cursor: "pointer" }}
        >
          <img
            src={src(photos[photos.length > 4 ? 4 : photos.length - 1])}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .4s",
              minHeight: 303,
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
      </div>
    </div>
  );
}

export default function ActualiteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actualite, setActualite] = useState(null);
  const [autres, setAutres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getActualiteById(id), getActualites()])
      .then(([act, all]) => {
        setActualite(act);
        setAutres(
          all.filter((a) => a.id_actualite !== parseInt(id)).slice(0, 3),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const allPhotos = actualite
    ? [
        ...(actualite.photo_url ? [actualite.photo_url] : []),
        ...(actualite.photos?.map((p) => p.url) || []),
      ].filter((p, i, arr) => arr.indexOf(p) === i)
    : [];

  const cat = catColors[actualite?.categorie] || catColors["Général"];

  const getCover = (a) => {
    if (a.photos?.[0]?.url) return `${BASE_URL}${a.photos[0].url}`;
    if (a.photo_url) return `${BASE_URL}${a.photo_url}`;
    return null;
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <SEO
        title={actualite?.titre}
        description={actualite?.contenu?.slice(0, 150)}
        url={`https://iutgate.vercel.app/actualites/${id}`}
        image={
          actualite?.photo_url
            ? `http://localhost:5000${actualite.photo_url}`
            : undefined
        }
        type="article"
      />
      <Navbar />

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

      {!loading && actualite && (
        <>
          {/* ── HERO NAVY ── */}
          <section
            style={{
              background:
                "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
              padding: "clamp(28px, 5vw, 48px) 24px",
            }}
          >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              {/* Retour */}
              <button
                onClick={() => navigate("/actualites")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,.7)",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 11,
                  marginBottom: 28,
                  padding: 0,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                <MdArrowBack size={14} /> Retour
              </button>

              {/* Catégorie */}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "var(--cyan)",
                  fontFamily: "var(--font-head)",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 16,
                }}
              >
                {actualite.categorie || "Actualité"}
              </p>

              {/* Titre */}
              <h1
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(22px, 4.5vw, 36px)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  letterSpacing: -0.8,
                  marginBottom: 0,
                }}
              >
                {actualite.titre}
              </h1>

              {/* Trait cyan */}
              <div
                style={{
                  height: 3,
                  background: "var(--cyan)",
                  width: 80,
                  marginTop: 24,
                }}
              />
            </div>
          </section>

          {/* ── META (date + tags) — fond légèrement gris ── */}
          <section
            style={{
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              padding: "clamp(16px, 3vw, 24px) 24px",
            }}
          >
            <div
              style={{
                maxWidth: 900,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                <MdCalendarToday size={14} color="var(--cyan)" />
                {actualite.date_publication
                  ? formatDate(actualite.date_publication)
                  : ""}
              </div>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 11, color: "#64748b" }}>Dans</span>
                <span
                  style={{
                    padding: "3px 10px",
                    background: "var(--cyan)",
                    color: "#fff",
                    borderRadius: 2,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-head)",
                    letterSpacing: 0.5,
                  }}
                >
                  {actualite.categorie || "Général"}
                </span>
              </div>
            </div>
          </section>

          {/* ── CORPS ARTICLE ── */}
          <article
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "clamp(32px, 5vw, 56px) 24px",
            }}
          >
            {/* Mosaïque photos */}
            {allPhotos.length > 0 && (
              <PhotoMosaic photos={allPhotos} onPhotoClick={setLightboxIndex} />
            )}

            {/* Chapeau italique style uliege */}
            {actualite.contenu && (
              <p
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  color: "#334155",
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  marginBottom: 36,
                }}
              >
                {actualite.contenu.slice(0, 220)}
              </p>
            )}

            {/* Corps avec drop cap style uliege */}
            {actualite.contenu &&
              actualite.contenu.length > 220 &&
              (() => {
                const rest = actualite.contenu.slice(220);
                const firstChar = rest.trimStart()[0] || "";
                const restText = rest.trimStart().slice(1);
                return (
                  <div
                    style={{
                      fontSize: "clamp(14px, 2vw, 16px)",
                      color: "#334155",
                      lineHeight: 1.9,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    <span
                      style={{
                        float: "left",
                        fontFamily: "var(--font-head)",
                        fontSize: "clamp(56px, 9vw, 76px)",
                        fontWeight: 800,
                        color: "var(--cyan-dark)",
                        lineHeight: 0.82,
                        marginRight: 8,
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {firstChar.toUpperCase()}
                    </span>
                    {restText}
                  </div>
                );
              })()}

            {/* Séparateur */}
            <div
              style={{ height: 2, background: "#f1f5f9", margin: "48px 0 0" }}
            />
          </article>

          {/* ── AUTRES ACTUALITÉS — style exact uliege.be ── */}
          {autres.length > 0 && (
            <section
              style={{
                padding: "clamp(40px, 6vw, 72px) 24px",
                background: "#fff",
              }}
            >
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Titre section */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: isMobile ? 32 : 48,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(40px, 8vw, 90px)",
                      fontWeight: 800,
                      color: "#0f172a",
                      opacity: 0.08,
                      letterSpacing: -2,
                      margin: 0,
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    Autres actualités
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

                {/* Desktop 3 colonnes / Mobile liste */}
                {isMobile ? (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 0 }}
                  >
                    {autres.map((a, i) => {
                      const cover = getCover(a);
                      const c = catColors[a.categorie] || catColors["Général"];
                      return (
                        <div
                          key={a.id_actualite}
                          onClick={() =>
                            navigate(`/actualites/${a.id_actualite}`)
                          }
                          style={{
                            display: "flex",
                            gap: 16,
                            padding: "20px 0",
                            cursor: "pointer",
                            borderBottom:
                              i < autres.length - 1
                                ? "1px solid #f1f5f9"
                                : "none",
                            alignItems: "flex-start",
                          }}
                        >
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
                                alt=""
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
                                <MdCampaign size={24} color="#cbd5e1" />
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: 9,
                                fontWeight: 800,
                                color: c.color,
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
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 32,
                    }}
                  >
                    {autres.map((a) => {
                      const cover = getCover(a);
                      const c = catColors[a.categorie] || catColors["Général"];
                      return (
                        <div
                          key={a.id_actualite}
                          onClick={() =>
                            navigate(`/actualites/${a.id_actualite}`)
                          }
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* Photo */}
                          <div
                            style={{
                              height: 220,
                              overflow: "hidden",
                              background: "#f1f5f9",
                              lineHeight: 0,
                            }}
                          >
                            {cover ? (
                              <img
                                src={cover}
                                alt=""
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
                                color: c.color,
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
                              <>
                                <p
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    lineHeight: 1.5,
                                    margin: 0,
                                  }}
                                >
                                  {a.contenu.slice(0, 60)}.
                                </p>
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
                                  {a.contenu.slice(60, 200)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && allPhotos.length > 0 && (
        <Lightbox
          photos={allPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <Footer />
    </div>
  );
}
