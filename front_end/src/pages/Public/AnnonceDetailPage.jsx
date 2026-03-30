import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdCalendarToday, MdCampaign } from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getAnnonceById } from "../../services/annonceService";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnnonceById(id)
      .then((data) => setAnnonce(data))
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
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 32px" }}>
        <button
          onClick={() => navigate("/actualites")}
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
              color: "var(--muted)",
              textAlign: "center",
              padding: "60px 0",
            }}
          >
            {error}
          </p>
        )}

        {!loading &&
          annonce &&
          (() => {
            const cat = catColors[annonce.categorie] || catColors["Général"];
            return (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                {/* Bande couleur catégorie */}
                <div style={{ height: 6, background: cat.color }} />

                <div style={{ padding: "36px" }}>
                  {/* Meta */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                        background: cat.bg,
                        color: cat.color,
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
                      fontSize: 28,
                      fontWeight: 800,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      marginBottom: 28,
                      letterSpacing: -0.5,
                    }}
                  >
                    {annonce.titre}
                  </h1>

                  {/* Séparateur */}
                  <div
                    style={{
                      height: 1,
                      background: "#f1f5f9",
                      marginBottom: 28,
                    }}
                  />

                  {/* Contenu */}
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text)",
                      lineHeight: 1.9,
                    }}
                  >
                    {annonce.contenu}
                  </p>

                  {/* Footer card */}
                  <div
                    style={{
                      marginTop: 36,
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
                      Annonce publiée par l'administration de l'IUT
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
      <Footer />
    </div>
  );
}
