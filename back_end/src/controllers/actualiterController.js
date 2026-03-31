import db from "../config/db.js";

export const getAllActualiter = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM actualites ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getSingleActualiter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const [rows] = await db.query(
      "SELECT * FROM actualites WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const addActualiter = async (req, res, next) => {
  try {
    const { titre, contenu, extrait, categorie, image_url } = req.body;

    if (!titre || !contenu || !categorie) {
      return res.status(400).json({ message: "champ Obligatoires" });
    }

    const [result] = await db.query(
      "INSERT INTO actualites (titre, contenu, extrait, categorie, image_url) VALUES(?,?,?,?,?)",
      [titre, contenu, extrait || null, categorie, image_url || null],
    );

    res.status(201).json({
      id: result.insertId,
      titre,
      contenu,
      extrait: extrait || null,
      categorie,
      image_url: image_url || null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateActualiter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { titre, contenu, extrait, categorie, image_url } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!titre || !contenu || !categorie) {
      return res
        .status(400)
        .json({ message: "Remplisez tout les Champ disponible" });
    }

    const [result] = await db.query(
      "UPDATE actualites SET titre=?, contenu=?, extrait=?, categorie=?, image_url=? WHERE id=?",
      [titre, contenu, extrait || null, categorie, image_url || null, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    res.status(200).json({
      id,
      titre,
      contenu,
      extrait: extrait || null,
      categorie,
      image_url: image_url || null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteActualiter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db.query("DELETE FROM actualites WHERE id=?", [id]);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actualiter introuvable" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
