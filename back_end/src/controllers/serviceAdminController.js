import {
  getAllServicesAdmin,
  getServiceAdminById,
  createServiceAdmin,
  updateServiceAdmin as updateServiceAdminModel,
  deleteServiceAdmin as deleteServiceAdminModel,
  countServicesAdmin,
} from "../models/ServiceAdmin.js";

export const getAllService = async (req, res, next) => {
  try {
    const rows = await getAllServicesAdmin();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const service = await getServiceAdminById(id);

    if (!service) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    res.status(200).json(service);
  } catch (err) {
    next(err);
  }
};

export const addService = async (req, res, next) => {
  try {
    const { nom, description, horaires, telephone, email, localisation } =
      req.body;

    if (!nom || !description || !horaires || !localisation) {
      return res.status(400).json({ message: "champs Obligatoires" });
    }

    const service = await createServiceAdmin({
      nom,
      description,
      horaires,
      telephone: telephone || null,
      email: email || null,
      localisation,
    });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, description, horaires, telephone, email, localisation } =
      req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!nom || !description || !horaires || !localisation) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const result = await updateServiceAdminModel(id, {
      nom,
      description,
      horaires,
      telephone: telephone || null,
      email: email || null,
      localisation,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Services introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      description,
      horaires,
      telephone: telephone || null,
      email: email || null,
      localisation,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteServiceAdminModel(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Services introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getServiceCount = async (req, res, next) => {
  try {
    const count = await countServicesAdmin();
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};
