const Departement = require("../models/Departement");
const StaffEnseignant = require("../models/Enseignant");
const Filiere = require("../models/Filiere");

exports.getAll = async (req, res) => {
  try {
    const depts = await Departement.findAll({ order: [["nom", "ASC"]] });
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const dept = await Departement.findByPk(req.params.id, {
      include: [
        {
          model: Filiere,
          as: "filieres",
          attributes: ["id_filiere", "nom", "duree"],
        },
        {
          model: StaffEnseignant,
          as: "enseignants",
          attributes: ["id_enseignant", "nom", "role", "poste", "photo_url"],
        },
      ],
    });
    if (!dept)
      return res.status(404).json({ message: "Département non trouvé" });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, description } = req.body;
    if (!nom) return res.status(400).json({ message: "Nom obligatoire" });
    const dept = await Departement.create({
      nom,
      description,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      id_admin: req.admin.id_admin,
    });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const dept = await Departement.findByPk(req.params.id);
    if (!dept)
      return res.status(404).json({ message: "Département non trouvé" });
    const updates = { ...req.body };
    if (req.file) updates.photo_url = `/uploads/${req.file.filename}`;
    await dept.update(updates);
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const dept = await Departement.findByPk(req.params.id);
    if (!dept)
      return res.status(404).json({ message: "Département non trouvé" });
    await dept.destroy();
    res.json({ message: "Département supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};
