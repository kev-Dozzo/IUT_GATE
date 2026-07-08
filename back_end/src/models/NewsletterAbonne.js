const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const crypto = require("crypto");

module.exports = sequelize.define(
  "NewsletterAbonne",
  {
    id_abonne: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    nom: DataTypes.STRING(100),
    actif: { type: DataTypes.BOOLEAN, defaultValue: true },
    token: {
      type: DataTypes.STRING(255),
      defaultValue: () => crypto.randomBytes(32).toString("hex"),
    },
  },
  { tableName: "newsletter_abonnes", timestamps: true, updatedAt: false },
);
