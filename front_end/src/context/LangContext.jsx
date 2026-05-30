import { createContext, useContext, useState } from "react";
import CalendrierPage from "../pages/Public/CalendrierPage";

const FR = {
  nav: {
    Accueil: "Accueil",
    Actualités: "Actualités",
    filieres: "Filières",
    enseignants: "Enseignants",
    departements: "Départements",
    carte: "Carte",
    services: "Services",
    CalendrierProgramme: "Calendrier & Programme",
    apropos: "À propos",
    aide: "Aide",
  },
  home: {
    hero_sub: "Institut Universitaire de Technologie — Douala, Cameroun",
    hero_title: "Votre portail numérique",
    hero_title2: "IUT de Douala",
    hero_desc:
      "Orientation, formations, enseignants, carte du campus — toutes les informations dont vous avez besoin.",
    btn_filieres: "Explorer les filières",
    btn_carte: "Carte du campus",
    btn_search: "Rechercher",
    actu_title: "Actualités",
    actu_all: "Toutes les actualités",
    dept_title: "Départements",
    dept_all: "Tous les départements",
  },
  common: {
    back: "Retour",
    loading: "Chargement...",
    no_result: "Aucun résultat",
  },
};

const EN = {
  nav: {
    Accueil: "Home",
    Actualités: "News",
    filieres: "Programs",
    enseignants: "Lecturers",
    departements: "Departments",
    services: "Services",
    CalendrierProgramme: "Program & Calendar",
    actualites: "News",
    carte: "Map",
    apropos: "About",
    aide: "Help",
  },
  home: {
    hero_sub: "University Institute of Technology — Douala, Cameroon",
    hero_title: "Your digital GATE",
    hero_title2: "IUT Douala",
    hero_desc:
      "Programs, lecturers, campus map — all the information you need, in one place.",
    btn_filieres: "Explore programs",
    btn_carte: "Campus map",
    btn_search: "Search",
    actu_title: "News",
    actu_all: "All news",
    dept_title: "Departments",
    dept_all: "All departments",
  },
  common: {
    back: "Back",
    loading: "Loading...",
    no_result: "No results found",
  },
};

const LANGS = { fr: FR, en: EN };

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");

  const toggleLang = () => {
    const next = lang === "fr" ? "en" : "fr";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const t = (path) => {
    const keys = path.split(".");
    let val = LANGS[lang];
    for (const k of keys) val = val?.[k];
    return val || path;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
