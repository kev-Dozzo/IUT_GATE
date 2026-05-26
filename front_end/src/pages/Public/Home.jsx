import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdSchool,
  MdPeople,
  MdAccountBalance,
  MdCampaign,
  MdArrowForward,
  MdCalendarToday,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getActualites } from "../../services/actualiteService";
// import CoreService from "../../components/layout/CoreService";
import iutCampus1 from "../../assets/public/image3.jpg";
import SearchBar from "../../components/ui/SearchBar";
// import Actualite from "../../../../back_end/src/models/Actualiter";

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
    label: "Acttualites",
    sub: "Actualités campus",
    path: "/actualite",
    bg: "#fef3c7",
    color: "#92400e",
  },
];

const catColors = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Événement: { bg: "#cffafe", color: "#164e63" },
  Infrastructure: { bg: "#dbeafe", color: "#1e40af" },
  Administration: { bg: "#dbeafe", color: "#1e40af" },
  Stage: { bg: "#d1fae5", color: "#065f46" },
  Général: { bg: "#f1f5f9", color: "#475569" },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function HomePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActualites()
      .then((data) => setActualites(data.slice(0, 3)))
      .catch(() => setError("Impossible de charger les annonces."))
      .finally(() => setLoading(false));
  }, []);

  const featured = actualites[0];

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(12,26,64,0.7), rgba(14,95,117,0.7)) ,url(${iutCampus1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          /* background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)", */
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
              background: "var(--cyan-light)",
              color: "var(--text)",
              fontFamily: "var(--font-head)",
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 22,
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
              marginBottom: 36,
              maxWidth: 500,
              margin: "0 auto 36px",
            }}
          >
            Votre guide intelligent pour vous orienter, informer et accompagner
            tout au long de votre parcours universitaire
          </p>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <SearchBar size="large" />
          </div>

          {/* Stats */}
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

      {/* QUICK LINKS */}
      <section
        style={{ maxWidth: 1100, margin: "-24px auto 0", padding: "0 24px" }}
      >
        <div className="grid-4">
          {quickLinks.map(({ icon, label, sub, path, bg, color }) => (
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
                {React.createElement(icon, { size: 22, color })}
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
      {/* Services RÉCENTES */}

      {/* <CoreService /> */}
      {/* ANNONCES RÉCENTES */}
      <section className="page-container" style={{ marginTop: 56 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cyan)",
                fontFamily: "var(--font-head)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              Actualités
            </p>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: -0.5,
              }}
            >
              Annonces récentes
            </h2>
          </div>
          <button
            onClick={() => navigate("/actualites")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              color: "var(--blue)",
              border: "1.5px solid var(--blue)",
              borderRadius: 8,
              padding: "8px 16px",
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Voir toutes <MdArrowForward size={16} />
          </button>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "var(--muted)",
            }}
          >
            Chargement des annonces...
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "var(--muted)",
            }}
          >
            {error}
          </div>
        ) : actualites.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "var(--muted)",
            }}
          >
            Aucune annonce disponible.
          </div>
        ) : (
          featured && (
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
                  e.currentTarget.style.boxShadow =
                    "0 16px 48px rgba(0,0,0,.1)";
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
                    <span style={{ fontSize: 64, opacity: 0.3 }}>
                      <MdSearch />
                    </span>
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
                            catColors[featured.categorie] ||
                            catColors["Général"]
                          ).bg,
                          color: (
                            catColors[featured.categorie] ||
                            catColors["Général"]
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
            </>
          )
        )}
      </section>

      <Footer />
    </div>
  );
}
