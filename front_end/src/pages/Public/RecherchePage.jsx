import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdSearch,
  MdClose,
  MdSchool,
  MdPeople,
  MdApartment,
  MdMeetingRoom,
  MdCampaign,
  MdArrowForward,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import api from "../../services/api";
import { BASE_URL } from "../../config/constants";


const TYPES = [
  { key: "all", label: "Tout" },
  { key: "filieres", label: "Filières", icon: MdSchool },
  { key: "enseignants", label: "Enseignants", icon: MdPeople },
  { key: "departements", label: "Départements", icon: MdApartment },
  { key: "actualites", label: "Actualités", icon: MdCampaign },
  { key: "salles", label: "Salles", icon: MdMeetingRoom },
];

const ROUTES = {
  filieres: (id) => `/filieres/${id}`,
  enseignants: (id) => `/enseignants/${id}`,
  departements: (id) => `/departements/${id}`,
  actualites: (id) => `/actualites/${id}`,
  salles: () => `/carte`,
};

export default function RecherchePage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [type, setType] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/immutability
    if (params.get("q")) doSearch(params.get("q"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSearch = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    setParams({ q });
    try {
      const [fil, ens, dept, actu, sal] = await Promise.allSettled([
        api.get(`/filieres?search=${q}`),
        api.get(`/enseignants?search=${q}`),
        api.get(`/departements?search=${q}`),
        api.get(`/actualites?search=${q}`),
        api.get(`/salles?search=${q}`),
      ]);

      const format = (res, type) =>
        res.status === "fulfilled"
          ? (res.value?.data || []).map((i) => ({ ...i, _type: type }))
          : [];

      setResults([
        ...format(fil, "filieres"),
        ...format(ens, "enseignants"),
        ...format(dept, "departements"),
        ...format(actu, "actualites"),
        ...format(sal, "salles"),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    type === "all" ? results : results.filter((r) => r._type === type);

  const getIcon = (t) => TYPES.find((x) => x.key === t)?.icon || MdSearch;
  const getLabel = (t) => TYPES.find((x) => x.key === t)?.label || t;
  const getTitle = (r) => r.nom || r.titre || r.prenom || "—";
  const getDesc = (r) =>
    r.description || r.contenu?.slice(0, 80) || r.role || r.poste || "";
  const getImg = (r) => {
    const url = r.photo_url || r.photos?.[0]?.url;
    return url ? `${BASE_URL}${url}` : null;
  };

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
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--cyan)",
              fontFamily: "var(--font-head)",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            IUTGate
          </p>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.8,
              marginBottom: 24,
            }}
          >
            Recherche avancée
          </h1>

          {/* Barre de recherche */}
          <div
            style={{
              display: "flex",
              gap: 0,
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
              }}
            >
              <MdSearch size={20} color="var(--subtle)" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Rechercher une filière, enseignant, salle..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                fontFamily: "var(--font-body)",
                color: "var(--text)",
                padding: "16px 0",
              }}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setSearched(false);
                }}
                style={{
                  padding: "0 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <MdClose size={16} color="var(--subtle)" />
              </button>
            )}
            <button
              onClick={() => doSearch()}
              style={{
                padding: "0 24px",
                background: "var(--cyan)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: 13,
                color: "#0c1a40",
                transition: "all .2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--cyan-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--cyan)")
              }
            >
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* FILTRES TYPE */}
      {searched && (
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
            {TYPES.map((t) => {
              const count =
                t.key === "all"
                  ? results.length
                  : results.filter((r) => r._type === t.key).length;
              return (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  style={{
                    padding: "11px 16px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font-head)",
                    fontWeight: 600,
                    fontSize: 12,
                    color: type === t.key ? "var(--cyan)" : "#94a3b8",
                    borderBottom: `2px solid ${type === t.key ? "var(--cyan)" : "transparent"}`,
                    whiteSpace: "nowrap",
                    transition: "all .2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {t.label}
                  {count > 0 && (
                    <span
                      style={{
                        padding: "1px 7px",
                        borderRadius: 999,
                        background:
                          type === t.key ? "var(--cyan-light)" : "#f1f5f9",
                        color:
                          type === t.key ? "var(--cyan-dark)" : "var(--muted)",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(24px, 5vw, 40px) 24px",
        }}
      >
        {!searched && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
            }}
          >
            <MdSearch size={48} style={{ opacity: 0.15, marginBottom: 16 }} />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Que cherchez-vous ?
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Filières, enseignants, salles, actualités...
            </p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                width: 36,
                height: 36,
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

        {searched && !loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--muted)",
            }}
          >
            <MdSearch size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
              Aucun résultat pour "{query}"
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Essayez avec d'autres mots-clés.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p
              style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}
            >
              <strong style={{ color: "#0f172a" }}>{filtered.length}</strong>{" "}
              résultat{filtered.length > 1 ? "s" : ""} pour{" "}
              <strong style={{ color: "#0f172a" }}>"{query}"</strong>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {filtered.map((r, i) => {
                const Icon = getIcon(r._type);
                const img = getImg(r);
                const id =
                  r.id_filiere ||
                  r.id_enseignant ||
                  r.id_departement ||
                  r.id_actualite ||
                  r.id_salle;
                const route = ROUTES[r._type]?.(id);
                const isFirst = i === 0;
                const isLast = i === filtered.length - 1;

                return (
                  <div
                    key={`${r._type}-${id}`}
                    onClick={() => route && navigate(route)}
                    style={{
                      background: "#fff",
                      cursor: route ? "pointer" : "default",
                      borderRadius: isFirst
                        ? "12px 12px 0 0"
                        : isLast
                          ? "0 0 12px 12px"
                          : 0,
                      border: "1px solid #e2e8f0",
                      borderTop: isFirst ? "1px solid #e2e8f0" : "none",
                      padding: "clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)",
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                      transition: "all .2s",
                    }}
                    onMouseEnter={(e) => {
                      if (route) e.currentTarget.style.background = "#f0fdfe";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    {/* Photo ou icône */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "var(--navy)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <Icon size={22} color="var(--cyan)" />
                      )}
                    </div>

                    {/* Infos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
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
                          {getLabel(r._type)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#0f172a",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getTitle(r)}
                      </p>
                      {getDesc(r) && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getDesc(r)}
                        </p>
                      )}
                    </div>

                    {route && (
                      <MdArrowForward
                        size={18}
                        color="var(--cyan)"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
