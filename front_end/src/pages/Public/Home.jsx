import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdSchool,
  MdPeople,
  MdAccountBalance,
  MdCampaign,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getAnnonces } from "../../services/annonceService";
import { getServices } from "../../services/serviceAdminService";
import CoreService from "../../components/layout/CoreService";
import iutCampus1 from "../../assets/public/image3.jpg";

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
    label: "Annonces",
    sub: "Actualités campus",
    path: "/annonces",
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

export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((data) => setServices(data))
      .catch(() => setError("Impossible de charger les services."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getAnnonces()
      .then((data) => setAnnonces(data.slice(0, 3)))
      .catch(() => setError("Impossible de charger les annonces."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/enseignants?q=${search}`);
  };

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
          padding: "clamp(40px, 8vw, 72px) 24px 80px",
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
              color: "var(--cyan-text)",
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
          <form
            onSubmit={handleSearch}
            style={{
              background: "rgba(255,255,255,.96)",
              borderRadius: 12,
              padding: "10px 10px 10px 18px",
              display: "flex",
              gap: 8,
              maxWidth: 560,
              margin: "0 auto 40px",
              boxShadow: "0 4px 24px rgba(0,0,0,.2)",
            }}
          >
            <MdSearch
              size={40}
              style={{ color: "#94a3b8", flexShrink: 0, marginTop: 2 }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une Filière,un enseignant, un Batiment..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                background: "transparent",
                color: "var(--text)",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--cyan)",
                color: "var(--cyan-text)",
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Rechercher
            </button>
          </form>

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
                <Icon size={22} color={color} />
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

      <CoreService />
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
        ) : annonces.length === 0 ? (
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
          <div className="grid-3">
            {annonces.map((annonce) => {
              const cat = catColors[annonce.categorie] || catColors["Général"];
              return (
                <div
                  key={annonce.id_annonce}
                  onClick={() => navigate(`/actualites/${annonce.id_annonce}`)}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all .2s",
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
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
                    <span style={{ fontSize: 11, color: "var(--subtle)" }}>
                      {annonce.date_publication
                        ? new Date(annonce.date_publication).toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : ""}
                    </span>
                  </div>
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
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--muted)",
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {annonce.contenu?.slice(0, 100)}...
                  </p>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--cyan)",
                      fontWeight: 600,
                      fontFamily: "var(--font-head)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Lire la suite <MdArrowForward size={14} />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
