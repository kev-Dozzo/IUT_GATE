import { useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdSchool,
  MdPeople,
  MdCode,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import iutRassam1 from "../../assets/public/iut-rassam1.jpg"

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
    nom: "EPALE NGOMBA   WILFRIED GIOVANNI",
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
    bg: "#daabe2",
    color: "#8b17cf",
  },
];

export default function AProposPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          backgroundImage:`linear-gradient(rgba(12,26,64,0.7), rgba(14,95,117,0.7)),url(${iutRassam1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          padding: "clamp(40px, 8vw, 72px) 24px",
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
              marginBottom: 20,
            }}
          >
            ✦ À propos
          </span>
          <br />
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
              color: "#7dd3fc",
              fontSize: "clamp(13px, 2vw, 15px)",
              lineHeight: 1.8,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Une plateforme conçue pour connecter les étudiants, enseignants et
            visiteurs au campus de l'Institut Universitaire de Technologie de
            Douala.
          </p>
        </div>
      </section>

      {/* ── PRÉSENTATION IUT ── */}
      <section className="page-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 60,
          }}
        >
          {/* Card IUT */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid var(--border)",
              padding: "32px",
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
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdSchool size={26} color="var(--cyan-dark)" />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 4,
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
                color: "var(--text)",
                lineHeight: 1.9,
                marginBottom: 16,
              }}
            >
              L'IUT de Douala est un établissement d'enseignement supérieur
              technique qui forme des professionnels compétents dans diverses
              disciplines scientifiques et technologiques. Rattaché à
              l'Université de Douala, il propose des programmes de formation
              professionnelle de haut niveau adaptés aux besoins du marché du
              travail.
            </p>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.9 }}>
              Avec plusieurs départements couvrant le Génie Informatique, les
              Réseaux & Télécommunications, le Génie Civil et bien d'autres
              filières, l'IUT s'engage à offrir une formation de qualité alliant
              théorie et pratique.
            </p>
          </div>

          {/* Stats */}
          {[
            {
              icon: MdSchool,
              label: "Filières",
              value: "10+",
              bg: "#cffafe",
              color: "#0e7490",
            },
            {
              icon: MdPeople,
              label: "Enseignants",
              value: "50+",
              bg: "#d1fae5",
              color: "#065f46",
            },
          ].map(({ icon: Icon, label, value, bg, color }) => (
            <div
              key={label}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={28} color={color} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
              <p
                style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ── ÉQUIPE ── */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ marginBottom: 32 }}>
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
              L'équipe
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
              Équipe de développement
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                marginTop: 8,
                lineHeight: 1.7,
              }}
            >
              IUT GATE a été développé par des étudiants pour des etudiants dans
              le cadre d'un projet académique.
            </p>
          </div>

          <div className="grid-auto" style={{ "--min": "220px" }}>
            {equipe.map((membre) => (
              <div
                key={membre.nom}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 12,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = membre.color;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${membre.bg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: membre.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: 22,
                      fontWeight: 800,
                      color: membre.color,
                    }}
                  >
                    {membre.initiales}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0f172a",
                      marginBottom: 4,
                    }}
                  >
                    {membre.nom}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "3px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "var(--font-head)",
                      background: membre.bg,
                      color: membre.color,
                    }}
                  >
                    {membre.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TECHNOLOGIES ── */}
        {/* <div
          style={{
            background: "var(--navy)",
            borderRadius: 20,
            padding: "32px",
            marginBottom: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(6,182,212,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdCode size={22} color="var(--cyan)" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--cyan)",
                  fontFamily: "var(--font-head)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Stack technique
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                Technologies utilisées
              </h3>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["React.js", "#61DAFB", "#0c1a40"],
              ["Express.js", "#68A063", "#0c1a40"],
              ["MySQL", "#00758F", "#fff"],
              ["Sequelize", "#52B0E7", "#0c1a40"],
              ["Leaflet.js", "#199900", "#fff"],
              ["Vite", "#646CFF", "#fff"],
              ["Axios", "#5A29E4", "#fff"],
              ["JWT", "#FB015B", "#fff"],
            ].map(([tech, bg, color]) => (
              <span
                key={tech}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: bg,
                  color: color,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div> */}

        {/* ── CONTACT & LOCALISATION ── */}
        <div>
          <div style={{ marginBottom: 28 }}>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {/* Infos contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  icon: MdLocationOn,
                  label: "Adresse",
                  value: "NGON-BONG, Douala, Cameroun",
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
                    border: "1px solid var(--border)",
                    padding: "18px",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      background: "var(--cyan-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="var(--cyan-dark)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--subtle)",
                        fontFamily: "var(--font-head)",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 4,
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

              {/* Bouton voir carte */}
              <button
                onClick={() => navigate("/carte")}
                style={{
                  padding: "13px",
                  background: "var(--cyan)",
                  color: "var(--cyan-text)",
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

            {/* Mini map placeholder */}
            <div
              style={{
                background: "var(--cyan-light)",
                borderRadius: 14,
                border: "1px solid #67e8f9",
                minHeight: 280,
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
                size={48}
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
      </section>

      <Footer />
    </div>
  );
}
