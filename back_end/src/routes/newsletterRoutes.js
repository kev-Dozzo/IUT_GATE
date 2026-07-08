const router = require("express").Router();
const Abonne = require("../models/NewsletterAbonne");
const { sendMail, baseTemplate } = require("../config/mailer");
const auth = require("../middlewares/auth");

// S'abonner
router.post("/subscribe", async (req, res) => {
  try {
    const { email, nom } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const [abonne, created] = await Abonne.findOrCreate({
      where: { email },
      defaults: { nom, actif: true },
    });

    if (!created && !abonne.actif) {
      await abonne.update({ actif: true, nom });
    }

    if (created || !abonne.actif) {
      // Email de confirmation
      await sendMail({
        to: email,
        subject: "✅ Abonnement confirmé — Newsletter IUT GATE",
        html: baseTemplate(`
          <h2>Abonnement confirmé !</h2>
          <p>Bonjour ${nom || "cher(e) abonné(e)"} 👋</p>
          <p>Vous êtes maintenant abonné(e) à la newsletter de l'IUT GATE le portail numerique de l'IUT de Douala. Vous recevrez les dernières actualités, filières, services et événements de l'IUT de Douala.</p>
          <a href="https://iut-dla.com" class="btn">Visiter IUT GATE </a>
        `),
      });
    }

    res.json({ message: created ? "Abonnement confirmé" : "Déjà abonné" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Se désabonner
router.get("/unsubscribe", async (req, res) => {
  try {
    const { token } = req.query;
    const abonne = await Abonne.findOne({ where: { token } });
    if (!abonne) return res.status(404).json({ message: "Token invalide" });
    await abonne.update({ actif: false });
    res.json({ message: "Désabonnement effectué" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Liste des abonnés (admin)
router.get("/list", auth, async (req, res) => {
  try {
    const abonnes = await Abonne.findAll({
      where: { actif: true },
      order: [["createdAt", "DESC"]],
    });
    res.json(abonnes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
