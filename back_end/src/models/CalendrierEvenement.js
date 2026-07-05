const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "CalendrierEvenement",
  {
    id_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: { type: DataTypes.STRING(255), allowNull: false },
    description: DataTypes.TEXT,
    date_debut: { type: DataTypes.DATEONLY, allowNull: false },
    date_fin: DataTypes.DATEONLY,
    type: { type: DataTypes.STRING(50), defaultValue: "Général" },
    cycle: { type: DataTypes.STRING(20), defaultValue: "tous" },
    couleur: { type: DataTypes.STRING(20), defaultValue: "#0e7490" },
    id_admin: DataTypes.INTEGER,
  },
  { tableName: "calendrier_evenements", timestamps: true },
);
