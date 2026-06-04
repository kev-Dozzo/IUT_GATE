const Filiere = require("../models/Filiere");
const Departement = require("../models/Departement");
const StaffEnseignant = require("../models/Enseignant");

exports.getAll = async (req, res) => {
  try {
    const filieres = await Filiere.findAll({
      order: [["nom", "ASC"]],
      include: [
        {
          model: Departement,
          as: "departement",
          attributes: ["id_departement", "nom"],
        },
      ],
    });
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
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
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Filiere.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    // 🔍 LOGS DE DEBUG
    console.log('📥 Body reçu:', req.body)
    console.log('👤 Admin connecté:', req.admin)
    console.log('📁 Fichier reçu:', req.file)

    const {
      nom,
      description,
      duree,
      condition_admission,
      places,
      id_departement,
    } = req.body

    if (!nom) {
      return res.status(400).json({ message: "Nom obligatoire" })
    }

    const filiere = await Filiere.create({
      nom,
      description: description || null,
      duree: duree || null,
      condition_admission: condition_admission || null,
      places: places || null,
      id_departement: id_departement || null,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      id_admin: req.admin.id_admin
    })

    res.status(201).json(filiere)

  } catch (err) {
    // 🔍 AFFICHE L'ERREUR DANS LE TERMINAL
    console.error('❌ Erreur create filiere:', err.message)
    console.error('❌ Détail complet:', err)
    res.status(500).json({ message: "Erreur serveur", err: err.message })
  }
}

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
    res.status(500).json({ message: "Erreur serveur", err: err.message });
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
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};
