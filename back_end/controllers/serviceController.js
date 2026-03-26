const { ServiceAdministratif } = require("../models/ServiceAdministratif");

exports.getAll = async (req, res) => {
  try {
    const services = await ServiceAdministratif.findAll({
      order: [["nom", "ASC"]],
    });
    res.json(services);
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
