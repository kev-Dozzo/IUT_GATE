import { useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdSchool,
  MdPeople,
  MdArrowForward,
  MdCode,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import iutRassam1 from "../../assets/public/iut-rassam1.jpg";

const equipe = [
  {
    nom: "DAGANG TCHUIKOUA YOBS KOLER",
    role: "Chef de projet & FULLSTACK",
    initiales: "DT",
    bg: "#cffafe",
    color: "#0e7490",
  },
  {
    nom: "DONFACK WAMBA ANTONIE",
    role: "Frontend React",
    initiales: "DWA",
    bg: "#d1fae5",
    color: "#065f46",
  },
  {
    nom: "ELATE NGALLE KEVIN AUXENCE",
    role: "FULLSTACK",
    initiales: "ENKA",
    bg: "#fef3c7",
    color: "#92400e",
  },
  {
    nom: "EPALE NGOMBA WILFRIED GIOVANNI",
    role: "Frontend React",
    initiales: "ENWG",
    bg: "#d1fae5",
    color: "#065f46",
  },
  {
    nom: "DOKOU NGASSA ARLANE",
    role: "Base de données",
    initiales: "DNA",
    bg: "#ede9fe",
    color: "#5b21b6",
  },
  {
    nom: "DONGMO JACKY DAMARIS",
    role: "UI/UX Design",
    initiales: "DJ",
    bg: "#fee2e2",
    color: "#991b1b",
  },
  {
    nom: "FOKA KAMMOE ALAN BRYAN",
    role: "UI/UX Design",
    initiales: "FKAB",
    bg: "#f3e8ff",
    color: "#7e22ce",
  },
];

export default function AProposPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO avec image de fond ── */}
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(12,26,64,0.75), rgba(14,95,117,0.75)), url(${iutRassam1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "clamp(48px, 9vw, 80px) 24px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(6,182,212,.25)",
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 20,
              border: "1px solid rgba(6,182,212,.3)",
              letterSpacing: 1,
            }}
          >
             À propos
          </span>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: -1,
              marginBottom: 16,
            }}
          >
            <span style={{ color: "var(--cyan)" }}>IUT GATE</span>
            <br />
            Le portail numérique
            <br />
            de l'IUT de Douala
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.75)",
              fontSize: "clamp(13px, 2vw, 15px)",
              lineHeight: 1.8,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Une plateforme conçue pour connecter les étudiants, enseignants et
            visiteurs au campus de l'IUT de Douala.
          </p>
          <div
            style={{
              height: 3,
              background: "var(--cyan)",
              width: 56,
              margin: "24px auto 0",
            }}
          />
        </div>
      </section>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(32px, 6vw, 64px) 24px",
        }}
      >
        {/* ── PRÉSENTATION ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 64,
          }}
        >
          {/* Texte principal */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: "clamp(24px, 4vw, 36px)",
              gridColumn: "span 2",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 13,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdSchool size={24} color="var(--cyan-dark)" />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(16px, 2.5vw, 20px)",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 3,
                  }}
                >
                  Institut Universitaire de Technologie
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--cyan)",
                    fontWeight: 500,
                  }}
                >
                  Douala, Cameroun
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#334155",
                lineHeight: 1.9,
                marginBottom: 14,
              }}
            >
              L'IUT de Douala est un établissement d'enseignement supérieur
              technique qui forme des professionnels compétents dans diverses
              disciplines scientifiques et technologiques. Rattaché à
              l'Université de Douala, il propose des programmes de formation
              professionnelle de haut niveau adaptés aux besoins du marché du
              travail.
            </p>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.9 }}>
              Avec plusieurs départements couvrant le Génie Informatique, les
              Réseaux & Télécommunications, le Génie Civil et bien d'autres
              filières, l'IUT s'engage à offrir une formation de qualité alliant
              théorie et pratique.
            </p>
          </div>
        </div>

        {/* ── ÉQUIPE ── */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 28 }}>
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
              L'équipe
            </p>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: -0.5,
                marginBottom: 8,
              }}
            >
              Équipe de développement
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              IUTGate a été développé par des étudiants pour des étudiants dans
              le cadre d'un projet académique.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {equipe.map((m) => (
              <div
                key={m.nom}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  padding: "clamp(18px, 3vw, 24px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 12,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = m.color;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${m.bg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: m.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 18,
                      fontWeight: 800,
                      color: m.color,
                    }}
                  >
                    {m.initiales}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#0f172a",
                      marginBottom: 6,
                      lineHeight: 1.35,
                    }}
                  >
                    {m.nom}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "var(--font-head)",
                      background: m.bg,
                      color: m.color,
                    }}
                  >
                    {m.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div>
          <div style={{ marginBottom: 24 }}>
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
              Nous trouver
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
              Contact & Localisation
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  icon: MdLocationOn,
                  label: "Adresse",
                  value: "NDON-BONG, Douala, Cameroun",
                },
                {
                  icon: MdEmail,
                  label: "Email",
                  value: "contact@iut-douala.cm",
                },
                {
                  icon: MdPhone,
                  label: "Téléphone",
                  value: "+237 233 40 65 00",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    padding: "16px 18px",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--cyan-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color="var(--cyan-dark)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--subtle)",
                        fontFamily: "var(--font-head)",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text)",
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate("/carte")}
                style={{
                  padding: "13px",
                  background: "var(--cyan)",
                  color: "var(--navy)",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--cyan-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--cyan)")
                }
              >
                <MdLocationOn size={18} /> Voir sur la carte interactive
              </button>
            </div>

            <div
              style={{
                background: "var(--cyan-light)",
                borderRadius: 14,
                border: "1px solid #67e8f9",
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onClick={() => navigate("/carte")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#a5f3fc";
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--cyan-light)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <MdLocationOn
                size={44}
                color="var(--cyan-dark)"
                style={{ opacity: 0.6 }}
              />
              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--cyan-dark)",
                }}
              >
                Cliquer pour ouvrir la carte
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--cyan-dark)",
                  opacity: 0.7,
                }}
              >
                Douala, Cameroun
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
