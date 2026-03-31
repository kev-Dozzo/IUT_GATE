import db from "../config/db.js";

export const getAllService = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM services_admin ORDER BY id DESC",
    );

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
   
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
     const [rows] = await db.query("SELECT * FROM services_admin WHERE id = ?", [
      id,
    ]);


    if (rows.length === 0) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const addService = async (req, res, next) => {
  try {
    const { nom, description, horaires, telephone, email, localisation } =
      req.body;

    if (!nom || !description || !horaires || !localisation) {
      return res.status(400).json({ message: "champs Obligatoires" });
    }

    const [result] = await db.query(
      "INSERT INTO services_admin (nom, description, horaires, telephone,email,localisation) VALUES(?,?,?,?,?,?)",
      [
        nom,
        description,
        horaires,
        telephone || null,
        email || null,
        localisation,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      nom,
      description,
      horaires,
      telephone: telephone || null,
      email: email || null,
      localisation,
    });
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, description, horaires, telephone, email, localisation } =
      req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!nom || !description || !horaires || !localisation) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const [result] = await db.query(
      "UPDATE services_admin SET nom =?, description=?, horaires=?, telephone=?,email=?, localisation=? WHERE id =?",
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

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Services introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      description,
      horaires,
      telephone: telephone || null,
      email: email || null,
      localisation,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

       if(!id || isNaN(id)){
        return res.status(400).json({ message: "Invalid ID" });
    }

    const [result] = await db.query('DELETE FROM services_admin WHERE id=?', [id])

    if(result.affectedRows ===0){
         return res.status(404).json({ message: "Services introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
