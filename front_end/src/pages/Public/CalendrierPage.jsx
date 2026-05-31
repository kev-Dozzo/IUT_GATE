import { useState } from "react";
import {
  MdArrowBack,
  MdCalendarToday,
  MdSchool,
  MdAccessTime,
  MdStar,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const EVENEMENTS = [
  // Rentrée
  {
    date: "2025-09-15",
    titre: "Rentrée académique 2025-2026",
    type: "Rentrée",
    desc: "Début officiel de l'année académique pour toutes les filières.",
  },
  {
    date: "2025-09-22",
    titre: "Début des cours — Semestre 1",
    type: "Cours",
    desc: "Premier jour de cours pour les étudiants de toutes promotions.",
  },
  // Semestre 1
  {
    date: "2025-11-03",
    titre: "Examens partiels S1",
    type: "Examen",
    desc: "Examens de mi-semestre pour évaluer la progression des étudiants.",
  },
  {
    date: "2025-12-08",
    titre: "Fin des cours — Semestre 1",
    type: "Cours",
    desc: "Dernier jour de cours du premier semestre.",
  },
  {
    date: "2025-12-15",
    titre: "Examens finaux S1",
    type: "Examen",
    desc: "Session d'examens finaux du premier semestre.",
  },
  {
    date: "2026-01-09",
    titre: "Proclamation résultats S1",
    type: "Résultats",
    desc: "Publication des résultats du premier semestre.",
  },
  // Semestre 2
  {
    date: "2026-01-19",
    titre: "Début des cours — Semestre 2",
    type: "Cours",
    desc: "Reprise des cours pour le second semestre.",
  },
  {
    date: "2026-03-16",
    titre: "Examens partiels S2",
    type: "Examen",
    desc: "Examens de mi-semestre — 2ème semestre.",
  },
  {
    date: "2026-04-20",
    titre: "Congé de Pâques",
    type: "Congé",
    desc: "Interruption pédagogique de Pâques.",
  },
  {
    date: "2026-05-04",
    titre: "Reprise des cours",
    type: "Cours",
    desc: "Retour en cours après les congés de Pâques.",
  },
  {
    date: "2026-05-25",
    titre: "Fin des cours — Semestre 2",
    type: "Cours",
    desc: "Dernier jour de cours du second semestre.",
  },
  {
    date: "2026-06-01",
    titre: "Examens finaux S2",
    type: "Examen",
    desc: "Grande session d'examens finaux.",
  },
  {
    date: "2026-06-20",
    titre: "Proclamation résultats S2",
    type: "Résultats",
    desc: "Publication des résultats finaux.",
  },
  {
    date: "2026-07-01",
    titre: "Session de rattrapage",
    type: "Examen",
    desc: "Session spéciale pour les étudiants en échec.",
  },
  {
    date: "2026-07-15",
    titre: "Concours d'entrée IUT 2026-2027",
    type: "Concours",
    desc: "Concours d'entrée pour la prochaine promotion.",
  },
  {
    date: "2026-08-15",
    titre: "Résultats du concours",
    type: "Résultats",
    desc: "Proclamation des résultats du concours d'entrée.",
  },
];

const typeConfig = {
  Rentrée: { bg: "#cffafe", color: "#0e7490", icon: MdSchool },
  Cours: { bg: "#d1fae5", color: "#065f46", icon: MdCalendarToday },
  Examen: { bg: "#fee2e2", color: "#991b1b", icon: MdAccessTime },
  Résultats: { bg: "#fef3c7", color: "#92400e", icon: MdStar },
  Congé: { bg: "#ede9fe", color: "#5b21b6", icon: MdCalendarToday },
  Concours: { bg: "#dbeafe", color: "#1e40af", icon: MdSchool },
};

const TYPES = ["Tous", ...Object.keys(typeConfig)];

const MOIS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const formatDateFull = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function CalendrierPage() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("Tous");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const filtered = EVENEMENTS.filter(
    (e) => filtre === "Tous" || e.type === filtre,
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Grouper par mois
  const grouped = filtered.reduce((acc, ev) => {
    const d = new Date(ev.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = `${MOIS[d.getMonth()]} ${d.getFullYear()}`;
    if (!acc[key]) acc[key] = { label, events: [] };
    acc[key].events.push(ev);
    return acc;
  }, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(36px, 6vw, 60px) 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,.7)",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 11,
              marginBottom: 24,
              padding: 0,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            <MdArrowBack size={14} /> Accueil
          </button>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            IUT Douala
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(26px, 5vw, 42px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -1,
              marginBottom: 12,
              lineHeight: 1.15,
            }}
          >
            Calendrier académique
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            Toutes les dates importantes de l'année universitaire 2025-2026.
          </p>
          <div
            style={{
              height: 3,
              background: "var(--cyan)",
              width: 56,
              marginTop: 20,
            }}
          />
        </div>
      </section>

      {/* FILTRES */}
      <section
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 60,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: 0,
            overflowX: "auto",
          }}
        >
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFiltre(t)}
              style={{
                padding: "12px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 12,
                color: filtre === t ? "var(--cyan)" : "#94a3b8",
                borderBottom: `2px solid ${filtre === t ? "var(--cyan)" : "transparent"}`,
                whiteSpace: "nowrap",
                transition: "all .2s",
                flexShrink: 0,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(24px, 5vw, 48px) 24px",
        }}
      >
        {Object.values(grouped).map(({ label, events }) => (
          <div key={label} style={{ marginBottom: 40 }}>
            {/* Mois header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {label}
              </h2>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {events.map((ev, i) => {
                const conf = typeConfig[ev.type] || typeConfig["Cours"];
                const Icon = conf.icon;
                const d = new Date(ev.date);
                const isPast = ev.date < today;
                const isToday = ev.date === today;
                const isFirst = i === 0;
                const isLast = i === events.length - 1;

                return (
                  <div
                    key={ev.date + ev.titre}
                    style={{
                      background: isToday ? "var(--cyan-light)" : "#fff",
                      border: `1px solid ${isToday ? "var(--cyan)" : "#e2e8f0"}`,
                      borderTop: isFirst
                        ? `1px solid ${isToday ? "var(--cyan)" : "#e2e8f0"}`
                        : "none",
                      borderRadius: isFirst
                        ? "12px 12px 0 0"
                        : isLast
                          ? "0 0 12px 12px"
                          : 0,
                      padding: "clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)",
                      display: "flex",
                      gap: "clamp(12px, 3vw, 20px)",
                      alignItems: "center",
                      opacity: isPast && !isToday ? 0.55 : 1,
                      transition: "all .2s",
                    }}
                  >
                    {/* Date bloc */}
                    <div
                      style={{ flexShrink: 0, textAlign: "center", width: 48 }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 800,
                          fontSize: 24,
                          color: isToday ? "var(--cyan-dark)" : "#0f172a",
                          lineHeight: 1,
                        }}
                      >
                        {d.getDate()}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {MOIS[d.getMonth()]}
                      </p>
                    </div>

                    {/* Séparateur */}
                    <div
                      style={{
                        width: 1,
                        height: 40,
                        background: "#f1f5f9",
                        flexShrink: 0,
                      }}
                    />

                    {/* Badge + contenu */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 10px",
                            borderRadius: 999,
                            background: conf.bg,
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: "var(--font-head)",
                            color: conf.color,
                          }}
                        >
                          <Icon size={11} /> {ev.type}
                        </span>
                        {isToday && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "var(--cyan-dark)",
                              fontFamily: "var(--font-head)",
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            · Aujourd'hui
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: "clamp(13px, 2vw, 15px)",
                          color: "#0f172a",
                          marginBottom: 4,
                        }}
                      >
                        {ev.titre}
                      </p>
                      {!isMobile && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            lineHeight: 1.5,
                          }}
                        >
                          {ev.desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
            }}
          >
            <MdCalendarToday
              size={40}
              style={{ opacity: 0.2, marginBottom: 12 }}
            />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucun événement pour ce filtre
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
