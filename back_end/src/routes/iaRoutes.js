const router = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const resolveAdminToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

router.post("/debouches", async (req, res) => {
  const authAdmin = resolveAdminToken(req);

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt requis" });

    const genericMessage =
      "Service IA temporairement indisponible. Réessayez dans quelques instants.";

    // ── Vérifie que la clé existe ──
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("❌ ANTHROPIC_API_KEY manquante dans .env");
      const responseBody = { message: genericMessage };
      if (authAdmin) responseBody.detail = "Clé API Anthropic manquante";
      return res.status(503).json(responseBody);
    }

    console.log("🤖 Appel API Anthropic...");

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    console.log("✅ Réponse reçue");
    res.json(response.data);
  } catch (err) {
    // ── Log détaillé interne seulement ──
    console.error("❌ Erreur IA:");
    console.error("Status:", err.response?.status);
    console.error("Data:", JSON.stringify(err.response?.data, null, 2));
    console.error("Message:", err.message);

    const responseBody = { message: genericMessage };
    if (authAdmin) {
      responseBody.detail = err.response?.data || err.message;
    }

    res.status(502).json(responseBody);
  }
});

router.get("/status", async (req, res) => {
  const authAdmin = resolveAdminToken(req);
  const genericMessage =
    "Service IA temporairement indisponible. Réessayez dans quelques instants.";

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY manquante dans .env");
    const responseBody = { healthy: false, message: genericMessage };
    if (authAdmin) responseBody.detail = "Clé API Anthropic manquante";
    return res.status(503).json(responseBody);
  }

  try {
    await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1,
        messages: [
          {
            role: "user",
            content:
              "Vérifie la disponibilité du service IA. Réponds simplement OK.",
          },
        ],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    res.json({ healthy: true, message: "Service IA disponible" });
  } catch (err) {
    console.error("❌ Erreur statut IA:");
    console.error("Status:", err.response?.status);
    console.error("Data:", JSON.stringify(err.response?.data, null, 2));
    console.error("Message:", err.message);

    const responseBody = { healthy: false, message: genericMessage };
    if (authAdmin) {
      responseBody.detail = err.response?.data || err.message;
    }

    res.status(502).json(responseBody);
  }
});

module.exports = router;
