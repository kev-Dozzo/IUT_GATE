import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdClose,
  MdAccountBalance,
  MdPeople,
  MdSchool,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getDepartements } from "../../services/departementService";
import SEO from "../../components/ui/SEO";
import { BASE_URL } from "../../config/constants";

export default function DepartementsPage() {
  const navigate = useNavigate();
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDepartements()
      .then((data) => setDepartements(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = departements.filter(
    (d) =>
      d.nom?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <SEO
        title="Départements"
        description="Les départements académiques de l'IUT de Douala."
        url="https://iutgate.vercel.app/departements"
      />

      <Navbar />

      {/* HERO ÉPURÉ */}
      <section
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "clamp(32px, 5vw, 56px) 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cyan)",
                fontFamily: "var(--font-head)",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              Structure académique
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(26px, 4vw, 38px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: -0.8,
                  marginBottom: 8,
                }}
              >
                Départements
              </h1>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                {!loading &&
                  `${filtered.length} département${filtered.length > 1 ? "s" : ""}`}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "10px 16px",
                minWidth: 260,
              }}
            >
              <MdSearch
                size={17}
                style={{ color: "var(--subtle)", flexShrink: 0 }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un département..."
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
                  size={15}
                  style={{ color: "var(--subtle)", cursor: "pointer" }}
                  onClick={() => setSearch("")}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 48px) 24px",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 36,
                height: 36,
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
            <MdAccountBalance
              size={48}
              style={{ opacity: 0.2, marginBottom: 16 }}
            />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucun département trouvé
            </p>
          </div>
        )}

        {/* LISTE STYLE uliege.be */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {!loading &&
            filtered.map((dept, i) => {
              const logoSrc = dept.photo_url
                ? `${BASE_URL}${dept.photo_url}`
                : null;
              const isFirst = i === 0;
              const isLast = i === filtered.length - 1;

              return (
                <div
                  key={dept.id_departement}
                  onClick={() =>
                    navigate(`/departements/${dept.id_departement}`)
                  }
                  style={{
                    background: "#fff",
                    cursor: "pointer",
                    borderRadius: isFirst
                      ? "14px 14px 0 0"
                      : isLast
                        ? "0 0 14px 14px"
                        : 0,
                    border: "1px solid #e2e8f0",
                    borderTop: isFirst ? "1px solid #e2e8f0" : "none",
                    transition: "all .2s",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0fdfe";
                    e.currentTarget.style.borderLeftColor = "var(--cyan)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderLeftColor = "#e2e8f0";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(16px, 3vw, 28px)",
                      padding: "clamp(18px, 3vw, 26px) clamp(18px, 3vw, 28px)",
                    }}
                  >
                    {/* Logo */}
                    <div
                      style={{
                        width: "clamp(56px, 8vw, 72px)",
                        height: "clamp(56px, 8vw, 72px)",
                        borderRadius: 14,
                        flexShrink: 0,
                        background: "var(--navy)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={dept.nom}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: 8,
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          display: logoSrc ? "none" : "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <MdAccountBalance size={28} color="var(--cyan)" />
                      </div>
                    </div>

                    {/* Infos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: "clamp(15px, 2.5vw, 18px)",
                          color: "#0f172a",
                          marginBottom: 6,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {dept.nom}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--muted)",
                          lineHeight: 1.6,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {dept.description || "Département de l'IUT de Douala."}
                      </p>
                    </div>

                    {/* Stats + flèche */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        flexShrink: 0,
                      }}
                    >
                      {(dept.filieres?.length > 0 ||
                        dept.filieres_count > 0) && (
                        <div
                          style={{ textAlign: "center", display: "none" }}
                          className="desktop-only"
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 800,
                              fontSize: 20,
                              color: "var(--cyan)",
                              lineHeight: 1,
                            }}
                          >
                            {dept.filieres_count || dept.filieres?.length || 0}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            filières
                          </p>
                        </div>
                      )}
                      {(dept.enseignants?.length > 0 ||
                        dept.enseignants_count > 0) && (
                        <div
                          style={{ textAlign: "center" }}
                          className="desktop-only"
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 800,
                              fontSize: 20,
                              color: "#0f172a",
                              lineHeight: 1,
                            }}
                          >
                            {dept.enseignants_count ||
                              dept.enseignants?.length ||
                              0}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                              fontWeight: 600,
                              marginTop: 2,
                            }}
                          >
                            enseignants
                          </p>
                        </div>
                      )}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "var(--cyan-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <MdArrowForward size={18} color="var(--cyan-dark)" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
