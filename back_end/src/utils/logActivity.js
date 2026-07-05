const AdminActivity = require("../models/AdminActivity");

const logActivity = async (
  req,
  action,
  entityType = null,
  entityId = null,
  entityName = null,
  details = null,
) => {
  try {
    await AdminActivity.create({
      id_admin: req.admin?.id_admin || null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      details,
      ip_address: req.ip || req.connection?.remoteAddress,
    });
  } catch (err) {
    console.error("Erreur log activité:", err.message);
  }
};

module.exports = logActivity;
