import {
  getAllActualites,
  getActualiteById,
  createActualite,
  updateActualite as updateActualiteModel,
  deleteActualite as deleteActualiteModel,
  countActualites,
} from "../models/Actualiter.js";

export const getAllActualiter = async (req, res, next) => {
  try {
    const rows = await getAllActualites();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleActualiter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const actualite = await getActualiteById(id);

    if (!actualite) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    res.status(200).json(actualite);
  } catch (err) {
    next(err);
  }
};

export const addActualiter = async (req, res, next) => {
  try {
    const { titre, contenu, extrait, categorie, image_url } = req.body;

    if (!titre || !contenu || !categorie) {
      return res.status(400).json({ message: "champ Obligatoires" });
    }

    const actualite = await createActualite({
      titre,
      contenu,
      extrait: extrait || null,
      categorie,
      image_url: image_url || null,
    });

    res.status(201).json(actualite);
  } catch (err) {
    next(err);
  }
};

export const updateActualiter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { titre, contenu, extrait, categorie, image_url } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!titre || !contenu || !categorie) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const result = await updateActualiteModel(id, {
      titre,
      contenu,
      extrait: extrait || null,
      categorie,
      image_url: image_url || null,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    res.status(200).json({
      id,
      titre,
      contenu,
      extrait: extrait || null,
      categorie,
      image_url: image_url || null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteActualiter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteActualiteModel(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actualiter introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getAnnonceCount = async (req, res, next) => {
  try {
    const count = await countActualites();
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};
