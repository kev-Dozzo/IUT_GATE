const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token manquant" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = {
      id_admin: decoded.id_admin,
      role: decoded.role || "editeur",
      permissions: decoded.permissions || [],
    };
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};
