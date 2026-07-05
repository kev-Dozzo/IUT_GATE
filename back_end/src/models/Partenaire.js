const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Partenaire",
  {
    id_partenaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING(255), allowNull: false },
    logo_url: DataTypes.STRING(500),
    lien: DataTypes.STRING(500),
    description: DataTypes.TEXT,
    ordre: { type: DataTypes.INTEGER, defaultValue: 0 },
    actif: { type: DataTypes.BOOLEAN, defaultValue: true },
    id_admin: DataTypes.INTEGER,
  },
  { tableName: "partenaires", timestamps: true },
);
