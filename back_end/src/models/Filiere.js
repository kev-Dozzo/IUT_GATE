const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Filiere = sequelize.define(
  "Filiere",
  {
    id_filiere: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    duree: { type: DataTypes.STRING },
    condition_admission: { type: DataTypes.TEXT },
    places: { type: DataTypes.INTEGER },
    photo_url: { type: DataTypes.STRING },
    id_departement: { type: DataTypes.INTEGER },
    id_admin: { type: DataTypes.INTEGER },
  },
  { tableName: "filieres", timestamps: true },
);

module.exports = Filiere;
