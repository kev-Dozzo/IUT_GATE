import ReactGA from "react-ga4";

// ← Tu mettras ton vrai ID après avoir créé la propriété GA4
const GA_ID = "G-Q6R2643TMK";

export const initGA = () => {
  // N'active qu'en production
  if (import.meta.env.PROD) {
    ReactGA.initialize(GA_ID);
  }
};

export const trackPage = (path) => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};
