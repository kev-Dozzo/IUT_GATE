import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdSchool,
  MdPeople,
  MdAccountBalance,
  MdCampaign,
  MdLocationOn,
  MdMap,
  MdHelp,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdArrowForward,
  MdEmail,
  MdPhone,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const FAQ = [
  {
    question: "Comment trouver un enseignant ?",
    reponse:
      'Allez dans la section "Enseignants" depuis le menu de navigation. Vous pouvez rechercher par nom ou filtrer par département. Cliquez sur un enseignant pour voir son profil complet avec ses coordonnées et son bureau.',
    categorie: "Navigation",
  },
  {
    question: "Comment consulter les filières disponibles ?",
    reponse:
      'Cliquez sur "Filières" dans le menu. Vous verrez toutes les formations disponibles avec leur durée, nombre de places et conditions d\'admission. Cliquez sur une filière pour voir les détails complets.',
    categorie: "Navigation",
  },
  {
    question: "Comment localiser un bâtiment ou une salle ?",
    reponse:
      'Utilisez la page "Carte" accessible depuis le menu. Vous y trouverez une carte interactive du campus avec tous les bâtiments. Cliquez sur un bâtiment pour voir sa position et obtenir un itinéraire depuis votre position.',
    categorie: "Carte",
  },
  {
    question: "Comment obtenir un itinéraire vers un bureau ?",
    reponse:
      "Sur la page de détail d'un enseignant ou d'un service, vous trouverez un bouton \"Itinéraire\" qui ouvre Google Maps avec la direction vers le bâtiment concerné.",
    categorie: "Carte",
  },
  {
    question: "Comment contacter un service administratif ?",
    reponse:
      'Allez dans "Services" pour voir tous les services disponibles. Chaque service affiche son email de contact, son bâtiment et sa description. Cliquez sur un service pour les détails complets.',
    categorie: "Contact",
  },
  {
    question: "Comment utiliser la recherche globale ?",
    reponse:
      "La barre de recherche sur la page d'accueil vous permet de chercher dans toutes les sections : enseignants, filières, services et actualités. Des suggestions apparaissent automatiquement en tapant.",
    categorie: "Navigation",
  },
  {
    question: "Les informations sont-elles à jour ?",
    reponse:
      "Oui, toutes les informations sont gérées directement par l'administration de l'IUT via le tableau de bord administrateur. Les mises à jour sont effectuées en temps réel.",
    categorie: "Général",
  },
  {
    question: "Que faire si une information est incorrecte ?",
    reponse:
      "Contactez directement le service concerné ou l'administration de l'IUT par email à contact@iut-douala.cm. L'équipe mettra à jour les informations dans les plus brefs délais.",
    categorie: "Général",
  },
  {
    question: "Le site fonctionne-t-il sur mobile ?",
    reponse:
      "Oui ! IUTGate est entièrement responsive et fonctionne sur tous les appareils : smartphones, tablettes et ordinateurs.",
    categorie: "Général",
  },
];

const GUIDES = [
  {
    icon: MdSearch,
    titre: "Rechercher",
    description:
      "Utilisez la barre de recherche pour trouver rapidement enseignants, filières et services.",
    bg: "#cffafe",
    color: "#0e7490",
    etapes: [
      "Tapez votre recherche dans la barre en haut de la page d'accueil",
      "Des suggestions apparaissent automatiquement",
      "Cliquez sur un résultat pour accéder directement à la page",
    ],
  },
  {
    icon: MdSchool,
    titre: "Trouver une filière",
    description: "Explorez toutes les formations disponibles à l'IUT.",
    bg: "#d1fae5",
    color: "#065f46",
    etapes: [
      'Cliquez sur "Filières" dans le menu de navigation',
      "Consultez les formations disponibles",
      "Cliquez sur une filière pour voir les détails et les débouchés",
    ],
  },
  {
    icon: MdPeople,
    titre: "Contacter un enseignant",
    description:
      "Trouvez les coordonnées de n'importe quel membre du corps enseignant.",
    bg: "#fef3c7",
    color: "#92400e",
    etapes: [
      'Allez dans "Enseignants" depuis le menu',
      "Recherchez par nom ou filtrez par département",
      "Cliquez sur le profil pour voir email, téléphone et bureau",
    ],
  },
  {
    icon: MdMap,
    titre: "Naviguer sur le campus",
    description:
      "Localisez n'importe quel bâtiment ou bureau sur la carte interactive.",
    bg: "#ede9fe",
    color: "#5b21b6",
    etapes: [
      'Cliquez sur "Carte" dans le menu',
      "Sélectionnez un bâtiment dans la liste à gauche",
      'Cliquez sur "Itinéraire" pour ouvrir Google Maps',
    ],
  },
];

const CATEGORIES_FAQ = [
  "Tous",
  "Navigation",
  "Carte",
  "Contact",
  "Général",
  "Admin",
];

export default function AidePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [searchFaq, setSearchFaq] = useState("");
  const [categorie, setCategorie] = useState("Tous");

  const filteredFaq = FAQ.filter((f) => {
    const matchSearch =
      f.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.reponse.toLowerCase().includes(searchFaq.toLowerCase());
    const matchCat = categorie === "Tous" || f.categorie === categorie;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(40px, 8vw, 72px) 24px",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(6,182,212,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <MdHelp size={32} color="var(--cyan)" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(26px, 5vw, 44px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -1,
              marginBottom: 14,
            }}
          >
            Centre d'aide <span style={{ color: "var(--cyan)" }}>IUTGate</span>
          </h1>
          <p
            style={{
              color: "#7dd3fc",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Tout ce dont vous avez besoin pour utiliser le portail numérique de
            l'IUT de Douala.
          </p>

          {/* Search FAQ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,.95)",
              borderRadius: 12,
              padding: "12px 18px",
              maxWidth: 480,
              margin: "0 auto",
              boxShadow: "0 4px 24px rgba(0,0,0,.2)",
            }}
          >
            <MdSearch size={18} style={{ color: "#94a3b8" }} />
            <input
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Rechercher dans l'aide..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                background: "transparent",
                color: "var(--text)",
              }}
            />
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* ── GUIDES RAPIDES ── */}
        <section style={{ marginBottom: 64 }}>
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
              Démarrage rapide
            </p>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Comment utiliser IUTGate ?
            </h2>
          </div>

          <div className="grid-4">
            {GUIDES.map(
              ({ icon: Icon, titre, description, bg, color, etapes }) => (
                <div
                  key={titre}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${bg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 13,
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} color={color}  />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#0f172a",
                        marginBottom: 6,
                      }}
                    >
                      {titre}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {description}
                    </p>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {etapes.map((etape, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color,
                              fontFamily: "var(--font-head)",
                            }}
                          >
                            {i + 1}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            lineHeight: 1.5,
                          }}
                        >
                          {etape}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ marginBottom: 64 }}>
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
              FAQ
            </p>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 8,
              }}
            >
              Questions fréquentes
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              {filteredFaq.length} question{filteredFaq.length > 1 ? "s" : ""}{" "}
              trouvée{filteredFaq.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Filtres catégories */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {CATEGORIES_FAQ.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategorie(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1.5px solid ${categorie === cat ? "var(--cyan)" : "var(--border)"}`,
                  background: categorie === cat ? "var(--cyan)" : "#fff",
                  color:
                    categorie === cat ? "var(--cyan-text)" : "var(--muted)",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredFaq.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--muted)",
                }}
              >
                <MdHelp size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                  Aucune question trouvée
                </p>
              </div>
            )}
            {filteredFaq.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: `1px solid ${openFaq === i ? "var(--cyan)" : "var(--border)"}`,
                  overflow: "hidden",
                  transition: "all .2s",
                }}
              >
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    padding: "18px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        padding: "2px 9px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: "var(--cyan-light)",
                        color: "var(--cyan-dark)",
                        flexShrink: 0,
                      }}
                    >
                      {faq.categorie}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#0f172a",
                      }}
                    >
                      {faq.question}
                    </p>
                  </div>
                  {openFaq === i ? (
                    <MdKeyboardArrowUp
                      size={22}
                      color="var(--cyan)"
                      style={{ flexShrink: 0 }}
                    />
                  ) : (
                    <MdKeyboardArrowDown
                      size={22}
                      color="var(--muted)"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </div>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 20px 20px",
                      borderTop: "1px solid var(--cyan-light)",
                      paddingTop: 14,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text)",
                        lineHeight: 1.8,
                      }}
                    >
                      {faq.reponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── LIENS RAPIDES ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 24 }}>
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
              Accès rapide
            </p>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Aller directement à
            </h2>
          </div>

          <div className="grid-3">
            {[
              {
                icon: MdSchool,
                label: "Nos Filières",
                desc: "Explorer les formations",
                path: "/filieres",
                bg: "#cffafe",
                color: "#0e7490",
              },
              {
                icon: MdPeople,
                label: "Enseignants",
                desc: "Trouver un enseignant",
                path: "/enseignants",
                bg: "#d1fae5",
                color: "#065f46",
              },
              {
                icon: MdAccountBalance,
                label: "Départements",
                desc: "Voir les départements",
                path: "/departements",
                bg: "#fef3c7",
                color: "#92400e",
              },
              {
                icon: MdCampaign,
                label: "Actualités",
                desc: "Toutes les actualités",
                path: "/actualites",
                bg: "#fee2e2",
                color: "#991b1b",
              },
              {
                icon: MdLocationOn,
                label: "Services",
                desc: "Services administratifs",
                path: "/services",
                bg: "#ede9fe",
                color: "#5b21b6",
              },
              {
                icon: MdMap,
                label: "Carte du campus",
                desc: "Naviguer sur le campus",
                path: "/carte",
                bg: "#dbeafe",
                color: "#1e40af",
              },
            ].map(({ icon: Icon, label, desc, path, bg, color }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.background = bg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#0f172a",
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{desc}</p>
                </div>
                <MdArrowForward size={16} color="var(--cyan)" />
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT SUPPORT ── */}
        <section>
          <div
            style={{
              background: "var(--navy)",
              borderRadius: 20,
              padding: "clamp(24px, 4vw, 40px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 24,
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
                  marginBottom: 8,
                }}
              >
                Besoin d'aide supplémentaire ?
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(18px, 3vw, 24px)",
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Contactez l'administration
              </h3>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
                Si vous ne trouvez pas la réponse à votre question, notre équipe
                est disponible pour vous aider.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="mailto:contact@iut-douala.cm"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 20px",
                  background: "var(--cyan)",
                  color: "var(--cyan-text)",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--cyan-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--cyan)")
                }
              >
                <MdEmail size={16} /> Envoyer un email
              </a>
              <a
                href="tel:+237233406500"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 20px",
                  background: "rgba(255,255,255,.1)",
                  color: "#fff",
                  borderRadius: 10,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all .2s",
                  border: "1px solid rgba(255,255,255,.2)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,.1)")
                }
              >
                <MdPhone size={16} /> +237 233 40 65 00
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
