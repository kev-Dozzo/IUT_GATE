const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/debouches", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt requis" });

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY manquante");
      return res.status(500).json({ message: "Clé API manquante" });
    }

    console.log("🤖 Appel Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // ← Essaie ces modèles dans l'ordre jusqu'à ce que ça marche
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("✅ Gemini OK");
    res.json({ content: [{ text }] });
  } catch (err) {
    console.error("❌ Gemini erreur:", err.message);
    // Log complet pour débug
    if (err.message.includes("not found")) {
      console.error(
        "→ Modèle introuvable. Essaie gemini-pro ou gemini-1.5-pro",
      );
    }
    res.status(500).json({ message: "Erreur IA", detail: err.message });
  }
});

module.exports = router;
