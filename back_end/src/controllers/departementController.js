import {
  getAllDepartements,
  getDepartementById,
  createDepartement,
  updateDepartement,
  deleteDepartement,
} from "../models/Departement.js";

export const getAllDepartement = async (req, res, next) => {
  try {
    const rows = await getAllDepartements();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleDepartement = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const departement = await getDepartementById(id);
    if (!departement) {
      return res.status(404).json({ message: "Département introuvable" });
    }

    res.status(200).json(departement);
  } catch (err) {
    next(err);
  }
};

export const addDepartement = async (req, res, next) => {
  try {
    console.log("body recu:", req.body);

    const { nom, description } = req.body;
    const adminId = req.user?.id || req.session?.admin?.id;

    if (!nom) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const departement = await createDepartement({ nom, description, adminId });
    res.status(201).json(departement);
  } catch (err) {
    console.error("ERREUR CONTROLLER :", err);
    next(err);
  }
};


export const updateDepartementController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, description } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    if (!nom) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const result = await updateDepartement(id, { nom, description });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Département introuvable" });
    }

    res.status(200).json({ id, nom, description });
  } catch (err) {
    next(err);
  }
};

export const deleteDepartementController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteDepartement(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Département introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


