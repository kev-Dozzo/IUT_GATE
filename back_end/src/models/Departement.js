import db from "../config/db.js";

export const getAllDepartements = async () => {
  const [rows] = await db.query("SELECT * FROM departements ORDER BY id DESC");
  return rows;
};

export const getDepartementById = async (id) => {
  const [rows] = await db.query("SELECT * FROM departements WHERE id = ?", [
    id,
  ]);
  return rows[0] ?? null;
};

export const createDepartement = async ({ nom, description, adminId }) => {
  const [result] = await db.query(
    "INSERT INTO departements (nom, description, id_admin) VALUES (?, ?, ?)",
    [nom, description || null, adminId],
  );
  return {
    id: result.insertId,
    nom,
    description: description || null,
    adminId,
  };
};


export const updateDepartement = async (id, departement) => {
  const { nom, description } = departement;
  const [result] = await db.query(
    "UPDATE departements SET nom = ?, description = ? WHERE id = ?",
    [nom, description || null, id],
  );
  return result;
};

export const deleteDepartement = async (id) => {
  const [result] = await db.query("DELETE FROM departements WHERE id = ?", [
    id,
  ]);
  return result;
};
