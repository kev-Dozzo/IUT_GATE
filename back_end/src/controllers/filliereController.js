import {
  getAllFilieres,
  getFiliereById,
  createFiliere,
  updateFiliere as updateFiliereModel,
  deleteFiliere as deleteFiliereModel,
  countFilieres,
} from "../models/Filiere.js";

export const getAllFilliere = async (req, res, next) => {
  try {
    const rows = await getAllFilieres();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleFilliere = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const filiere = await getFiliereById(id);

    if (!filiere) {
      return res.status(404).json({ message: "Filière introuvable" });
    }

    res.status(200).json(filiere);
  } catch (err) {
    next(err);
  }
};

export const addFilliere = async (req, res, next) => {
  try {
    const { nom, code, description, duree, debouches } = req.body;

    if (!nom || !code || !description || !duree) {
      return res.status(400).json({ message: "nom et code sont Obligatoires" });
    }

    const filiere = await createFiliere({
      nom,
      code,
      description,
      duree,
      debouches: debouches || null,
    });

    res.status(201).json(filiere);
  } catch (err) {
    next(err);
  }
};

export const updateFilliere = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, code, description, duree, debouches } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!nom || !code || !description || !duree) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const result = await updateFiliereModel(id, {
      nom,
      code,
      description,
      duree,
      debouches: debouches || null,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Filière introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      code,
      description,
      duree,
      debouches: debouches || null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFilliere = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteFiliereModel(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Filière introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getFilliereCount = async (req, res, next) => {
  try {
    const count = await countFilieres();
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};
