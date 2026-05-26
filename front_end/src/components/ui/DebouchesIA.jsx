import { useState } from "react";
import {
  MdAutoAwesome,
  MdWork,
  MdSchool,
  MdTrendingUp,
  MdRefresh,
  MdExpandMore,
  MdExpandLess,
  MdStar,
  MdBusinessCenter,
  MdLightbulb,
  MdApartment,
  MdSafetyCheck,
  MdGraphicEq,
  MdBadge,
} from "react-icons/md";
import { getDebouches } from "../../services/iaService";

const NIVEAU_COLORS = {
  Débutant: { bg: "#d1fae5", color: "#065f46" },
  Confirmé: { bg: "#fef3c7", color: "#92400e" },
  Senior: { bg: "#fee2e2", color: "#991b1b" },
};

export default function DebouchesIA({ filiere }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (i) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  const fetchDebouches = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    const prompt = `Tu es un expert en orientation professionnelle et académique au Cameroun.
Pour la filière "${filiere.nom}" de l'IUT de Douala, durée: ${filiere.duree || "non précisée"}.
${filiere.description ? `Description: ${filiere.description}` : ""}

Génère une analyse complète des débouchés professionnels en JSON UNIQUEMENT (aucun texte avant ou après, aucun markdown):
{
  "resume": "Une phrase percutante résumant les perspectives de cette filière",
  "salaire_debutant": "Fourchette salariale débutant au Cameroun en FCFA",
  "salaire_experimente": "Fourchette salariale expérimenté au Cameroun en FCFA",
  "taux_emploi": "Pourcentage estimé de diplômés employés dans les 6 mois",
  "metiers": [
    {
      "titre": "Nom du métier",
      "description": "Description courte du métier (2-3 phrases)",
      "entreprises": ["Entreprise 1", "Entreprise 2"],
      "competences": ["compétence 1", "compétence 2", "compétence 3"],
      "niveau": "Débutant"
    }
  ],
  "secteurs": [
    { "nom": "Nom du secteur", "description": "Description courte" }
  ],
  "poursuites_etudes": [
    { "diplome": "Nom du diplôme", "etablissement": "Établissement" }
  ],
  "conseil": "Un conseil personnalisé pour les étudiants de cette filière"
}`;

    try {
      const json = await getDebouches(prompt);
      const text = json.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setData(JSON.parse(clean));
    } catch (err) {
      console.error(err);
      const adminDetail = err.response?.data?.detail;
      setError(
        adminDetail
          ? `Impossible de charger les débouchés. Détail admin : ${adminDetail}`
          : "Impossible de charger les débouchés. Réessayez dans quelques instants.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* HEADER */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 60%, #0e5f75 100%)",
          borderRadius: 20,
          padding: "clamp(24px, 4vw, 36px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            background: "rgba(6,182,212,.1)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "rgba(6,182,212,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdAutoAwesome size={24} color="var(--cyan)" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--cyan)",
                  fontFamily: "var(--font-head)",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                Propulsé par AI
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(16px, 3vw, 20px)",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                Débouchés professionnels
              </h3>
            </div>
          </div>

          <p
            style={{
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.7,
              marginBottom: 20,
              maxWidth: 500,
            }}
          >
            Métiers, secteurs et salaires pour la filière
            <span style={{ color: "var(--cyan)", fontWeight: 600 }}>
              {" "}
              {filiere.nom}
            </span>
            , analysés par intelligence artificielle selon le marché
            camerounais.
          </p>

          {!data && !loading && (
            <button
              onClick={fetchDebouches}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "var(--cyan)",
                color: "var(--cyan-text)",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cyan-dark)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--cyan)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <MdAutoAwesome size={18} /> Analyser avec l'IA
            </button>
          )}

          {data && !loading && (
            <button
              onClick={fetchDebouches}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: "rgba(255,255,255,.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 8,
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <MdRefresh size={15} /> Actualiser
            </button>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid var(--border)",
            padding: 40,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 60,
              height: 60,
              margin: "0 auto 20px",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdAutoAwesome size={20} color="var(--cyan)" />
            </div>
          </div>
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 15,
              color: "#0f172a",
              marginBottom: 6,
            }}
          >
            L'IA analyse les débouchés...
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Génération en cours pour <strong>{filiere.nom}</strong>
          </p>
          <div
            style={{
              marginTop: 20,
              height: 4,
              background: "#f1f5f9",
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: 300,
              margin: "20px auto 0",
            }}
          >
            <div
              style={{
                height: "100%",
                background:
                  "linear-gradient(90deg, var(--cyan-light), var(--cyan))",
                borderRadius: 2,
                animation: "progress 2s ease-in-out infinite",
                width: "60%",
              }}
            />
          </div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg) } }
            @keyframes progress { 0% { transform: translateX(-100%) } 100% { transform: translateX(250%) } }
          `}</style>
        </div>
      )}

      {/* ERREUR */}
      {error && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #fca5a5",
            padding: 24,
            marginTop: 16,
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MdAutoAwesome size={22} color="#dc2626" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              Erreur de génération
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>{error}</p>
          </div>
          <button
            onClick={fetchDebouches}
            style={{
              padding: "8px 16px",
              background: "var(--cyan)",
              color: "var(--cyan-text)",
              border: "none",
              borderRadius: 8,
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* RÉSULTATS */}
      {data && !loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 16,
          }}
        >
          {/* Résumé + Stats */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid var(--border)",
              padding: "clamp(20px, 4vw, 28px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdLightbulb size={20} color="var(--cyan-dark)" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--cyan)",
                    fontFamily: "var(--font-head)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 6,
                  }}
                >
                  Analyse IA
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text)",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  "{data.resume}"
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Salaire débutant",
                  value: data.salaire_debutant,
                  emoji: <MdBadge />,
                  bg: "#d1fae5",
                  color: "#065f46",
                },
                {
                  label: "Salaire expérimenté",
                  value: data.salaire_experimente,
                  emoji: <MdGraphicEq />,
                  bg: "#cffafe",
                  color: "#0e7490",
                },
                {
                  label: "Taux d'emploi",
                  value: data.taux_emploi,
                  emoji: <MdSafetyCheck />,
                  bg: "#fef3c7",
                  color: "#92400e",
                },
              ]
                .filter((s) => s.value)
                .map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: stat.bg,
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{stat.emoji}</span>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 800,
                        fontSize: "clamp(12px, 2vw, 14px)",
                        color: stat.color,
                        lineHeight: 1.3,
                        marginTop: 6,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: stat.color,
                        opacity: 0.7,
                        fontWeight: 500,
                        marginTop: 4,
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Métiers */}
          {data.metiers?.length > 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "clamp(20px, 4vw, 28px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#ede9fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MdWork size={19} color="#5b21b6" />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#0f172a",
                    flex: 1,
                  }}
                >
                  Métiers accessibles
                </p>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "#ede9fe",
                    color: "#5b21b6",
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {data.metiers.length}
                </span>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {data.metiers.map((metier, i) => {
                  const niv =
                    NIVEAU_COLORS[metier.niveau] || NIVEAU_COLORS["Débutant"];
                  return (
                    <div
                      key={i}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onClick={() => toggleExpand(i)}
                        style={{
                          padding: "14px 18px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: expanded[i] ? "#fafafa" : "#fff",
                          transition: "background .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = expanded[i]
                            ? "#fafafa"
                            : "#fff")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 9,
                              background: "#ede9fe",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <MdBusinessCenter size={18} color="#5b21b6" />
                          </div>
                          <div>
                            <p
                              style={{
                                fontFamily: "var(--font-head)",
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#0f172a",
                                marginBottom: 3,
                              }}
                            >
                              {metier.titre}
                            </p>
                            {metier.niveau && (
                              <span
                                style={{
                                  padding: "2px 9px",
                                  borderRadius: 999,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  fontFamily: "var(--font-head)",
                                  background: niv.bg,
                                  color: niv.color,
                                }}
                              >
                                {metier.niveau}
                              </span>
                            )}
                          </div>
                        </div>
                        {expanded[i] ? (
                          <MdExpandLess size={20} color="var(--muted)" />
                        ) : (
                          <MdExpandMore size={20} color="var(--muted)" />
                        )}
                      </div>

                      {expanded[i] && (
                        <div
                          style={{
                            padding: "16px 18px",
                            borderTop: "1px solid #f1f5f9",
                            background: "#fafafa",
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--text)",
                              lineHeight: 1.7,
                            }}
                          >
                            {metier.description}
                          </p>

                          {metier.competences?.length > 0 && (
                            <div>
                              <p
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "var(--subtle)",
                                  fontFamily: "var(--font-head)",
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                  marginBottom: 8,
                                }}
                              >
                                Compétences requises
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                {metier.competences.map((c, j) => (
                                  <span
                                    key={j}
                                    style={{
                                      padding: "4px 12px",
                                      borderRadius: 999,
                                      background: "#ede9fe",
                                      color: "#5b21b6",
                                      fontSize: 11,
                                      fontWeight: 600,
                                      fontFamily: "var(--font-head)",
                                    }}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {metier.entreprises?.length > 0 && (
                            <div>
                              <p
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "var(--subtle)",
                                  fontFamily: "var(--font-head)",
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                  marginBottom: 8,
                                }}
                              >
                                Exemples d'employeurs
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                {metier.entreprises.map((e, j) => (
                                  <span
                                    key={j}
                                    style={{
                                      padding: "4px 12px",
                                      borderRadius: 999,
                                      background: "var(--cyan-light)",
                                      color: "var(--cyan-dark)",
                                      fontSize: 11,
                                      fontWeight: 600,
                                      fontFamily: "var(--font-head)",
                                    }}
                                  >
                                    <MdApartment /> {e}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secteurs + Poursuites */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {data.secteurs?.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  padding: "clamp(20px, 4vw, 24px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: "#cffafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdTrendingUp size={18} color="var(--cyan-dark)" />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0f172a",
                    }}
                  >
                    Secteurs porteurs
                  </p>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {data.secteurs.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px",
                        background: "#f8fafc",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <MdStar size={14} color="var(--cyan)" />
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#0f172a",
                          }}
                        >
                          {s.nom}
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.poursuites_etudes?.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  padding: "clamp(20px, 4vw, 24px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: "#d1fae5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdSchool size={18} color="#065f46" />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0f172a",
                    }}
                  >
                    Poursuites d'études
                  </p>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {data.poursuites_etudes.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px",
                        background: "#f0fdf4",
                        borderRadius: 10,
                        border: "1px solid #bbf7d0",
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: "#d1fae5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <MdSchool size={15} color="#065f46" />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#0f172a",
                            marginBottom: 2,
                          }}
                        >
                          {p.diplome}
                        </p>
                        <p style={{ fontSize: 11, color: "#065f46" }}>
                          {p.etablissement}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conseil */}
          {data.conseil && (
            <div
              style={{
                background: "linear-gradient(135deg, #0c1a40, #0e5f75)",
                borderRadius: 16,
                padding: "clamp(20px, 4vw, 28px)",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(6,182,212,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdAutoAwesome size={22} color="var(--cyan)" />
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
                    marginBottom: 8,
                  }}
                >
                  Conseil de l'IA
                </p>
                <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                  {data.conseil}
                </p>
              </div>
            </div>
          )}

          <p
            style={{
              fontSize: 11,
              color: "var(--subtle)",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            ✨ Analyse générée par Claude AI — Données indicatives basées sur le
            marché camerounais.
          </p>
        </div>
      )}
    </div>
  );
}
