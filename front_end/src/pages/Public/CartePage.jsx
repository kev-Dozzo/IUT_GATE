import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline,
} from "react-leaflet";
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
  MdDirections,
  MdNavigation,
  MdDoorBack,
  MdDoorSliding,
} from "react-icons/md";
import Navbar from "../../components/layout/Navbar";
import { getBatiments } from "../../services/batimentService";
import { getSalles } from "../../services/salleService";
import SEO from "../../components/ui/SEO";
import { BASE_URL } from "../../config/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createBatimentIcon = (isSelected) =>
  L.divIcon({
    className: "",
    html: `<div style="width:${isSelected ? 44 : 36}px;height:${isSelected ? 44 : 36}px;background:${isSelected ? "#0e7490" : "#06B6D4"};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(6,182,212,.5);"></div>`,
    iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
    iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
  });

const createSalleIcon = (isSelected) =>
  L.divIcon({
    className: "",
    html: `<div style="width:${isSelected ? 32 : 24}px;height:${isSelected ? 32 : 24}px;background:${isSelected ? "#5b21b6" : "#8b5cf6"};border:2px solid #fff;border-radius:6px;box-shadow:0 3px 10px rgba(139,92,246,.5);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:#fff;border-radius:2px;"></div></div>`,
    iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
    iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
  });

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;background:#3B82F6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function FlyTo({ coords, zoom = 18 }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, zoom, { animate: true, duration: 1.2 });
  }, [coords, map, zoom]);
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

const IUT_CENTER = [4.055384, 9.745314];

export default function CartePage() {
  const [batiments, setBatiments] = useState([]);
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [activeTab, setActiveTab] = useState("batiments");
  const [mapStyle, setMapStyle] = useState(0);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userPos, setUserPos] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [flyCoords, setFlyCoords] = useState(null);
  const [flyZoom, setFlyZoom] = useState(18);
  const [route, setRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);

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
        if (bats.length > 0) {
          setSelected(bats[0]);
          if (bats[0].latitude && bats[0].longitude)
            setFlyCoords([
              parseFloat(bats[0].latitude),
              parseFloat(bats[0].longitude),
            ]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  //  Demande géolocalisation avec modal
  const requestGeolocation = (destLat, destLng, nom) => {
    if (userPos) {
      calculateRoute(userPos, [destLat, destLng]);
      return;
    }
    setPendingDestination({ lat: destLat, lng: destLng, nom });
    setShowGeoModal(true);
  };

  const confirmGeolocation = () => {
    setShowGeoModal(false);
    setGpsLoading(true);
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée par votre navigateur.");
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setFlyCoords(coords);
        setFlyZoom(16);
        setGpsLoading(false);
        if (pendingDestination) {
          calculateRoute(coords, [
            pendingDestination.lat,
            pendingDestination.lng,
          ]);
          setPendingDestination(null);
        }
      },
      (err) => {
        setGpsLoading(false);
        setPendingDestination(null);
        if (err.code === 1)
          alert(
            "Permission refusée. Activez la localisation dans les paramètres de votre navigateur.",
          );
        else alert("Impossible d'obtenir votre position.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // ── GPS bouton ──
  const getUserLocation = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée.");
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setFlyCoords(coords);
        setFlyZoom(16);
        setGpsLoading(false);
      },
      () => {
        alert("Impossible d'obtenir votre position.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // ── Calcule itinéraire via OSRM ──
  const calculateRoute = async (from, to) => {
    setRouteLoading(true);
    setRoute(null);
    setRouteInfo(null);
    try {
      const url = `https://router.project-osrm.org/route/v1/walking/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.length > 0) {
        const r = data.routes[0];
        const coords = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
        setRouteInfo({
          distance: (r.distance / 1000).toFixed(2),
          duration: Math.ceil(r.duration / 60),
        });
        const midIdx = Math.floor(coords.length / 2);
        setFlyCoords(coords[midIdx]);
        setFlyZoom(16);
      }
    } catch {
      alert("Impossible de calculer l'itinéraire.");
    } finally {
      setRouteLoading(false);
    }
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteInfo(null);
  };

  const selectBatiment = (bat) => {
    setSelected(bat);
    setSelectedSalle(null);
    if (bat.latitude && bat.longitude) {
      setFlyCoords([parseFloat(bat.latitude), parseFloat(bat.longitude)]);
      setFlyZoom(18);
    }
    if (isMobile) setSidebarOpen(false);
  };

  const selectSalle = (salle) => {
    setSelectedSalle(salle);
    const bat = batiments.find((b) => b.id_batiment === salle.id_batiment);
    if (bat?.latitude && bat?.longitude) {
      setSelected(bat);
      setFlyCoords([parseFloat(bat.latitude), parseFloat(bat.longitude)]);
      setFlyZoom(19);
    }
    if (isMobile) setSidebarOpen(false);
  };

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
      <div
        style={{
          padding: "16px",
          background: "var(--navy)",
          borderBottom: "1px solid rgba(255,255,255,.1)",
          flexShrink: 0,
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
            🗺️ Carte du Campus
          </p>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                padding: 4,
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
          <MdSearch size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
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

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
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
            <Icon icon={Icon} size={15} />
            {label}
          </button>
        ))}
      </div>

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
                onClick={() => selectBatiment(bat)}
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
                <div
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
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
                    {bat.description && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bat.description}
                      </p>
                    )}
                    {bat.latitude && bat.longitude && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          marginTop: 4,
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
                    {isActive && bat.latitude && bat.longitude && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestGeolocation(
                            parseFloat(bat.latitude),
                            parseFloat(bat.longitude),
                            bat.nom,
                          );
                        }}
                        style={{
                          marginTop: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "6px 12px",
                          background: "var(--cyan)",
                          color: "var(--cyan-text)",
                          border: "none",
                          borderRadius: 6,
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        <MdDirections size={13} /> Itinéraire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Salles */}
        {!loading &&
          activeTab === "salles" &&
          filteredSalles.map((salle) => {
            const isActive = selectedSalle?.id_salle === salle.id_salle;
            const bat = batiments.find(
              (b) => b.id_batiment === salle.id_batiment,
            );
            return (
              <div
                key={salle.id_salle}
                onClick={() => selectSalle(salle)}
                style={{
                  padding: "12px",
                  borderRadius: 10,
                  marginBottom: 6,
                  cursor: "pointer",
                  background: isActive ? "#ede9fe" : "transparent",
                  border: `1px solid ${isActive ? "#8b5cf6" : "var(--border)"}`,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#f5f3ff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      flexShrink: 0,
                      background: isActive ? "#8b5cf6" : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdMeetingRoom
                      size={18}
                      color={isActive ? "#fff" : "var(--muted)"}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: isActive ? "#5b21b6" : "var(--text)",
                        marginBottom: 3,
                      }}
                    >
                      {salle.nom}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {salle.type && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "1px 7px",
                            borderRadius: 999,
                            background: "#ede9fe",
                            color: "#5b21b6",
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
                    {bat && (
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--muted)",
                          marginTop: 3,
                        }}
                      >
                        📍 {bat.nom}
                      </p>
                    )}
                    {isActive && bat?.latitude && bat?.longitude && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestGeolocation(
                            parseFloat(bat.latitude),
                            parseFloat(bat.longitude),
                            salle.nom,
                          );
                        }}
                        style={{
                          marginTop: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "6px 12px",
                          background: "#8b5cf6",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        <MdDirections size={13} /> Itinéraire vers {bat.nom}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

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

      {(selected || selectedSalle) && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "12px 14px",
            background: selectedSalle ? "#f5f3ff" : "#f0fdfe",
            flexShrink: 0,
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
            <MdInfo
              size={13}
              color={selectedSalle ? "#5b21b6" : "var(--cyan-dark)"}
            />
            <p
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 11,
                color: selectedSalle ? "#5b21b6" : "var(--cyan-dark)",
              }}
            >
              {selectedSalle ? "Salle sélectionnée" : "Bâtiment sélectionné"}
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
            {selectedSalle ? selectedSalle.nom : selected?.nom}
          </p>
          {selectedSalle && (
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              dans{" "}
              {
                batiments.find(
                  (b) => b.id_batiment === selectedSalle.id_batiment,
                )?.nom
              }
            </p>
          )}
        </div>
      )}
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <SEO
        title="Carte du Campus"
        description="Carte interactive du campus de l'IUT de Douala. Trouvez bâtiments et salles facilement."
        url="https://iutgate.vercel.app/carte"
      />
      <Navbar />

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Sidebar desktop */}
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

        {/* MAP */}
        <div style={{ flex: 1, position: "relative" }}>
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

            {flyCoords && <FlyTo coords={flyCoords} zoom={flyZoom} />}

            {/* Position utilisateur */}
            {userPos && (
              <>
                <Marker position={userPos} icon={userIcon}>
                  <Popup>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Votre position
                    </p>
                  </Popup>
                </Marker>
                <Circle
                  center={userPos}
                  radius={30}
                  pathOptions={{
                    color: "#3B82F6",
                    fillColor: "#3B82F6",
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                />
              </>
            )}

            {/* Itinéraire Polyline */}
            {route && (
              <Polyline
                positions={route}
                pathOptions={{
                  color: "#06B6D4",
                  weight: 5,
                  opacity: 0.85,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            )}

            {/* Bâtiments */}
            {batiments.map((bat) => {
              if (!bat.latitude || !bat.longitude) return null;
              const isActive = selected?.id_batiment === bat.id_batiment;
              const sallesDuBat = salles.filter(
                (s) => s.id_batiment === bat.id_batiment,
              );

              return (
                <Marker
                  key={bat.id_batiment}
                  position={[
                    parseFloat(bat.latitude),
                    parseFloat(bat.longitude),
                  ]}
                  icon={createBatimentIcon(isActive)}
                  eventHandlers={{ click: () => selectBatiment(bat) }}
                >
                  <Popup minWidth={260} maxWidth={300}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        padding: 0,
                        margin: -14,
                      }}
                    >
                      {/* Photo bâtiment */}
                      {bat.photo_url ? (
                        <div
                          style={{
                            position: "relative",
                            height: 130,
                            overflow: "hidden",
                            borderRadius: "8px 8px 0 0",
                          }}
                        >
                          <img
                            src={`${BASE_URL}${bat.photo_url}`}
                            alt={bat.nom}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(to bottom, transparent 40%, rgba(12,26,64,.7))",
                            }}
                          />
                          <p
                            style={{
                              position: "absolute",
                              bottom: 8,
                              left: 12,
                              fontFamily: "var(--font-head)",
                              fontWeight: 800,
                              fontSize: 14,
                              color: "#fff",
                              textShadow: "0 1px 4px rgba(0,0,0,.5)",
                            }}
                          >
                            {bat.nom}
                          </p>
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 70,
                            background:
                              "linear-gradient(135deg, #0c1a40, #0e5f75)",
                            borderRadius: "8px 8px 0 0",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 14px",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 800,
                              fontSize: 14,
                              color: "#fff",
                            }}
                          >
                            {bat.nom}
                          </p>
                        </div>
                      )}

                      <div style={{ padding: "12px 14px" }}>
                        {/* Description */}
                        {bat.description && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              lineHeight: 1.5,
                              marginBottom: 10,
                            }}
                          >
                            {bat.description}
                          </p>
                        )}

                        {/* Nombre de salles */}
                        {sallesDuBat.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <p
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "var(--subtle)",
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                marginBottom: 6,
                              }}
                            >
                              Salles ({sallesDuBat.length})
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                                maxHeight: 100,
                                overflow: "auto",
                              }}
                            >
                              {sallesDuBat.map((s) => (
                                <div
                                  key={s.id_salle}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "5px 8px",
                                    background: "#f8fafc",
                                    borderRadius: 6,
                                    border: "1px solid #f1f5f9",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 11,
                                      color: "#0f172a",
                                      fontWeight: 600,
                                    }}
                                  >
                                    <MdDoorSliding size={15} /> {s.nom}
                                  </span>
                                  <div style={{ display: "flex", gap: 4 }}>
                                    {s.type && (
                                      <span
                                        style={{
                                          fontSize: 10,
                                          padding: "1px 6px",
                                          borderRadius: 999,
                                          background: "#ede9fe",
                                          color: "#5b21b6",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {s.type}
                                      </span>
                                    )}
                                    {s.capacite && (
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: "#94a3b8",
                                        }}
                                      >
                                        {s.capacite}p
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Coordonnées */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 10,
                          }}
                        >
                          <MdLocationOn size={12} color="var(--cyan)" />
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                              fontFamily: "monospace",
                            }}
                          >
                            {parseFloat(bat.latitude).toFixed(4)},{" "}
                            {parseFloat(bat.longitude).toFixed(4)}
                          </span>
                        </div>

                        {/* Bouton itinéraire */}
                        <button
                          onClick={() =>
                            requestGeolocation(
                              parseFloat(bat.latitude),
                              parseFloat(bat.longitude),
                              bat.nom,
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            width: "100%",
                            padding: "9px",
                            background: "var(--cyan)",
                            color: "var(--cyan-text)",
                            border: "none",
                            borderRadius: 8,
                            fontFamily: "var(--font-head)",
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: "pointer",
                            justifyContent: "center",
                          }}
                        >
                          <MdDirections size={15} /> Itinéraire vers ce bâtiment
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Salles */}
            {activeTab === "salles" &&
              salles.map((salle) => {
                const bat = batiments.find(
                  (b) => b.id_batiment === salle.id_batiment,
                );
                if (!bat?.latitude || !bat?.longitude) return null;
                const isActive = selectedSalle?.id_salle === salle.id_salle;
                const offset = 0.0001 + salle.id_salle * 0.00005;

                return (
                  <Marker
                    key={`salle-${salle.id_salle}`}
                    position={[
                      parseFloat(bat.latitude) + offset,
                      parseFloat(bat.longitude) + offset,
                    ]}
                    icon={createSalleIcon(isActive)}
                    eventHandlers={{ click: () => selectSalle(salle) }}
                  >
                    <Popup minWidth={240}>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          margin: -14,
                          padding: 0,
                        }}
                      >
                        {/* Header violet */}
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #4c1d95, #6d28d9)",
                            padding: "14px 16px",
                            borderRadius: "8px 8px 0 0",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-head)",
                              fontWeight: 800,
                              fontSize: 14,
                              color: "#fff",
                              marginBottom: 4,
                            }}
                          >
                            {salle.nom}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            {salle.type && (
                              <span
                                style={{
                                  fontSize: 10,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: "rgba(255,255,255,.2)",
                                  color: "#fff",
                                  fontWeight: 600,
                                }}
                              >
                                {salle.type}
                              </span>
                            )}
                            {salle.capacite && (
                              <span
                                style={{
                                  fontSize: 10,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: "rgba(255,255,255,.15)",
                                  color: "#e9d5ff",
                                  fontWeight: 600,
                                }}
                              >
                                👥 {salle.capacite} places
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ padding: "12px 14px" }}>
                          {/* Bâtiment parent */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 10px",
                              background: "#f8fafc",
                              borderRadius: 8,
                              marginBottom: 10,
                            }}
                          >
                            <MdApartment size={14} color="var(--cyan-dark)" />
                            <div>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "var(--subtle)",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                Bâtiment
                              </p>
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "var(--text)",
                                  fontWeight: 600,
                                }}
                              >
                                {bat.nom}
                              </p>
                            </div>
                          </div>

                          {/* Bouton itinéraire */}
                          <button
                            onClick={() =>
                              requestGeolocation(
                                parseFloat(bat.latitude),
                                parseFloat(bat.longitude),
                                salle.nom,
                              )
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              width: "100%",
                              padding: "9px",
                              background: "#6d28d9",
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              fontFamily: "var(--font-head)",
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: "pointer",
                              justifyContent: "center",
                            }}
                          >
                            <MdDirections size={15} /> Itinéraire vers {bat.nom}
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>

        {/* ══ CONTRÔLES FLOTTANTS ══ */}

        {/* Drawer mobile */}
        {isMobile && (
          <>
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,.5)",
                  zIndex: 9998,
                }}
              />
            )}
            <aside
              style={{
                position: "fixed",
                top: 60,
                left: 0,
                width: "85vw",
                maxWidth: 320,
                height: "calc(100vh - 60px)",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 9999,
                boxShadow: "4px 0 24px rgba(0,0,0,.2)",
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform .3s ease",
              }}
            >
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Btn sidebar mobile */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: "fixed",
              bottom: 90,
              left: 16,
              zIndex: 9000,
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              color: "var(--text)",
              boxShadow: "0 4px 16px rgba(0,0,0,.15)",
            }}
          >
            <MdMenu size={18} color="var(--cyan)" />
            {selectedSalle
              ? selectedSalle.nom
              : selected
                ? selected.nom
                : "Bâtiments"}
          </button>
        )}

        {/* GPS */}
        <button
          onClick={getUserLocation}
          disabled={gpsLoading}
          title="Ma position"
          style={{
            position: "fixed",
            bottom: 30,
            right: 60,
            zIndex: 9000,
            background: userPos ? "#3B82F6" : "#fff",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,.1)",
            transition: "all .2s",
          }}
        >
          {gpsLoading ? (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid #94a3b8",
                borderTop: "2px solid var(--cyan)",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <MdNavigation size={20} color={userPos ? "#fff" : "var(--cyan)"} />
          )}
        </button>

        {/* Recentrer */}
        <button
          onClick={() => {
            setFlyCoords(IUT_CENTER);
            setFlyZoom(15);
          }}
          title="Recentrer"
          style={{
            position: "fixed",
            bottom: 30,
            right: 16,
            zIndex: 9000,
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

        {/* Style switcher */}
        <div style={{ position: "fixed", top: 74, right: 16, zIndex: 9000 }}>
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
                position: "absolute",
                top: "110%",
                right: 0,
                background: "#fff",
                borderRadius: 10,
                border: "1px solid var(--border)",
                overflow: "hidden",
                minWidth: 140,
                boxShadow: "0 8px 24px rgba(0,0,0,.15)",
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
                    background: mapStyle === idx ? "var(--cyan-light)" : "#fff",
                  }}
                  onMouseEnter={(e) => {
                    if (mapStyle !== idx)
                      e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (mapStyle !== idx)
                      e.currentTarget.style.background = "#fff";
                  }}
                >
                  {style.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info itinéraire */}
        {(routeInfo || routeLoading) && (
          <div
            style={{
              position: "fixed",
              bottom: 80,
              left: isMobile ? 16 : 316,
              zIndex: 9000,
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
              padding: "14px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,.15)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              minWidth: 220,
            }}
          >
            {routeLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "2px solid var(--cyan-light)",
                    borderTop: "2px solid var(--cyan)",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    fontFamily: "var(--font-head)",
                    fontWeight: 500,
                  }}
                >
                  Calcul de l'itinéraire...
                </span>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, display: "flex", gap: 16 }}>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--subtle)",
                        fontFamily: "var(--font-head)",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Distance
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 800,
                        fontSize: 16,
                        color: "var(--cyan-dark)",
                      }}
                    >
                      {routeInfo?.distance} km
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--subtle)",
                        fontFamily: "var(--font-head)",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Durée à pied
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#0f172a",
                      }}
                    >
                      ~{routeInfo?.duration} min
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearRoute}
                  style={{
                    background: "#fee2e2",
                    border: "none",
                    borderRadius: 8,
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <MdClose size={16} color="#dc2626" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Légende */}
        <div
          style={{
            position: "fixed",
            bottom: 30,
            left: isMobile ? 16 : 316,
            zIndex: 9000,
            background: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 12px rgba(0,0,0,.1)",
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: "#06B6D4",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                fontFamily: "var(--font-head)",
                fontWeight: 500,
              }}
            >
              Bâtiment
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: "#8b5cf6",
                borderRadius: 3,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                fontFamily: "var(--font-head)",
                fontWeight: 500,
              }}
            >
              Salle
            </span>
          </div>
          {userPos && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#3B82F6",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  fontFamily: "var(--font-head)",
                  fontWeight: 500,
                }}
              >
                Vous
              </span>
            </div>
          )}
        </div>

        {/* ── MODAL GÉOLOCALISATION ── */}
        {showGeoModal && (
          <div
            onClick={() => {
              setShowGeoModal(false);
              setPendingDestination(null);
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(12,26,64,.7)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "clamp(24px, 5vw, 36px)",
                maxWidth: 380,
                width: "100%",
                textAlign: "center",
                boxShadow: "0 24px 64px rgba(0,0,0,.25)",
                animation: "fadeIn .2s ease",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--cyan-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <MdLocationOn size={36} color="var(--cyan-dark)" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 10,
                }}
              >
                Activer la localisation
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  marginBottom: 8,
                }}
              >
                Pour calculer l'itinéraire vers
              </p>
              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--cyan-dark)",
                  marginBottom: 16,
                }}
              >
                {pendingDestination?.nom}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                IUTGate a besoin de votre position pour tracer l'itinéraire sur
                la carte. Votre localisation n'est pas enregistrée.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={confirmGeolocation}
                  style={{
                    flex: 1,
                    padding: "13px",
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--cyan-dark)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--cyan)")
                  }
                >
                  Autoriser
                </button>
                <button
                  onClick={() => {
                    setShowGeoModal(false);
                    setPendingDestination(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "13px",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    fontFamily: "var(--font-head)",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
