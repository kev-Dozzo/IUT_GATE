const CalendrierEvenement = require("../models/CalendrierEvenement");
const logActivity = require("../utils/logActivity");
const { sendNewsletter } = require("../config/mailer");
const NewsletterAbonne = require("../models/NewsletterAbonne");

exports.getAll = async (req, res) => {
  try {
    const { cycle } = req.query;
    const where = {};
    if (cycle && cycle !== "tous")
      where.cycle = { [require("sequelize").Op.in]: [cycle, "tous"] };
    const events = await CalendrierEvenement.findAll({
      where,
      order: [["date_debut", "ASC"]],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const e = await CalendrierEvenement.create({
      ...req.body,
      id_admin: req.admin?.id_admin,
    });

    NewsletterAbonne.findAll({ where: { actif: true } }).then((abonnes) => {
      if (abonnes.length > 0) {
        sendNewsletter(
          abonnes,
          "Nouvelle actualité",
          e.titre,
          e.contenu?.slice(0, 150),
          `https://iut-dla.com/calendrier/${e.id_evenement}`,
        );
      }
    });

    await logActivity(req, "CREATE", "calendrier", e.id_evenement, e.titre);
    res.status(201).json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const e = await CalendrierEvenement.findByPk(req.params.id);
    if (!e) return res.status(404).json({ message: "Introuvable" });
    await e.update(req.body);
    await logActivity(req, "UPDATE", "calendrier", e.id_evenement, e.titre);
    res.json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const e = await CalendrierEvenement.findByPk(req.params.id);
    if (!e) return res.status(404).json({ message: "Introuvable" });
    await logActivity(req, "DELETE", "calendrier", e.id_evenement, e.titre);
    await e.destroy();
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
