import db from "../config/db.js";

export const getAllBatiments = async () => {
  const [rows] = await db.query("SELECT * FROM batiments ORDER BY id DESC");
  return rows;
};

export const getBatimentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM batiments WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const createBatiment = async ({
  nom,
  description,
  latitude,
  longitude,
}) => {
  const [result] = await db.query(
    "INSERT INTO batiments (nom, description, latitude, longitude) VALUES (?, ?, ?, ?)",
    [nom, description || null, latitude || null, longitude || null],
  );
  return {
    id: result.insertId,
    nom,
    description: description || null,
    latitude: latitude || null,
    longitude: longitude || null,
  };
};

export const updateBatiment = async (id, batiment) => {
  const { nom, description, latitude, longitude } = batiment;
  const [result] = await db.query(
    "UPDATE batiments SET nom = ?, description = ?, latitude = ?, longitude = ? WHERE id = ?",
    [nom, description || null, latitude || null, longitude || null, id],
  );
  return result;
};

export const deleteBatiment = async (id) => {
  const [result] = await db.query("DELETE FROM batiments WHERE id = ?", [id]);
  return result;
};
