import db from "../config/db.js";

export const findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);
  return rows[0] ?? null;
};

export const createAdmin = async (admin) => {
  const { nom, email, password } = admin;
  const [result] = await db.query(
    "INSERT INTO admin (nom, email, password) VALUES (?, ?, ?)",
    [nom, email, password],
  );
  return { id: result.insertId, nom, email, password };
};

export const updatePasswordById = async (id, password) => {
  const [result] = await db.query(
    "UPDATE admin SET password = ? WHERE id = ?",
    [password, id],
  );
  return result;
};
