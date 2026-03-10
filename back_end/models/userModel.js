const db = require("../config/db");

const getAllUsers = () => {
  return db.query("SELECT * FROM users");
};

module.exports = { getAllUsers };
