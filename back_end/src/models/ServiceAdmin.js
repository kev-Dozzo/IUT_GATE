const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceAdministratif = sequelize.define(
  "ServiceAdministratif",
  {
    id_service: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    contact: { type: DataTypes.STRING },
    id_batiment: { type: DataTypes.INTEGER },
  },
  { tableName: "services_administratifs", timestamps: true },
);

module.exports = ServiceAdministratif;
