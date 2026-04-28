const Departement = require("../models/Departement");
const StaffEnseignant = require("../models/Enseignant");
const Filiere = require("../models/Filiere");
const sequelize = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const depts = await Departement.findAll({
      order: [["nom", "ASC"]],
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Enseignants.id_enseignant")),
            "enseignants_count",
          ],
          [
            sequelize.fn("COUNT", sequelize.col("Filieres.id_filiere")),
            "filieres_count",
          ],
        ],
      },
    });
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
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
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Departement.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const dept = await Departement.create({
      ...req.body,
      id_admin: req.admin.id_admin,
    });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const dept = await Departement.findByPk(req.params.id);
    if (!dept)
      return res.status(404).json({ message: "Département non trouvé" });
    await dept.update(req.body);
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
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
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
