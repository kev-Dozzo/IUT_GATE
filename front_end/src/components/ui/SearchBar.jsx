import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdClose,
  MdPeople,
  MdSchool,
  MdAccountBalance,
  MdCampaign,
  MdBusiness,
  MdArrowForward,
} from "react-icons/md";
import { getEnseignants } from "../../services/enseignantService";
import { getFilieres } from "../../services/filiereService";
import { getDepartements } from "../../services/departementService";
import { getActualites } from "../../services/actualiteService";
import { getServices } from "../../services/serviceAdminService";

const ICONS = {
  enseignant: {
    icon: MdPeople,
    color: "#0e7490",
    bg: "#cffafe",
    label: "Enseignant",
  },
  filiere: {
    icon: MdSchool,
    color: "#065f46",
    bg: "#d1fae5",
    label: "Filière",
  },
  departement: {
    icon: MdAccountBalance,
    color: "#92400e",
    bg: "#fef3c7",
    label: "Département",
  },
  actualite: {
    icon: MdCampaign,
    color: "#991b1b",
    bg: "#fee2e2",
    label: "Actualité",
  },
  service: {
    icon: MdBusiness,
    color: "#5b21b6",
    bg: "#ede9fe",
    label: "Service",
  },
};

export default function SearchBar({ size = "large" }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [allData, setAllData] = useState(null);
  const [focused, setFocused] = useState(false);

  // Charge toutes les données une fois
  useEffect(() => {
    Promise.all([
      getEnseignants().catch(() => []),
      getFilieres().catch(() => []),
      getDepartements().catch(() => []),
      getActualites().catch(() => []),
      getServices().catch(() => []),
    ]).then(([ens, fil, dep, act, svc]) => {
      setAllData({ ens, fil, dep, act, svc });
    });
  }, []);

  // Fermer si clic en dehors
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Recherche en temps réel
  useEffect(() => {
    if (!query.trim() || !allData) {
      setResults([]);
      setShowDrop(false);
      return;
    }

    setLoading(true);
    const q = query.toLowerCase();
    const found = [];

    // Enseignants
    allData.ens?.forEach((e) => {
      if (
        e.nom?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.role?.toLowerCase().includes(q) ||
        e.poste?.toLowerCase().includes(q)
      ) {
        found.push({
          type: "enseignant",
          id: e.id_enseignant,
          titre: e.nom,
          sousTitre: e.role || e.poste || "Enseignant",
          path: `/enseignants/${e.id_enseignant}`,
        });
      }
    });

    // Filières
    allData.fil?.forEach((f) => {
      if (
        f.nom?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
      ) {
        found.push({
          type: "filiere",
          id: f.id_filiere,
          titre: f.nom,
          sousTitre: f.duree || "Filière",
          path: `/filieres/${f.id_filiere}`,
        });
      }
    });

    // Départements
    allData.dep?.forEach((d) => {
      if (
        d.nom?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      ) {
        found.push({
          type: "departement",
          id: d.id_departement,
          titre: d.nom,
          sousTitre: "Département",
          path: `/departements/${d.id_departement}`,
        });
      }
    });

    // Actualités
    allData.act?.forEach((a) => {
      if (
        a.titre?.toLowerCase().includes(q) ||
        a.contenu?.toLowerCase().includes(q)
      ) {
        found.push({
          type: "actualite",
          id: a.id_actualite,
          titre: a.titre,
          sousTitre: a.categorie || "Actualité",
          path: `/actualites/${a.id_actualite}`,
        });
      }
    });

    // Services
    allData.svc?.forEach((s) => {
      if (
        s.nom?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      ) {
        found.push({
          type: "service",
          id: s.id_service,
          titre: s.nom,
          sousTitre: "Service administratif",
          path: `/services/${s.id_service}`,
        });
      }
    });

    setResults(found.slice(0, 8));
    setShowDrop(found.length > 0);
    setLoading(false);
  }, [query, allData]);

  const handleSelect = (item) => {
    navigate(item.path);
    setQuery("");
    setShowDrop(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0]);
  };

  const isLarge = size === "large";

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: isLarge ? 580 : 400,
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: isLarge ? "rgba(255,255,255,.96)" : "#fff",
            borderRadius: 12,
            padding: isLarge ? "12px 18px" : "9px 14px",
            boxShadow: isLarge ? "0 4px 24px rgba(0,0,0,.2)" : "none",
            border: isLarge
              ? "none"
              : `1.5px solid ${focused ? "var(--cyan)" : "var(--border)"}`,
            transition: "all .2s",
          }}
        >
          <MdSearch
            size={isLarge ? 20 : 16}
            style={{ color: "#94a3b8", flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (results.length > 0) setShowDrop(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder={
              isLarge
                ? "Rechercher un enseignant, une filière, un service..."
                : "Rechercher..."
            }
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: isLarge ? 14 : 13,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              background: "transparent",
              minWidth: 0,
            }}
          />
          {query && (
            <MdClose
              size={16}
              style={{ color: "#94a3b8", cursor: "pointer", flexShrink: 0 }}
              onClick={() => {
                setQuery("");
                setShowDrop(false);
              }}
            />
          )}
          {isLarge && (
            <button
              type="submit"
              style={{
                background: "var(--cyan)",
                color: "var(--cyan-text)",
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Rechercher
            </button>
          )}
        </div>
      </form>

      {/* Dropdown suggestions */}
      {showDrop && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--border)",
            boxShadow: "0 16px 48px rgba(0,0,0,.15)",
            overflow: "hidden",
          }}
        >
          {/* Header dropdown */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--muted)",
                fontFamily: "var(--font-head)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {loading
                ? "Recherche..."
                : `${results.length} résultat${results.length > 1 ? "s" : ""}`}
            </p>
            {results.length > 0 && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--subtle)",
                  fontFamily: "var(--font-head)",
                }}
              >
                ↵ pour aller au 1er résultat
              </span>
            )}
          </div>

          {/* Résultats */}
          {results.map((item, i) => {
            const meta = ICONS[item.type];
            const Icon = meta.icon;
            return (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom:
                    i < results.length - 1 ? "1px solid #f8fafc" : "none",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: meta.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={meta.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--text)",
                      marginBottom: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.titre}
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 7px",
                        borderRadius: 999,
                        background: meta.bg,
                        color: meta.color,
                        fontFamily: "var(--font-head)",
                      }}
                    >
                      {meta.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.sousTitre}
                    </span>
                  </div>
                </div>
                <MdArrowForward
                  size={15}
                  color="var(--subtle)"
                  style={{ flexShrink: 0 }}
                />
              </div>
            );
          })}

          {/* Voir tous les résultats */}
          {results.length > 0 && (
            <div
              onClick={() => {
                setShowDrop(false);
              }}
              style={{
                padding: "10px 16px",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--cyan)",
                  fontWeight: 600,
                  fontFamily: "var(--font-head)",
                }}
              >
                Voir tous les résultats →
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
