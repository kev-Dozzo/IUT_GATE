const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Annonce = sequelize.define(
  "Annonce",
  {
    id_annonce: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: { type: DataTypes.STRING, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false },
    categorie: { type: DataTypes.STRING, defaultValue: "Général" },
    photo_url: { type: DataTypes.STRING, allowNull: true },
    date_publication: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    id_admin: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "annonces", timestamps: true },
);

module.exports = Annonce;
