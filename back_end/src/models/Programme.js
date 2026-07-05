const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Programme",
  {
    id_programme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING(255), allowNull: false },
    description: DataTypes.TEXT,
    cycle: { type: DataTypes.STRING(20), allowNull: false },
    departement: DataTypes.STRING(100),
    lien_cours: DataTypes.STRING(500),
    lien_externe: DataTypes.STRING(500),
    actif: { type: DataTypes.BOOLEAN, defaultValue: true },
    ordre: { type: DataTypes.INTEGER, defaultValue: 0 },
    id_admin: DataTypes.INTEGER,
  },
  { tableName: "programmes", timestamps: true },
);
