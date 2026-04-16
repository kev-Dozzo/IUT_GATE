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
    res.status(500).json({ message: "Erreur serveur", err });
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
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await ServiceAdministratif.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const svc = await ServiceAdministratif.create(req.body);
    res.status(201).json(svc);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const svc = await ServiceAdministratif.findByPk(req.params.id);
    if (!svc) return res.status(404).json({ message: "Service non trouvé" });
    await svc.update(req.body);
    res.json(svc);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const svc = await ServiceAdministratif.findByPk(req.params.id);
    if (!svc) return res.status(404).json({ message: "Service non trouvé" });
    await svc.destroy();
    res.json({ message: "Service supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
