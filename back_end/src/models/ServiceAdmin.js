import db from "../config/db.js";

export const getAllServicesAdmin = async () => {
  const [rows] = await db.query(
    "SELECT * FROM services_admin ORDER BY id DESC",
  );
  return rows;
};

export const getServiceAdminById = async (id) => {
  const [rows] = await db.query("SELECT * FROM services_admin WHERE id = ?", [
    id,
  ]);
  return rows[0] ?? null;
};

export const createServiceAdmin = async (service) => {
  const { nom, description, horaires, telephone, email, localisation } =
    service;
  const [result] = await db.query(
    "INSERT INTO services_admin (nom, description, horaires, telephone, email, localisation) VALUES (?, ?, ?, ?, ?, ?)",
    [
      nom,
      description,
      horaires,
      telephone || null,
      email || null,
      localisation,
    ],
  );
  return { id: result.insertId, ...service };
};

export const updateServiceAdmin = async (id, service) => {
  const { nom, description, horaires, telephone, email, localisation } =
    service;
  const [result] = await db.query(
    "UPDATE services_admin SET nom = ?, description = ?, horaires = ?, telephone = ?, email = ?, localisation = ? WHERE id = ?",
    [
      nom,
      description,
      horaires,
      telephone || null,
      email || null,
      localisation,
      id,
    ],
  );
  return result;
};

export const deleteServiceAdmin = async (id) => {
  const [result] = await db.query("DELETE FROM services_admin WHERE id = ?", [
    id,
  ]);
  return result;
};

export const countServicesAdmin = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM services_admin");
  return rows[0]?.count ?? 0;
};
