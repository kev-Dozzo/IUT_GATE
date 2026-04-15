import {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
} from "../models/Salle.js";

export const getAllSalle = async (req, res, next) => {
  try {
    const rows = await getAllSalles();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleSalle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const salle = await getSalleById(id);
    if (!salle) {
      return res.status(404).json({ message: "Salle introuvable" });
    }

    res.status(200).json(salle);
  } catch (err) {
    next(err);
  }
};

export const addSalle = async (req, res, next) => {
  try {
    const { nom, capacite, type, id_batiment } = req.body;

    if (!nom) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const salle = await createSalle({
      nom,
      capacite,
      type,
      id_batiment,
    });
    res.status(201).json(salle);
  } catch (err) {
    next(err);
  }
};

export const updateSalleController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, capacite, type, id_batiment } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    if (!nom) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const result = await updateSalle(id, {
      nom,
      capacite,
      type,
      id_batiment,
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Salle introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      capacite: capacite || null,
      type: type || null,
      id_batiment: id_batiment || null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSalleController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteSalle(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Salle introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
