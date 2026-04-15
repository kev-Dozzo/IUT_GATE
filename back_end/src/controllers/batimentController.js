import {
  getAllBatiments,
  getBatimentById,
  createBatiment,
  updateBatiment,
  deleteBatiment,
} from "../models/Batiment.js";

export const getAllBatiment = async (req, res, next) => {
  try {
    const rows = await getAllBatiments();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleBatiment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const batiment = await getBatimentById(id);
    if (!batiment) {
      return res.status(404).json({ message: "Bâtiment introuvable" });
    }

    res.status(200).json(batiment);
  } catch (err) {
    next(err);
  }
};

export const addBatiment = async (req, res, next) => {
  try {
    const { nom, description, latitude, longitude } = req.body;

    if (!nom) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const batiment = await createBatiment({
      nom,
      description,
      latitude,
      longitude,
    });
    res.status(201).json(batiment);
  } catch (err) {
    next(err);
  }
};

export const updateBatimentController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, description, latitude, longitude } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    if (!nom) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const result = await updateBatiment(id, {
      nom,
      description,
      latitude,
      longitude,
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bâtiment introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      description: description || null,
      latitude: latitude || null,
      longitude: longitude || null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBatimentController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteBatiment(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bâtiment introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
