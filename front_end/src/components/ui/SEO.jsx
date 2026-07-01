import { Helmet } from "react-helmet-async";
import { PRIMARY_SITE_URL, SITE_URLS } from "../../config/constants";

const DEFAULT = {
  title: "IUT GATE - Portail Numérique de l'IUT de Douala",
  description:
    "Orientez-vous, trouvez vos filières, enseignants et informations sur le campus de l'IUT de Douala.",
  url: PRIMARY_SITE_URL,
  image: `${PRIMARY_SITE_URL}/logo.png`,
};

export default function SEO({
  title,
  description,
  url,
  image,
  type = "website",
}) {
  const t = title ? `${title} - IUT GATE` : DEFAULT.title;
  const d = description || DEFAULT.description;
  const u = url || DEFAULT.url;
  const img = image || DEFAULT.image;
  const fallbackSite =
    SITE_URLS.find((site) => site !== PRIMARY_SITE_URL) || SITE_URLS[0];
  const alternateUrl = u.replace(PRIMARY_SITE_URL, fallbackSite);

  return (
    <Helmet>
      {/* ── Basique ── */}
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={u} />
      <link rel="alternate" href={alternateUrl} hrefLang="fr" />
      <html lang="fr" />

      {/* ── Open Graph (Facebook, WhatsApp) ── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={u} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="fr_CM" />
      <meta property="og:site_name" content="IUT GATE" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />

      {/* ── Géo Cameroun ── */}
      <meta name="geo.region" content="CM-LT" />
      <meta name="geo.placename" content="Douala, Cameroun" />
    </Helmet>
  );
}
