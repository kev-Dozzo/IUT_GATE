import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MdSearch,
  MdClose,
  MdLocationOn,
  MdApartment,
  MdMeetingRoom,
  MdMyLocation,
  MdLayers,
  MdInfo,
  MdPeople,
  MdMenu,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import { getBatiments } from "../../services/batimentService";
import { getSalles } from "../../services/salleService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (isSelected) =>
  L.divIcon({
    className: "",
    html: `<div style="
    width: ${isSelected ? 44 : 36}px;
    height: ${isSelected ? 44 : 36}px;
    background: ${isSelected ? "#0e7490" : "#06B6D4"};
    border: 3px solid #fff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 14px rgba(6,182,212,.5);
  "></div>`,
    iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
    iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
  });

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 18, { animate: true, duration: 1.2 });
  }, [coords, map]);
  return null;
}

const MAP_STYLES = [
  {
    label: "Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr: "© OpenStreetMap",
  },
  {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "© Esri",
  },
  {
    label: "Sombre",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attr: "© CartoDB",
  },
];

const IUT_CENTER = [4.0511, 9.7679];

export default function CartePage() {
  const [batiments, setBatiments] = useState([]);
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("batiments");
  const [mapStyle, setMapStyle] = useState(0);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    Promise.all([getBatiments(), getSalles()])
      .then(([bats, sals]) => {
        setBatiments(bats);
        setSalles(sals);
        if (bats.length > 0) setSelected(bats[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBatiments = batiments.filter(
    (b) =>
      b.nom?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredSalles = salles.filter(
    (s) =>
      s.nom?.toLowerCase().includes(search.toLowerCase()) ||
      s.type?.toLowerCase().includes(search.toLowerCase()),
  );

  const SidebarContent = () => (
    <>
      {/* Header sidebar */}
      <div
        style={{
          padding: "16px",
          background: "var(--navy)",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 15,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            Carte du Campus
          </p>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <MdClose size={20} />
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.12)",
            borderRadius: 8,
            padding: "8px 12px",
            border: "1px solid rgba(255,255,255,.15)",
          }}
        >
          <MdSearch size={16} style={{ color: "#94a3b8" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 12,
              background: "transparent",
              fontFamily: "var(--font-body)",
              color: "#fff",
            }}
          />
          {search && (
            <MdClose
              size={14}
              style={{ color: "#94a3b8", cursor: "pointer" }}
              onClick={() => setSearch("")}
            />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {[
          { key: "batiments", label: "Bâtiments", icon: MdApartment },
          { key: "salles", label: "Salles", icon: MdMeetingRoom },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1,
              padding: "10px 8px",
              border: "none",
              background: "transparent",
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              color: activeTab === key ? "var(--cyan-dark)" : "var(--muted)",
              borderBottom: `2px solid ${activeTab === key ? "var(--cyan)" : "transparent"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transition: "all .2s",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ flex: 1, overflow: "auto", padding: "10px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "3px solid var(--cyan-light)",
                borderTop: "3px solid var(--cyan)",
                margin: "0 auto 12px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "var(--muted)", fontSize: 12 }}>Chargement...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Bâtiments */}
        {!loading &&
          activeTab === "batiments" &&
          filteredBatiments.map((bat) => {
            const isActive = selected?.id_batiment === bat.id_batiment;
            return (
              <div
                key={bat.id_batiment}
                onClick={() => {
                  setSelected(bat);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  padding: "12px",
                  borderRadius: 10,
                  marginBottom: 6,
                  cursor: "pointer",
                  background: isActive ? "var(--cyan-light)" : "transparent",
                  border: `1px solid ${isActive ? "var(--cyan)" : "transparent"}`,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#f0fdfe";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      flexShrink: 0,
                      background: isActive ? "var(--cyan)" : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdApartment
                      size={18}
                      color={isActive ? "#fff" : "var(--muted)"}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: isActive ? "var(--cyan-dark)" : "var(--text)",
                        marginBottom: 2,
                      }}
                    >
                      {bat.nom}
                    </p>
                    {bat.latitude && bat.longitude && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <MdLocationOn size={11} color="var(--cyan)" />
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--cyan-dark)",
                            fontWeight: 500,
                          }}
                        >
                          {parseFloat(bat.latitude).toFixed(4)},{" "}
                          {parseFloat(bat.longitude).toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Salles */}
        {!loading &&
          activeTab === "salles" &&
          filteredSalles.map((salle) => (
            <div
              key={salle.id_salle}
              style={{
                padding: "12px",
                borderRadius: 10,
                marginBottom: 6,
                cursor: "pointer",
                border: "1px solid var(--border)",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--cyan)";
                e.currentTarget.style.background = "#f0fdfe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    flexShrink: 0,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MdMeetingRoom size={18} color="var(--muted)" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--text)",
                      marginBottom: 3,
                    }}
                  >
                    {salle.nom}
                  </p>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    {salle.type && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: 999,
                          background: "var(--cyan-light)",
                          color: "var(--cyan-dark)",
                          fontFamily: "var(--font-head)",
                        }}
                      >
                        {salle.type}
                      </span>
                    )}
                    {salle.capacite && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <MdPeople size={11} /> {salle.capacite} places
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Aucun résultat */}
        {!loading &&
          ((activeTab === "batiments" && filteredBatiments.length === 0) ||
            (activeTab === "salles" && filteredSalles.length === 0)) && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "var(--muted)",
              }}
            >
              <MdLocationOn
                size={32}
                style={{ opacity: 0.3, marginBottom: 8 }}
              />
              <p style={{ fontSize: 12 }}>Aucun résultat</p>
            </div>
          )}
      </div>

      {/* Info sélectionné */}
      {selected && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "12px 14px",
            background: "#f0fdfe",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 4,
            }}
          >
            <MdInfo size={13} color="var(--cyan-dark)" />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 11,
                color: "var(--cyan-dark)",
              }}
            >
              Sélectionné
            </p>
          </div>
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--text)",
            }}
          >
            {selected.nom}
          </p>
        </div>
      )}
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── SIDEBAR DESKTOP ── */}
        {!isMobile && (
          <aside
            style={{
              width: 300,
              background: "#fff",
              borderRight: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <SidebarContent />
          </aside>
        )}

        {/* ── DRAWER SIDEBAR MOBILE ── */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.5)",
              zIndex: 9999,
            }}
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "85vw",
                maxWidth: 320,
                height: "100vh",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 9999,
                boxShadow: "4px 0 24px rgba(0,0,0,.2)",
              }}
            >
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* ── MAP ── */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Bouton ouvrir sidebar mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                zIndex: 1000,
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                color: "var(--text)",
                boxShadow: "0 2px 12px rgba(0,0,0,.1)",
              }}
            >
              <MdMenu size={18} color="var(--cyan)" />
              {selected ? selected.nom : "Bâtiments"}
            </button>
          )}

          {/* Style switcher */}
          <div
            style={{ position: "absolute", top: 14, right: 14, zIndex: 1000 }}
          >
            <button
              onClick={() => setShowStyleMenu(!showStyleMenu)}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                color: "var(--text)",
                boxShadow: "0 2px 12px rgba(0,0,0,.1)",
              }}
            >
              <MdLayers size={16} color="var(--cyan)" />
              {MAP_STYLES[mapStyle].label}
            </button>

            {showStyleMenu && (
              <div
                style={{
                  position: "fixed", // ← fixed au lieu de absolute
                  top: "auto",
                  right: 14,
                  marginTop: 6,
                  background: "#fff",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                  zIndex: 9998, // ← très haut z-index
                }}
              >
                {MAP_STYLES.map((style, idx) => (
                  <div
                    key={style.label}
                    onClick={() => {
                      setMapStyle(idx);
                      setShowStyleMenu(false);
                    }}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "var(--font-head)",
                      fontWeight: mapStyle === idx ? 700 : 500,
                      color:
                        mapStyle === idx ? "var(--cyan-dark)" : "var(--text)",
                      background:
                        mapStyle === idx ? "var(--cyan-light)" : "#fff",
                    }}
                  >
                    {style.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recentrer */}
          <button
            onClick={() => batiments.length > 0 && setSelected(batiments[0])}
            style={{
              position: "absolute",
              bottom: 24,
              right: 14,
              zIndex: 1000,
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.1)",
            }}
          >
            <MdMyLocation size={20} color="var(--cyan)" />
          </button>

          {/* Map */}
          <MapContainer
            center={IUT_CENTER}
            zoom={15}
            minZoom={3}
            maxZoom={22}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              key={mapStyle}
              url={MAP_STYLES[mapStyle].url}
              attribution={MAP_STYLES[mapStyle].attr}
              maxZoom={22}
              maxNativeZoom={19}
            />

            {selected?.latitude && selected?.longitude && (
              <FlyTo
                coords={[
                  parseFloat(selected.latitude),
                  parseFloat(selected.longitude),
                ]}
              />
            )}

            {batiments.map((bat) => {
              if (!bat.latitude || !bat.longitude) return null;
              const isActive = selected?.id_batiment === bat.id_batiment;
              return (
                <Marker
                  key={bat.id_batiment}
                  position={[
                    parseFloat(bat.latitude),
                    parseFloat(bat.longitude),
                  ]}
                  icon={createCustomIcon(isActive)}
                  eventHandlers={{ click: () => setSelected(bat) }}
                >
                  <Popup>
                    <div
                      style={{ fontFamily: "var(--font-body)", minWidth: 150 }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0f172a",
                          marginBottom: 4,
                        }}
                      >
                        {bat.nom}
                      </p>
                      {bat.description && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            lineHeight: 1.5,
                          }}
                        >
                          {bat.description}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
