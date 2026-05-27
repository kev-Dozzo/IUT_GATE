const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Actualite = sequelize.define(
  "Actualite",
  {
    id_actualite: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: { type: DataTypes.STRING, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false },
    categorie: { type: DataTypes.STRING, defaultValue: "Général" },
    photo_url: { type: DataTypes.STRING }, // image principale
    fichiers: { type: DataTypes.TEXT }, // JSON array de fichiers
    date_publication: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    id_admin: { type: DataTypes.INTEGER },
  },
  { tableName: "actualites", timestamps: true },
);

module.exports = Actualite;
