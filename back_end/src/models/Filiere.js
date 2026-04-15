import db from "../config/db.js";

export const getAllFilieres = async () => {
  const [rows] = await db.query("SELECT * FROM filieres ORDER BY id DESC");
  return rows;
};

export const getFiliereById = async (id) => {
  const [rows] = await db.query("SELECT * FROM filieres WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const createFiliere = async (filiere) => {
  const { nom, code, description, duree, debouches } = filiere;
  const [result] = await db.query(
    "INSERT INTO filieres (nom, code, description, duree, debouches) VALUES (?, ?, ?, ?, ?)",
    [nom, code, description, duree, debouches || null],
  );
  return { id: result.insertId, ...filiere };
};

export const updateFiliere = async (id, filiere) => {
  const { nom, code, description, duree, debouches } = filiere;
  const [result] = await db.query(
    "UPDATE filieres SET nom = ?, code = ?, description = ?, duree = ?, debouches = ? WHERE id = ?",
    [nom, code, description, duree, debouches || null, id],
  );
  return result;
};

export const deleteFiliere = async (id) => {
  const [result] = await db.query("DELETE FROM filieres WHERE id = ?", [id]);
  return result;
};

export const countFilieres = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM filieres");
  return rows[0]?.count ?? 0;
};
