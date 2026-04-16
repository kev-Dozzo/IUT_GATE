const Filiere = require("../models/Filiere");
const StaffEnseignant = require("../models/Enseignant");
const Departement = require("../models/Departement");

exports.getAll = async (req, res) => {
  try {
    const filieres = await Filiere.findAll({ order: [["nom", "ASC"]] });
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getById = async (req, res) => {
  try {
    const filiere = await Filiere.findByPk(req.params.id, {
      include: [
        {
          model: Departement,
          as: "departement",
          attributes: ["id_departement", "nom"],
        },
        {
          model: StaffEnseignant,
          as: "enseignants",
          attributes: ["id_enseignant", "nom", "role", "poste", "photo_url"],
        },
      ],
    });
    if (!filiere)
      return res.status(404).json({ message: "Filière non trouvée" });
    res.json(filiere);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Filiere.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const filiere = await Filiere.create({
      ...req.body,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      id_admin: req.admin.id_admin,
    });
    res.status(201).json(filiere);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const filiere = await Filiere.findByPk(req.params.id);
    if (!filiere)
      return res.status(404).json({ message: "Filière non trouvée" });
    const updates = { ...req.body };
    if (req.file) updates.photo_url = `/uploads/${req.file.filename}`;
    await filiere.update(updates);
    res.json(filiere);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const filiere = await Filiere.findByPk(req.params.id);
    if (!filiere)
      return res.status(404).json({ message: "Filière non trouvée" });
    await filiere.destroy();
    res.json({ message: "Filière supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
