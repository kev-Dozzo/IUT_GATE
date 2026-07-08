const Programme = require("../models/Programme");
const logActivity = require("../utils/logActivity");
const { sendNewsletter } = require("../config/mailer");
const NewsletterAbonne = require("../models/NewsletterAbonne");

exports.getAll = async (req, res) => {
  try {
    const { cycle } = req.query;
    const where = { actif: true };
    if (cycle && cycle !== "tous") where.cycle = cycle;
    const programmes = await Programme.findAll({
      where,
      order: [
        ["cycle", "ASC"],
        ["ordre", "ASC"],
        ["nom", "ASC"],
      ],
    });
    res.json(programmes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const programmes = await Programme.findAll({
      order: [
        ["cycle", "ASC"],
        ["ordre", "ASC"],
      ],
    });
    res.json(programmes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      nom,
      description,
      cycle,
      departement,
      lien_cours,
      lien_externe,
      ordre,
    } = req.body;
    const p = await Programme.create({
      nom,
      description,
      cycle,
      departement,
      lien_cours,
      lien_externe,
      ordre: ordre || 0,
      id_admin: req.admin?.id_admin,
    });
    NewsletterAbonne.findAll({ where: { actif: true } }).then((abonnes) => {
      if (abonnes.length > 0) {
        sendNewsletter(
          abonnes,
          "Nouveau programme",
          p.nom,
          p.description?.slice(0, 150),
          `https://iut-dla.com/calendrier/${p.id_programme}`,
        );
      }
    });

    await logActivity(req, "CREATE", "programme", p.id_programme, p.nom);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const p = await Programme.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "Introuvable" });
    await p.update(req.body);
    await logActivity(req, "UPDATE", "programme", p.id_programme, p.nom);
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const p = await Programme.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "Introuvable" });
    await logActivity(req, "DELETE", "programme", p.id_programme, p.nom);
    await p.destroy();
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
