const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Batiment = sequelize.define(
  "Batiment",
  {
    id_batiment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    photo_url: { type: DataTypes.STRING },
    id_admin: { type: DataTypes.INTEGER },
  },
  { tableName: "batiments", timestamps: true },
);

module.exports = Batiment;
