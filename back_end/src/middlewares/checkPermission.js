const checkPermission = (permission) => {
  return (req, res, next) => {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Super admin a tout
    if (admin.role === "super_admin" || admin.permissions?.includes("all")) {
      return next();
    }

    // Vérifie la permission spécifique
    if (admin.permissions?.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      message: `Accès refusé — permission "${permission}" requise`,
    });
  };
};

module.exports = checkPermission;
