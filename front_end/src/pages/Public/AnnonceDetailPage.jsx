// src/pages/Public/AnnonceDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdCalendarToday,
  MdCampaign,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getAnnonceById, getAnnonces } from "../../services/annonceService";

const catColors = {
  Examens: { bg: "#fee2e2", color: "#991b1b" },
  Événement: { bg: "#cffafe", color: "#164e63" },
  Infrastructure: { bg: "#dbeafe", color: "#1e40af" },
  Administration: { bg: "#dbeafe", color: "#1e40af" },
  Stage: { bg: "#d1fae5", color: "#065f46" },
  Général: { bg: "#f1f5f9", color: "#475569" },
};

export default function AnnonceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [autres, setAutres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAnnonceById(id), getAnnonces()])
      .then(([ann, all]) => {
        setAnnonce(ann);
        setAutres(all.filter((a) => a.id_annonce !== parseInt(id)).slice(0, 3));
      })
      .catch(() => setError("Annonce introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 48px) 24px",
        }}
      >
        {/* Retour */}
        <button
          onClick={() => navigate("/annonces")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--cyan)",
            fontFamily: "var(--font-head)",
            fontWeight: 600,
            fontSize: 13,
            marginBottom: 28,
            padding: 0,
          }}
        >
          <MdArrowBack size={16} /> Retour aux annonces
        </button>

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
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

        {error && (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              padding: "60px 0",
            }}
          >
            {error}
          </p>
        )}

        {!loading && annonce && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {/* Article principal */}
            <div style={{ gridColumn: "span 2" }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                {/* Photo si existe */}
                {annonce.photo_url && (
                  <img
                    src={`http://localhost:5000${annonce.photo_url}`}
                    alt={annonce.titre}
                    style={{ width: "100%", height: 280, objectFit: "cover" }}
                  />
                )}

                {/* Bande couleur catégorie */}
                <div
                  style={{
                    height: 5,
                    background: (
                      catColors[annonce.categorie] || catColors["Général"]
                    ).color,
                  }}
                />

                <div style={{ padding: "clamp(20px, 4vw, 36px)" }}>
                  {/* Meta */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 14px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: (
                          catColors[annonce.categorie] || catColors["Général"]
                        ).bg,
                        color: (
                          catColors[annonce.categorie] || catColors["Général"]
                        ).color,
                      }}
                    >
                      {annonce.categorie || "Général"}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "var(--muted)",
                        fontSize: 12,
                      }}
                    >
                      <MdCalendarToday size={13} />
                      {annonce.date_publication
                        ? formatDate(annonce.date_publication)
                        : ""}
                    </div>
                  </div>

                  {/* Titre */}
                  <h1
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(22px, 4vw, 32px)",
                      fontWeight: 800,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      marginBottom: 24,
                      letterSpacing: -0.5,
                    }}
                  >
                    {annonce.titre}
                  </h1>

                  <div
                    style={{
                      height: 1,
                      background: "#f1f5f9",
                      marginBottom: 24,
                    }}
                  />

                  {/* Contenu */}
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text)",
                      lineHeight: 1.9,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {annonce.contenu}
                  </p>

                  {/* Footer */}
                  <div
                    style={{
                      marginTop: 32,
                      padding: "16px 20px",
                      background: "#f8fafc",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <MdCampaign size={18} color="var(--cyan-dark)" />
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      Annonce publiée par l'administration de l'IUT de Douala
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Autres annonces */}
            {autres.length > 0 && (
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#0f172a",
                    marginBottom: 16,
                  }}
                >
                  Autres annonces
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {autres.map((a) => {
                    const cat = catColors[a.categorie] || catColors["Général"];
                    return (
                      <div
                        key={a.id_annonce}
                        onClick={() => navigate(`/annonces/${a.id_annonce}`)}
                        style={{
                          background: "#fff",
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          padding: "16px",
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--cyan)";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              padding: "2px 9px",
                              borderRadius: 999,
                              fontSize: 10,
                              fontWeight: 700,
                              fontFamily: "var(--font-head)",
                              background: cat.bg,
                              color: cat.color,
                            }}
                          >
                            {a.categorie || "Général"}
                          </span>
                          <MdArrowForward size={14} color="var(--cyan)" />
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-head)",
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--text)",
                            lineHeight: 1.4,
                            marginBottom: 6,
                          }}
                        >
                          {a.titre}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--subtle)" }}>
                          {a.date_publication
                            ? new Date(a.date_publication).toLocaleDateString(
                                "fr-FR",
                              )
                            : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate("/annonces")}
                  style={{
                    marginTop: 16,
                    width: "100%",
                    padding: "11px",
                    background: "transparent",
                    color: "var(--blue)",
                    border: "1.5px solid var(--blue)",
                    borderRadius: 10,
                    fontFamily: "var(--font-head)",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Voir toutes les annonces
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
