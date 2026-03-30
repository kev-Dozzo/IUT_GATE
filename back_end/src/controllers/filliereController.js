import db from "../config/db.js";

// AFfiche tout les Filliere /api/filieres
export const getAllFilliere = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM filieres ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (err) {
    //res.status(500).json({ message: "Erreur au niveux du serveur..." });
    next(err);
  }
};

//get single Filliere via Filliere id

export const getSingleFilliere = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await db.query("SELECT * FROM filieres WHERE id = ?", [id]);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Filière introuvable" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    //res.status(500).json({ message: "Internal server Error..." });
    next(err);
  }
};

//Post Request to Create new Filliere
export const addFilliere = async (req, res, next) => {
  try {
    const { nom, code, description, duree, debouches } = req.body;

    if (!nom || !code || !description || !duree) {
      return res.status(400).json({ message: "nom et code sont Obligatoires" });
    }

    const [result] = await db.query(
      "INSERT INTO filieres (nom, code, description, duree, debouches) VALUES(?,?,?,?,?)",
      [nom, code, description, duree, debouches || null],
    );

    res.status(201).json({
      id: result.insertId,
      nom,
      code,
      description: description || null,
      duree,
      debouches: debouches || null,
    });
  } catch (err) {
    // res.status(500).json({ message: "Internal server Error..." });
    next(err);
  }
};

//put request To Update Filiere

export const updateFilliere = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, code, description, duree, debouches } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!nom || !code || !description || !duree) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const [result] = await db.query(
      "UPDATE filieres SET nom =?, code=?, description=?, duree=?,debouches=? WHERE id =?",
      [nom, code, description, duree, debouches, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Filière introuvable" });
    }

    res.status(200).json({
      id,
      nom,
      code,
      description,
      duree,
      debouches,
    });
  } catch (err) {
    // res.status(500).json({ message: "Internal server Error..." });
    next(err);
  }
};

//DElete Request

export const deleteFilliere = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("DELETE FROM filieres WHERE id=?", [id]);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Filière introuvable" });
    }
    res.status(204).send();
  } catch (err) {
    //res.status(500).json({ message: "Internal server Error..." });
    next(err);
  }
};
