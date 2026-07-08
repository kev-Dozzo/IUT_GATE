const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminActivity = sequelize.define(
  "AdminActivity",
  {
    id_activity: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_admin: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity_type: { type: DataTypes.STRING(50) },
    entity_id: { type: DataTypes.INTEGER },
    entity_name: { type: DataTypes.STRING(255) },
    details: { type: DataTypes.TEXT },
    ip_address: { type: DataTypes.STRING(45) },
  },
  {
    tableName: "admin_activities",
    timestamps: true,
    updatedAt: false,
  },
);

// Association
AdminActivity.associate = (models) => {
  AdminActivity.belongsTo(models.Admin, {
    foreignKey: "id_admin",
    as: "admin",
  });
};

module.exports = AdminActivity;
