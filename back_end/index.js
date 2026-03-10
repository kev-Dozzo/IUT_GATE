const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Express fonctionne !");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
