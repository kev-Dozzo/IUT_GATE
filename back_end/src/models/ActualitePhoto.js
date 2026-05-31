const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActualitePhoto = sequelize.define(
  "ActualitePhoto",
  {
    id_photo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_actualite: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    ordre: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: "actualite_photos", timestamps: false },
);

module.exports = ActualitePhoto;
