const ServiceAdministratif = require("../models/ServiceAdmin");
const Batiment = require("../models/Batiment");

exports.getAll = async (req, res) => {
  try {
    const services = await ServiceAdministratif.findAll({
      order: [["nom", "ASC"]],
      include: [
        {
          model: Batiment,
          as: "batiment",
          attributes: ["id_batiment", "nom", "latitude", "longitude"],
        },
      ],
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const svc = await ServiceAdministratif.findByPk(req.params.id, {
      include: [{ model: Batiment, as: "batiment" }],
    });
    if (!svc) return res.status(404).json({ message: "Service non trouvé" });
    res.json(svc);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await ServiceAdministratif.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, description, contact, id_batiment } = req.body;
    if (!nom) return res.status(400).json({ message: "Nom obligatoire" });
    const svc = await ServiceAdministratif.create({
      nom,
      description,
      contact,
      id_batiment,
    });
    res.status(201).json(svc);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const svc = await ServiceAdministratif.findByPk(req.params.id);
    if (!svc) return res.status(404).json({ message: "Service non trouvé" });
    await svc.update(req.body);
    res.json(svc);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const svc = await ServiceAdministratif.findByPk(req.params.id);
    if (!svc) return res.status(404).json({ message: "Service non trouvé" });
    await svc.destroy();
    res.json({ message: "Service supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};
