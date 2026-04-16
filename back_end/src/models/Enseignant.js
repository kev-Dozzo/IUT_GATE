const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StaffEnseignant = sequelize.define(
  "StaffEnseignant",
  {
    id_enseignant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    telephone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    poste: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    bureau: { type: DataTypes.STRING },
    coordonnees_bureau: { type: DataTypes.STRING },
    photo_url: { type: DataTypes.STRING },
    id_departement: { type: DataTypes.INTEGER },
    id_batiment: { type: DataTypes.INTEGER },
    created_by_admin: { type: DataTypes.INTEGER },
    id_admin: { type: DataTypes.INTEGER },
  },
  { tableName: "staff_enseignants", timestamps: true },
);

module.exports = StaffEnseignant;
