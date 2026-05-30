import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPage } from "./utils/analytics";
import AppRoutes from "./routes/AppRoutes";

// Init une seule fois
initGA();

export default function App() {
  const location = useLocation();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location.pathname]);

  return <AppRoutes />;
}
