const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define(
  "Admin",
  {
    id_admin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    mot_de_passe: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // NOUVEAU
    role: {
      type: DataTypes.STRING(20),
      defaultValue: "editeur",
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: [],
      // Ex: ["manage_actualites", "manage_filieres"]
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reset_token: DataTypes.STRING(255),
    reset_token_expiry: DataTypes.DATE,
  },
  {
    tableName: "admins",
    timestamps: true,
  },
);

module.exports = Admin;
