const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Salle = sequelize.define(
  "Salle",
  {
    id_salle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    capacite: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    id_batiment: { type: DataTypes.INTEGER },
  },
  { tableName: "salles", timestamps: true },
);

module.exports = Salle;
