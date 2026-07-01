export const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

export const SITE_URLS = ["https://iut-dla.com", "https://iutgate.vercel.app"];

export const PRIMARY_SITE_URL = import.meta.env.VITE_SITE_URL || SITE_URLS[0];
