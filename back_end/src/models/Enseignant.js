import db from "../config/db.js";

export const getAllEnseignants = async () => {
  const [rows] = await db.query(
    "SELECT enseignants.*, filieres.nom AS filiere_nom FROM enseignants LEFT JOIN filieres ON enseignants.filiere_id = filieres.id ORDER BY enseignants.id DESC",
  );
  return rows;
};

export const getEnseignantById = async (id) => {
  const [rows] = await db.query("SELECT * FROM enseignants WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const createEnseignant = async (enseignant) => {
  const { nom, prenom, email, telephone, bureau, matiere, filiere_id } =
    enseignant;
  const [result] = await db.query(
    "INSERT INTO enseignants (nom, prenom, email, telephone, bureau, matiere, filiere_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
  return { id: result.insertId, ...enseignant };
};

export const updateEnseignant = async (id, enseignant) => {
  const { nom, prenom, email, telephone, bureau, matiere, filiere_id } =
    enseignant;
  const [result] = await db.query(
    "UPDATE enseignants SET nom = ?, prenom = ?, email = ?, telephone = ?, bureau = ?, matiere = ?, filiere_id = ? WHERE id = ?",
    [
      nom,
      prenom,
      email,
      telephone || null,
      bureau || null,
      matiere || null,
      filiere_id || null,
      id,
    ],
  );
  return result;
};

export const deleteEnseignant = async (id) => {
  const [result] = await db.query("DELETE FROM enseignants WHERE id = ?", [id]);
  return result;
};

export const countEnseignants = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM enseignants");
  return rows[0]?.count ?? 0;
};
