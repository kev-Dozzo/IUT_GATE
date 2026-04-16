const StaffEnseignant = require("../models/Enseignant");
const Departement = require("../models/Departement");
const Batiment = require("../models/Batiment");

exports.getAll = async (req, res) => {
  try {
    const enseignants = await StaffEnseignant.findAll({
      order: [["nom", "ASC"]],
      include: [
        {
          model: Departement,
          as: "departement",
          attributes: ["id_departement", "nom"],
        },
      ],
    });
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getById = async (req, res) => {
  try {
    const ens = await StaffEnseignant.findByPk(req.params.id, {
      include: [
        {
          model: Departement,
          as: "departement",
          attributes: ["id_departement", "nom"],
        },
        {
          model: Batiment,
          as: "batiment",
          attributes: ["id_batiment", "nom", "latitude", "longitude"],
        },
      ],
    });
    if (!ens) return res.status(404).json({ message: "Enseignant non trouvé" });
    res.json(ens);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await StaffEnseignant.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const ens = await StaffEnseignant.create({
      ...req.body,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      created_by_admin: req.admin.id_admin,
    });
    res.status(201).json(ens);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const ens = await StaffEnseignant.findByPk(req.params.id);
    if (!ens) return res.status(404).json({ message: "Enseignant non trouvé" });
    const updates = { ...req.body };
    if (req.file) updates.photo_url = `/uploads/${req.file.filename}`;
    await ens.update(updates);
    res.json(ens);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const ens = await StaffEnseignant.findByPk(req.params.id);
    if (!ens) return res.status(404).json({ message: "Enseignant non trouvé" });
    await ens.destroy();
    res.json({ message: "Enseignant supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
