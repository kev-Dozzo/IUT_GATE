import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCalendarToday,
  MdSchool,
  MdArrowForward,
  MdDownload,
  MdOpenInNew,
  MdFilterList,
  MdBook,
  MdBuild,
  MdCommentBank,
  MdMenuBook,
  MdBookmark,
  MdStar,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SEO from "../../components/ui/SEO";
import { getEvenements } from "../../services/calendrierService";
import { getProgrammes } from "../../services/programmeService";

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

const TYPE_COLORS = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Cours: { bg: "#d1fae5", color: "#065f46" },
  Congé: { bg: "#ede9fe", color: "#5b21b6" },
  Événement: { bg: "#cffafe", color: "#0e7490" },
  Concours: { bg: "#dbeafe", color: "#1e40af" },
  Résultats: { bg: "#fef3c7", color: "#92400e" },
};

const CYCLE_CONFIG = {
  DUT: {
    color: "#0e7490",
    bg: "#cffafe",
    desc: "Diplôme Universitaire de Technologie - 2 ans",
    icon: <MdSchool />,
  },
  BTS: {
    color: "#065f46",
    bg: "#d1fae5",
    desc: "Brevet de Technicien Supérieur - 2 ans",
    icon: <MdBookmark />,
  },
  LICENCE: {
    color: "#5b21b6",
    bg: "#ede9fe",
    desc: "Licence de Technologie - 3ème année",
    icon: <MdCommentBank />,
  },
  MASTER: {
    color: "#92400e",
    bg: "#fef3c7",
    desc: "Master spécialisé - Bac+5",
    icon: <MdStar />,
  },
};

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`;
};

export default function CalendrierProgrammesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("calendrier");
  const [evenements, setEvenements] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [filtreCycle, setFiltreCycle] = useState("tous");
  const [filtreType, setFiltreType] = useState("tous");
  const [cycleProg, setCycleProg] = useState("DUT");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([getEvenements(), getProgrammes()])
      .then(([evs, progs]) => {
        setEvenements(evs);
        setProgrammes(progs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const CYCLES = ["tous", "DUT", "BTS", "LICENCE", "MASTER"];
  const TYPES = [
    "tous",
    "Examens",
    "Cours",
    "Congé",
    "Événement",
    "Concours",
    "Résultats",
  ];

  const filteredEvs = evenements
    .filter((e) => {
      const okCycle =
        filtreCycle === "tous" || e.cycle === filtreCycle || e.cycle === "tous";
      const okType = filtreType === "tous" || e.type === filtreType;
      return okCycle && okType;
    })
    .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));

  const grouped = filteredEvs.reduce((acc, ev) => {
    const d = new Date(ev.date_debut);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = `${MOIS[d.getMonth()]} ${d.getFullYear()}`;
    if (!acc[key]) acc[key] = { label, events: [] };
    acc[key].events.push(ev);
    return acc;
  }, {});

  const progsCycle = programmes
    .filter((p) => p.cycle === cycleProg)
    .sort((a, b) => a.ordre - b.ordre || a.nom.localeCompare(b.nom));

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <SEO
        title="Calendrier & Programmes"
        description="Calendrier académique et programmes scolaires de l'IUT de Douala. DUT, BTS, Licence, Master."
        url="/calendrier"
      />
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
            IUT de Douala
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
            Calendrier & Programmes
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.7,
            }}
          >
            Consultez les dates importantes de l'année académique et accédez aux
            programmes de chaque cycle.
          </p>
          
        </div>
      </section>

      {/* TABS */}
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
          }}
        >
          {[
            {
              key: "calendrier",
              icon: <MdCalendarToday />,
              label: "Calendrier académique",
              count: evenements.length,
            },
            {
              key: "programmes",
              icon: <MdBook />,
              label: "Programmes scolaires",
              count: programmes.length,
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "14px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 13,
                color: tab === t.key ? "var(--cyan)" : "#94a3b8",
                borderBottom: `2px solid ${tab === t.key ? "var(--cyan)" : "transparent"}`,
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              {t.icon}
              {t.label}
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: 999,
                  background: tab === t.key ? "var(--cyan-light)" : "#f1f5f9",
                  color: tab === t.key ? "var(--cyan-dark)" : "var(--muted)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(24px, 5vw, 40px) 24px",
        }}
      >
        {/* ══ CALENDRIER ══ */}
        {tab === "calendrier" && (
          <div>
            {/* Filtres */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                padding: 16,
                marginBottom: 28,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginRight: 4,
                }}
              >
                <MdFilterList size={16} color="var(--muted)" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--muted)",
                    fontFamily: "var(--font-head)",
                  }}
                >
                  Filtrer :
                </span>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CYCLES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFiltreCycle(c)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      border: `1.5px solid ${filtreCycle === c ? "var(--cyan)" : "var(--border)"}`,
                      background:
                        filtreCycle === c ? "var(--cyan-light)" : "#fff",
                      color:
                        filtreCycle === c ? "var(--cyan-dark)" : "var(--muted)",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 11,
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {c === "tous" ? "Tous" : c}
                  </button>
                ))}
              </div>

              <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TYPES.map((t) => {
                  const conf = TYPE_COLORS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setFiltreType(t)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        border: `1.5px solid ${filtreType === t ? conf?.color || "#0f172a" : "var(--border)"}`,
                        background:
                          filtreType === t ? conf?.bg || "#0f172a" : "#fff",
                        color:
                          filtreType === t
                            ? conf?.color || "#fff"
                            : "var(--muted)",
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: "pointer",
                        transition: "all .2s",
                      }}
                    >
                      {t === "tous" ? "Tous types" : t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prochains événements highlight */}
            {filteredEvs.filter((e) => e.date_debut >= today).slice(0, 3)
              .length > 0 && (
              <div style={{ marginBottom: 32 }}>
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
                  À venir
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                    gap: 12,
                  }}
                >
                  {filteredEvs
                    .filter((e) => e.date_debut >= today)
                    .slice(0, 3)
                    .map((ev) => {
                      const conf = TYPE_COLORS[ev.type] || {
                        bg: "#f1f5f9",
                        color: "#475569",
                      };
                      const d = new Date(ev.date_debut);
                      return (
                        <div
                          key={ev.id_evenement}
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            border: `1px solid ${conf.color}33`,
                            padding: "16px",
                            borderLeft: `4px solid ${conf.color}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 999,
                                background: conf.bg,
                                color: conf.color,
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "var(--font-head)",
                              }}
                            >
                              {ev.type}
                            </span>
                            {ev.cycle !== "tous" && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "var(--muted)",
                                  fontWeight: 600,
                                }}
                              >
                                {ev.cycle}
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#0f172a",
                              marginBottom: 6,
                              lineHeight: 1.3,
                            }}
                          >
                            {ev.titre}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: conf.color,
                              fontWeight: 600,
                            }}
                          >
                            <MdCalendarToday />
                            {formatDate(ev.date_debut)}
                            {ev.date_fin &&
                              ev.date_fin !== ev.date_debut &&
                              ` → ${formatDate(ev.date_fin)}`}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Timeline par mois */}
            {Object.keys(grouped).length === 0 ? (
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
                  Aucun événement pour ces filtres
                </p>
              </div>
            ) : (
              Object.values(grouped).map(({ label, events }) => (
                <div key={label} style={{ marginBottom: 32 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 12,
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {label}
                    </h2>
                    <div
                      style={{ flex: 1, height: 1, background: "#e2e8f0" }}
                    />
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {events.map((ev, i) => {
                      const conf = TYPE_COLORS[ev.type] || {
                        bg: "#f1f5f9",
                        color: "#475569",
                      };
                      const d = new Date(ev.date_debut);
                      const isPast = ev.date_debut < today;
                      const isToday = ev.date_debut === today;
                      const isFirst = i === 0;
                      const isLast = i === events.length - 1;

                      return (
                        <div
                          key={ev.id_evenement}
                          style={{
                            background: isToday ? "var(--cyan-light)" : "#fff",
                            border: `1px solid ${isToday ? "var(--cyan)" : "#e2e8f0"}`,
                            borderTop: isFirst ? undefined : "none",
                            borderRadius: isFirst
                              ? "12px 12px 0 0"
                              : isLast
                                ? "0 0 12px 12px"
                                : 0,
                            padding: isMobile ? "14px 16px" : "16px 20px",
                            display: "flex",
                            gap: isMobile ? 12 : 16,
                            alignItems: "flex-start",
                            opacity: isPast && !isToday ? 0.5 : 1,
                          }}
                        >
                          {/* Date */}
                          <div
                            style={{
                              flexShrink: 0,
                              textAlign: "center",
                              width: 44,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 800,
                                fontSize: 22,
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
                              }}
                            >
                              {MOIS[d.getMonth()]}
                            </p>
                          </div>

                          <div
                            style={{
                              width: 1,
                              height: 40,
                              background: "#f1f5f9",
                              flexShrink: 0,
                              marginTop: 4,
                            }}
                          />

                          {/* Contenu */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 5,
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  padding: "2px 10px",
                                  borderRadius: 999,
                                  background: conf.bg,
                                  color: conf.color,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  fontFamily: "var(--font-head)",
                                }}
                              >
                                {ev.type}
                              </span>
                              {ev.cycle !== "tous" && (
                                <span
                                  style={{
                                    padding: "2px 8px",
                                    borderRadius: 999,
                                    background: "#f1f5f9",
                                    color: "#475569",
                                    fontSize: 10,
                                    fontWeight: 700,
                                  }}
                                >
                                  {ev.cycle}
                                </span>
                              )}
                              {isToday && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "var(--cyan-dark)",
                                  }}
                                >
                                  · Aujourd'hui
                                </span>
                              )}
                              {isPast && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: "var(--muted)",
                                  }}
                                >
                                  · Passé
                                </span>
                              )}
                            </div>
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#0f172a",
                                marginBottom: ev.description ? 4 : 0,
                              }}
                            >
                              {ev.titre}
                            </p>
                            {ev.date_fin && ev.date_fin !== ev.date_debut && (
                              <p
                                style={{ fontSize: 11, color: "var(--muted)" }}
                              >
                                → {formatDate(ev.date_fin)}
                              </p>
                            )}
                            {!isMobile && ev.description && (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "#64748b",
                                  lineHeight: 1.5,
                                  marginTop: 4,
                                }}
                              >
                                {ev.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══ PROGRAMMES ══ */}
        {tab === "programmes" && (
          <div>
            {/* Sélecteur cycle */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {Object.entries(CYCLE_CONFIG).map(([cycle, conf]) => (
                <div
                  key={cycle}
                  onClick={() => setCycleProg(cycle)}
                  style={{
                    background: cycleProg === cycle ? conf.color : "#fff",
                    border: `2px solid ${cycleProg === cycle ? conf.color : "#e2e8f0"}`,
                    borderRadius: 12,
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all .25s",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (cycleProg !== cycle)
                      e.currentTarget.style.borderColor = conf.color;
                  }}
                  onMouseLeave={(e) => {
                    if (cycleProg !== cycle)
                      e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>
                    {conf.icon}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      fontSize: 16,
                      color: cycleProg === cycle ? "#fff" : "#0f172a",
                      marginBottom: 4,
                    }}
                  >
                    {cycle}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color:
                        cycleProg === cycle
                          ? "rgba(255,255,255,.8)"
                          : "var(--muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {conf.desc}
                  </p>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        cycleProg === cycle
                          ? "rgba(255,255,255,.9)"
                          : conf.color,
                    }}
                  >
                    {programmes.filter((p) => p.cycle === cycle).length}{" "}
                    programme(s)
                  </div>
                </div>
              ))}
            </div>

            {/* Header cycle sélectionné */}
            {cycleProg && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ position: "relative", marginBottom: 24 }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(40px, 8vw, 80px)",
                      fontWeight: 800,
                      color: "#0f172a",
                      opacity: 0.07,
                      letterSpacing: -3,
                      margin: 0,
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {cycleProg}
                  </h2>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: CYCLE_CONFIG[cycleProg]?.color,
                        fontFamily: "var(--font-head)",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 4,
                      }}
                    >
                      Cycle {cycleProg}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {CYCLE_CONFIG[cycleProg]?.desc}
                    </h3>
                  </div>
                </div>

                {/* Conditions admission */}
                <div
                  style={{
                    background: `${CYCLE_CONFIG[cycleProg]?.color}11`,
                    borderRadius: 12,
                    border: `1px solid ${CYCLE_CONFIG[cycleProg]?.color}33`,
                    padding: "14px 18px",
                    marginBottom: 24,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: CYCLE_CONFIG[cycleProg]?.color,
                      fontFamily: "var(--font-head)",
                      marginBottom: 4,
                    }}
                  >
                    CONDITIONS D'ADMISSION
                  </p>
                  <p
                    style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}
                  >
                    {cycleProg === "DUT" &&
                      "Baccalauréat toutes séries · Concours d'entrée · Âge max 29 ans"}
                    {cycleProg === "BTS" &&
                      "Baccalauréat toutes séries · Sélection sur dossier · Campus d'Edéa"}
                    {cycleProg === "LICENCE" &&
                      "DUT, BTS ou Bac+2 équivalent · Profil conforme à l'option choisie · 2 530 places en 2026-2027"}
                    {cycleProg === "MASTER" &&
                      "Licence toutes séries · Sélection sur dossier · Voir spécialités ouvertes"}
                  </p>
                  <a
                    href="https://www.iut-dla.cm"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: CYCLE_CONFIG[cycleProg]?.color,
                      textDecoration: "none",
                      fontFamily: "var(--font-head)",
                    }}
                  >
                    S'inscrire sur iut-dla.cm <MdOpenInNew size={14} />
                  </a>
                </div>

                {/* Liste des programmes */}
                {progsCycle.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: "var(--muted)",
                      background: "#f8fafc",
                      borderRadius: 12,
                      border: "1px dashed var(--border)",
                    }}
                  >
                    <MdSchool
                      size={36}
                      style={{ opacity: 0.2, marginBottom: 10 }}
                    />
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 600,
                      }}
                    >
                      Aucun programme pour ce cycle
                    </p>
                    <p style={{ fontSize: 12, marginTop: 6 }}>
                      L'administration les ajoutera bientôt.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Grouper par département si disponible */}
                    {(() => {
                      const byDept = progsCycle.reduce((acc, p) => {
                        const dept = p.departement || "Autres";
                        if (!acc[dept]) acc[dept] = [];
                        acc[dept].push(p);
                        return acc;
                      }, {});

                      return Object.entries(byDept).map(([dept, progs]) => (
                        <div key={dept} style={{ marginBottom: 24 }}>
                          {Object.keys(byDept).length > 1 && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 12,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: CYCLE_CONFIG[cycleProg]?.color,
                                  fontFamily: "var(--font-head)",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                }}
                              >
                                {dept}
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  height: 1,
                                  background: "#f1f5f9",
                                }}
                              />
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            {progs.map((p, i) => (
                              <div
                                key={p.id_programme}
                                style={{
                                  background: "#fff",
                                  border: "1px solid #e2e8f0",
                                  borderTop: i === 0 ? undefined : "none",
                                  borderRadius:
                                    i === 0
                                      ? "12px 12px 0 0"
                                      : i === progs.length - 1
                                        ? "0 0 12px 12px"
                                        : 0,
                                  padding: "16px 20px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 16,
                                  transition: "all .2s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "#f0fdfe")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = "#fff")
                                }
                              >
                                {/* Barre couleur */}
                                <div
                                  style={{
                                    width: 4,
                                    height: 48,
                                    borderRadius: 2,
                                    background: CYCLE_CONFIG[cycleProg]?.color,
                                    flexShrink: 0,
                                  }}
                                />

                                {/* Infos */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p
                                    style={{
                                      fontFamily: "var(--font-head)",
                                      fontWeight: 700,
                                      fontSize: "clamp(13px, 2vw, 15px)",
                                      color: "#0f172a",
                                      marginBottom: 4,
                                    }}
                                  >
                                    {p.nom}
                                  </p>
                                  {p.description && (
                                    <p
                                      style={{
                                        fontSize: 12,
                                        color: "#64748b",
                                        lineHeight: 1.5,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {p.description}
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    flexShrink: 0,
                                    flexWrap: "wrap",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {p.lien_cours && (
                                    <a
                                      href={p.lien_cours}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        background: "#d1fae5",
                                        color: "#065f46",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        fontFamily: "var(--font-head)",
                                        textDecoration: "none",
                                        transition: "all .2s",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                          "#a7f3d0")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                          "#d1fae5")
                                      }
                                    >
                                      <MdDownload size={14} /> Cours
                                    </a>
                                  )}
                                  {p.lien_externe && (
                                    <a
                                      href={p.lien_externe}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        background: "#ede9fe",
                                        color: "#5b21b6",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        fontFamily: "var(--font-head)",
                                        textDecoration: "none",
                                        transition: "all .2s",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                          "#ddd6fe")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                          "#ede9fe")
                                      }
                                    >
                                      <MdOpenInNew size={14} /> Site
                                    </a>
                                  )}
                                  {!p.lien_cours && !p.lien_externe && (
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: "var(--muted)",
                                        fontStyle: "italic",
                                      }}
                                    >
                                      Bientôt disponible
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
