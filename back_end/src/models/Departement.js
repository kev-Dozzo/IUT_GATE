const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Departement = sequelize.define(
  "Departement",
  {
    id_departement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    photo_url: { type: DataTypes.STRING }, 
    id_admin: { type: DataTypes.INTEGER },
  },
  { tableName: "departements", timestamps: true },
);

module.exports = Departement;
