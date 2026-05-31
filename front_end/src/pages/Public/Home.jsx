import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSchool,
  MdPeople,
  MdAccountBalance,
  MdCampaign,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getActualites } from "../../services/actualiteService";
import { getFilieres } from "../../services/filiereService";
import iutCampus1 from "../../assets/public/image3.jpg";
import UD from "../../assets/public/logo_ud.jpeg";
import Camtel from "../../assets/public/camtel.png";
import minesup from "../../assets/public/min.jpeg";
import SearchBar from "../../components/ui/SearchBar";
import SEO from "../../components/ui/SEO";

const quickLinks = [
  {
    icon: MdSchool,
    label: "Filières",
    sub: "Programmes",
    path: "/filieres",
    bg: "#cffafe",
    color: "#0e7490",
  },
  {
    icon: MdPeople,
    label: "Enseignants",
    sub: "Corps professoral",
    path: "/enseignants",
    bg: "#d1fae5",
    color: "#065f46",
  },
  {
    icon: MdAccountBalance,
    label: "Services",
    sub: "Services",
    path: "/services",
    bg: "#ede9fe",
    color: "#5b21b6",
  },
  {
    icon: MdCampaign,
    label: "Actualités",
    sub: "Actualités campus",
    path: "/actualites",
    bg: "#fef3c7",
    color: "#92400e",
  },
];

const BASE_URL = "http://localhost:5000";

const catColors = {
  Examens: "#991b1b",
  Événement: "#0e7490",
  Infrastructure: "#1e40af",
  Administration: "#1e40af",
  Stage: "#065f46",
  Général: "#475569",
};

const FILIERE_COLORS = [
  "#0e7490",
  "#065f46",
  "#1e40af",
  "#5b21b6",
  "#991b1b",
  "#92400e",
  "#0e7490",
  "#065f46",
  "#1e40af",
  "#5b21b6",
];

const PARTENAIRES = [
  {
    nom: "Université de Douala",
    img: UD,
    lien: "https://www.univ-douala.com",
  },
  { nom: "MINESUP", img: minesup, lien: "https://www.minesup.gov.cm" },
  // { nom: "AUF", img: "/partenaires/auf.png", lien: "https://www.auf.org" },
  {
    nom: "CAMTEL",
    img: Camtel,
    lien: "https://www.camtel.cm",
  },
  // { nom: "UTIC", img: "/partenaires/utic.png", lien: "#" },
];

const getCover = (a) => {
  if (a.photos?.[0]?.url) return `${BASE_URL}${a.photos[0].url}`;
  if (a.photo_url) return `${BASE_URL}${a.photo_url}`;
  return null;
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function HomePage() {
  const navigate = useNavigate();
  const [actualites, setActualites] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    getActualites()
      .then((d) => setActualites(d.slice(0, 4)))
      .catch(console.error);
    getFilieres().then(setFilieres).catch(console.error);
  }, []);

  return (
    <div>
      <SEO
        title="Accueil"
        description="Portail numérique de l'IUT de Douala. Filières, enseignants, carte du campus et actualités."
        url="https://iutgate.vercel.app"
      />
      <Navbar />

      {/* ══ HERO ══ */}
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(12,26,64,0.7), rgba(14,95,117,0.7)), url(${iutCampus1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding:
            "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 32px) clamp(60px, 8vw, 100px)",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(6,182,212,.2)",
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 22,
              border: "1px solid rgba(6,182,212,.3)",
              letterSpacing: 1,
            }}
          >
            Portail Numérique du Campus
          </span>

          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: -1.5,
              marginBottom: 18,
            }}
          >
            Bienvenue sur
            <br />
            <span style={{ color: "var(--cyan)" }}>IUT GATE</span>
          </h1>

          <p
            style={{
              color: "#7dd3fc",
              fontSize: "clamp(13px, 2vw, 16px)",
              lineHeight: 1.7,
              maxWidth: 500,
              margin: "0 auto 36px",
            }}
          >
            Votre guide intelligent pour vous orienter et vous informer. Toutes
            les informations dont vous avez besoin, en un seul endroit, tout au
            long de votre parcours universitaire.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <SearchBar size="large" />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(20px, 5vw, 48px)",
              borderTop: "1px solid rgba(255,255,255,.1)",
              paddingTop: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              ["10+", "Filières"],
              ["50+", "Enseignants"],
              ["6+", "Services"],
              ["7+", "Bâtiments"],
            ].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(20px, 4vw, 28px)",
                    fontWeight: 800,
                    color: "var(--cyan)",
                    lineHeight: 1,
                  }}
                >
                  {n}
                </p>
                <p style={{ fontSize: 12, color: "#7dd3fc", marginTop: 4 }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUICK LINKS ══ */}
      <section
        style={{ maxWidth: 1100, margin: "-24px auto 0", padding: "0 24px" }}
      >
        <div className="grid-4">
          {quickLinks.map(({ icon: Icon, label, sub, path, bg, color }) => (
            <div
              key={label}
              onClick={() => navigate(path)}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid var(--border)",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--cyan)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(6,182,212,.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon icon={Icon} size={22} color={color} />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text)",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
                >
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ACTUALITÉS RÉCENTES ══ */}
      {actualites.length > 0 && (
        <section
          style={{ padding: "clamp(40px, 7vw, 72px) 24px", background: "#fff" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ position: "relative", marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(48px, 9vw, 96px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  opacity: 0.07,
                  letterSpacing: -3,
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
                  Toutes les <br /> actualités
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

            {isMobile ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {actualites.map((a, i) => {
                  const cover = getCover(a);
                  const col = catColors[a.categorie] || "#0e7490";
                  return (
                    <div
                      key={a.id_actualite}
                      onClick={() => navigate(`/actualites/${a.id_actualite}`)}
                      style={{
                        display: "flex",
                        gap: 14,
                        padding: "18px 0",
                        cursor: "pointer",
                        borderBottom:
                          i < actualites.length - 1
                            ? "1px solid #f1f5f9"
                            : "none",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 96,
                          height: 70,
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
                            <MdCampaign size={22} color="#cbd5e1" />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: col,
                            fontFamily: "var(--font-head)",
                            textTransform: "uppercase",
                            letterSpacing: 1.5,
                            marginBottom: 5,
                          }}
                        >
                          {a.categorie || "Actualité"}
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 800,
                            fontSize: 13,
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
                {actualites.slice(0, 3).map((a) => {
                  const cover = getCover(a);
                  const col = catColors[a.categorie] || "#0e7490";
                  return (
                    <div
                      key={a.id_actualite}
                      onClick={() => navigate(`/actualites/${a.id_actualite}`)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          height: 210,
                          overflow: "hidden",
                          background: "#f1f5f9",
                          lineHeight: 0,
                          flexShrink: 0,
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
                              transition: "transform .5s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "scale(1.06)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "scale(1)";
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
                              background: "#f8fafc",
                            }}
                          >
                            <MdCampaign size={40} color="#cbd5e1" />
                          </div>
                        )}
                      </div>

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
                            color: col,
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
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {a.contenu.slice(0, 120)}
                          </p>
                        )}
                        <p
                          style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}
                        >
                          {a.date_publication
                            ? formatDate(a.date_publication)
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ ÉTUDIER À L'IUT ══ */}
      <section
        style={{
          background: "#fff",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            minHeight: isMobile ? "auto" : 500,
          }}
        >
          {/* Photo gauche */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: isMobile ? 260 : 500,
            }}
          >
            <img
              src={iutCampus1}
              alt="Étudiants IUT Douala"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                minHeight: isMobile ? 260 : 500,
                transition: "transform .6s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(12,26,64,.15)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Contenu droit */}
          <div
            style={{
              padding: isMobile
                ? "clamp(28px, 5vw, 40px) 24px"
                : "clamp(40px, 6vw, 64px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "var(--cyan)",
                fontFamily: "var(--font-head)",
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              Futur(es) étudiant(es)
            </p>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(22px, 3.5vw, 30px)",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.25,
                marginBottom: 20,
                letterSpacing: -0.5,
              }}
            >
              Étudier à l'IUT de Douala
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontWeight: 600,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Votre profil :
            </p>

            {[
              { label: "Futur Bachelier en Technologie", path: "/filieres" },
              { label: "Futur étudiant en Licence Pro", path: "/filieres" },
              { label: "Futur étudiant international", path: "/a-propos" },
              { label: "Futur professionnel en formation", path: "/filieres" },
            ].map(({ label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                style={{
                  cursor: "pointer",
                  padding: "12px 0",
                  borderBottom: "1px solid #f1f5f9",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.paddingLeft = "10px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "clamp(13px, 2vw, 15px)",
                    color: "var(--cyan-dark)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </span>
                <div
                  style={{
                    height: 2,
                    width: 28,
                    background: "var(--cyan)",
                    borderRadius: 2,
                  }}
                />
              </div>
            ))}

            <a
              href="https://www.iut-dla.cm/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 22px",
                background: "var(--cyan-dark)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
                marginTop: 16,
                alignSelf: "flex-start",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--navy)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--cyan-dark)";
              }}
            >
              Étudier à l'IUT
              <MdArrowForward size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ══ NOS FILIÈRES ══ */}
      {filieres.length > 0 && (
        <section
          style={{
            padding: "clamp(40px, 7vw, 72px) 24px",
            background: "#f8fafc",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{ position: "relative", marginBottom: isMobile ? 28 : 44 }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(40px, 8vw, 90px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  opacity: 0.07,
                  letterSpacing: -3,
                  margin: 0,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                Nos Filières
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
                  onClick={() => navigate("/filieres")}
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
                  Voir plus
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              {filieres.slice(0, isMobile ? 6 : 9).map((f, i) => {
                const col = FILIERE_COLORS[i % FILIERE_COLORS.length];
                return (
                  <div
                    key={f.id_filiere}
                    onClick={() => navigate(`/filieres/${f.id_filiere}`)}
                    style={{
                      background: "#fff",
                      border: "1px solid #f1f5f9",
                      padding: "clamp(18px, 3vw, 26px) clamp(16px, 2vw, 24px)",
                      cursor: "pointer",
                      transition: "all .25s",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = col;
                      e.currentTarget.style.paddingLeft =
                        "clamp(22px, 4vw, 32px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.paddingLeft =
                        "clamp(16px, 2vw, 24px)";
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 48,
                        borderRadius: 3,
                        background: col,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: col,
                          fontFamily: "var(--font-head)",
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                          marginBottom: 6,
                        }}
                      >
                        {f.departement?.nom || "IUT Douala"}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: "clamp(13px, 1.8vw, 15px)",
                          color: "#0f172a",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.nom}
                      </p>
                      <div
                        style={{
                          height: 2,
                          width: 24,
                          background: col,
                          borderRadius: 2,
                          marginTop: 8,
                        }}
                      />
                    </div>
                    <MdArrowForward
                      size={16}
                      color={col}
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ PARTENAIRES ══ */}
      <section
        style={{
          padding: "clamp(28px, 5vw, 52px) 24px",
          background: "#fff",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "var(--muted)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 2.5,
              textAlign: "center",
              marginBottom: 36,
            }}
          >
            Nos Partenaires
          </p>

          <div
            style={{
              display: "flex",
              gap: "clamp(24px, 6vw, 64px)",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {PARTENAIRES.map(({ nom, img, lien }) => (
              <a
                key={nom}
                href={lien}
                target="_blank"
                rel="noreferrer"
                title={nom}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all .3s",
                  textDecoration: "none",
                }}
              >
                <img
                  src={img}
                  alt={nom}
                  style={{
                    height: 75,
                    maxWidth: 140,
                    objectFit: "contain",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "block";
                    }
                  }}
                />
                <div
                  style={{
                    display: "none",
                    background: "#f1f5f9",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: 12,
                    color: "#94a3b8",
                  }}
                >
                  {nom}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
