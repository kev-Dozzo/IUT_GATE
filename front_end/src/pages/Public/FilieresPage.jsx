import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdClose,
  MdSchool,
  MdAccessTime,
  MdPeople,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getFilieres } from "../../services/filiereService";
import SEO from "../../components/ui/SEO";

const BASE_URL = "http://localhost:5000";
const DEFAULT_PHOTO = "/noprofil.jpg";

export default function FilieresPage() {
  const navigate = useNavigate();
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getFilieres()
      .then((data) => setFilieres(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filieres.filter(
    (f) =>
      f.nom?.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <SEO
        title="Filières"
        description="Découvrez toutes les formations et filières de l'IUT de Douala : Génie Informatique, Réseaux, Génie Civil et plus."
        url="https://iutgate.vercel.app/filieres"
      />
      <Navbar />

      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0c1a40 0%, #0e3460 40%, #0e5f75 100%)",
          padding: "clamp(32px, 6vw, 56px) 24px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
            Formations
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Nos Filières
          </h1>
          <p style={{ color: "#7dd3fc", fontSize: 14, marginBottom: 28 }}>
            Découvrez toutes les formations disponibles à l'IUT de Douala.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,.95)",
              borderRadius: 10,
              padding: "10px 16px",
              maxWidth: 480,
              boxShadow: "0 4px 24px rgba(0,0,0,.2)",
            }}
          >
            <MdSearch
              size={18}
              style={{ color: "var(--subtle)", flexShrink: 0 }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une filière..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                background: "transparent",
                color: "var(--text)",
              }}
            />
            {search && (
              <MdClose
                size={16}
                style={{ color: "var(--subtle)", cursor: "pointer" }}
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </div>
      </section>

      <section className="page-container">
        {!loading && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {filtered.length} filière{filtered.length > 1 ? "s" : ""} trouvée
            {filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--muted)",
            }}
          >
            <MdSchool size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aucune filière trouvée
            </p>
          </div>
        )}

        <div className="grid-auto">
          {!loading &&
            filtered.map((f) => {
              const photoSrc = f.photo_url ? `${BASE_URL}${f.photo_url}` : null;

              return (
                <div
                  key={f.id_filiere}
                  onClick={() => navigate(`/filieres/${f.id_filiere}`)}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,.06)",
                    transition: "all .25s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 40px rgba(6,182,212,.15)";
                    e.currentTarget.style.borderColor = "var(--cyan)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,.06)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {/* ── PHOTO EN HAUT ── */}
                  <div
                    style={{
                      position: "relative",
                      height: 180,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={f.nom}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.style.background =
                            "linear-gradient(135deg, #0c1a40, #0e5f75)";
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #0c1a40, #0e5f75)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdSchool size={52} color="rgba(6,182,212,.4)" />
                      </div>
                    )}
                    {/* Gradient bas */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 80,
                        background:
                          "linear-gradient(to bottom, transparent, rgba(12,26,64,.8))",
                      }}
                    />

                    {/* Badge durée */}
                    {f.duree && (
                      <div style={{ position: "absolute", top: 12, right: 12 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "rgba(6,182,212,.9)",
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "var(--font-head)",
                            color: "#fff",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <MdAccessTime size={11} /> {f.duree}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── INFOS ── */}
                  <div
                    style={{
                      padding: "18px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-head)",
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#0f172a",
                        lineHeight: 1.3,
                      }}
                    >
                      {f.nom}
                    </h3>

                    {f.description && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--muted)",
                          lineHeight: 1.6,
                          flex: 1,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {f.description}
                      </p>
                    )}

                    {/* Infos bas de card */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 10,
                        borderTop: "1px solid #f1f5f9",
                        marginTop: 4,
                      }}
                    >
                      <div style={{ display: "flex", gap: 12 }}>
                        {f.places && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <MdPeople size={13} color="var(--subtle)" />
                            <span
                              style={{ fontSize: 11, color: "var(--muted)" }}
                            >
                              {f.places} places
                            </span>
                          </div>
                        )}
                        {f.departement?.nom && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <MdSchool size={13} color="var(--subtle)" />
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 120,
                              }}
                            >
                              {f.departement.nom}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "var(--cyan)",
                          fontWeight: 700,
                          fontFamily: "var(--font-head)",
                        }}
                      >
                        Détails <MdArrowForward size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <Footer />
    </div>
  );
}
