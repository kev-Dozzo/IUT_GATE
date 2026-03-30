import db from "../config/db.js";

export const getAllEnseignant = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT enseignants.*, filieres.nom AS filiere_nom FROM enseignants LEFT JOIN filieres ON enseignants.filiere_id = filieres.id ORDER BY enseignants.id DESC",
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching enseignants:", err.message);
    next(err);
  }
};

export const getSingleEnseignant = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await db.query("SELECT * FROM enseignants WHERE id = ?", [
      id,
    ]);
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "enseignant introuvable" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching enseignants:", err.message);
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

    const [result] = await db.query(
      "INSERT INTO enseignants (nom, prenom, email, telephone, bureau, matiere, filiere_id) VALUES(?,?,?,?,?,?,?)",
      [
        nom,
        prenom,
        email,
        telephone || null,
        bureau || null,
        matiere || null,
        filiere_id || null,
      ],
    );

    res.status(201).json({
      id: result.insertId,
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

    const [result] = await db.query(
      "UPDATE enseignants SET nom =?, prenom=?, email=?, telephone=?,bureau=?, matiere=?, filiere_id=? WHERE id =?",
      [nom, prenom, email, telephone, bureau, matiere, filiere_id, id],
    );

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
    const [result] = await db.query("DELETE FROM enseignants WHERE id=?", [id]);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Enseignant  introuvable" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
