import db from "../config/db.js";

export const getAllSalles = async () => {
  const [rows] = await db.query("SELECT * FROM salles ORDER BY id DESC");
  return rows;
};

export const getSalleById = async (id) => {
  const [rows] = await db.query("SELECT * FROM salles WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const createSalle = async ({ nom, capacite, type, id_batiment }) => {
  const [result] = await db.query(
    "INSERT INTO salles (nom, capacite, type, id_batiment) VALUES (?, ?, ?, ?)",
    [nom, capacite || null, type || null, id_batiment || null],
  );
  return {
    id: result.insertId,
    nom,
    capacite: capacite || null,
    type: type || null,
    id_batiment: id_batiment || null,
  };
};

export const updateSalle = async (id, salle) => {
  const { nom, capacite, type, id_batiment } = salle;
  const [result] = await db.query(
    "UPDATE salles SET nom = ?, capacite = ?, type = ?, id_batiment = ? WHERE id = ?",
    [nom, capacite || null, type || null, id_batiment || null, id],
  );
  return result;
};

export const deleteSalle = async (id) => {
  const [result] = await db.query("DELETE FROM salles WHERE id = ?", [id]);
  return result;
};
