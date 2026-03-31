import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

const db =pool.promise()

db.query("SELECT 1").then(() =>
  console
    .log("✅ Conneter a mysql : iut_gate_bd"))
    .catch((err) => console.error("❌ Error Start mysql server:", err.message))


export default db;
