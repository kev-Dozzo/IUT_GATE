import {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant as updateEnseignantModel,
  deleteEnseignant as deleteEnseignantModel,
  countEnseignants,
} from "../models/Enseignant.js";

export const getAllEnseignant = async (req, res, next) => {
  try {
    const rows = await getAllEnseignants();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleEnseignant = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const enseignant = await getEnseignantById(id);

    if (!enseignant) {
      return res.status(404).json({ message: "enseignant introuvable" });
    }

    res.status(200).json(enseignant);
  } catch (err) {
    next(err);
  }
};

export const addEnseignant = async (req, res, next) => {
  try {
    const { nom, prenom, email, telephone, bureau, matiere, filiere_id } =
      req.body;

    if (!nom || !prenom || !email || !matiere) {
      return res.status(400).json({ message: "champ Obligatoires" });
    }

    const enseignant = await createEnseignant({
      nom,
      prenom,
      email,
      telephone: telephone || null,
      bureau: bureau || null,
      matiere: matiere || null,
      filiere_id: filiere_id || null,
    });

    res.status(201).json(enseignant);
  } catch (err) {
    next(err);
  }
};

export const updateEnseignant = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, prenom, email, telephone, bureau, matiere, filiere_id } =
      req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!nom || !prenom || !email || !matiere) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const result = await updateEnseignantModel(id, {
      nom,
      prenom,
      email,
      telephone: telephone || null,
      bureau: bureau || null,
      matiere: matiere || null,
      filiere_id: filiere_id || null,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Enseignant introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      prenom,
      email,
      telephone: telephone || null,
      bureau: bureau || null,
      matiere: matiere || null,
      filiere_id: filiere_id || null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEnseignant = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteEnseignantModel(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Enseignant  introuvable" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getEnseignantCount = async (req, res, next) => {
  try {
    const count = await countEnseignants();
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};
