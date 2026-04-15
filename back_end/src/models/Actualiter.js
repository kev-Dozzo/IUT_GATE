import db from "../config/db.js";

export const getAllActualites = async () => {
  const [rows] = await db.query("SELECT * FROM actualites ORDER BY id DESC");
  return rows;
};

export const getActualiteById = async (id) => {
  const [rows] = await db.query("SELECT * FROM actualites WHERE id = ?", [id]);
  return rows[0] ?? null;
};

export const createActualite = async (actualite) => {
  const { titre, contenu, extrait, categorie, image_url } = actualite;
  const [result] = await db.query(
    "INSERT INTO actualites (titre, contenu, extrait, categorie, image_url) VALUES (?, ?, ?, ?, ?)",
    [titre, contenu, extrait || null, categorie, image_url || null],
  );
  return { id: result.insertId, ...actualite };
};

export const updateActualite = async (id, actualite) => {
  const { titre, contenu, extrait, categorie, image_url } = actualite;
  const [result] = await db.query(
    "UPDATE actualites SET titre = ?, contenu = ?, extrait = ?, categorie = ?, image_url = ? WHERE id = ?",
    [titre, contenu, extrait || null, categorie, image_url || null, id],
  );
  return result;
};

export const deleteActualite = async (id) => {
  const [result] = await db.query("DELETE FROM actualites WHERE id = ?", [id]);
  return result;
};

export const countActualites = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM actualites");
  return rows[0]?.count ?? 0;
};
