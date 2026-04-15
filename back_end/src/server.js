import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "../src/middlewares/auth.js";
import filliereRoute from "../src/routes/filliereRoute.js";
import enseignantRoute from "../src/routes/enseignantRoute.js";
import actualiterRoute from "../src/routes/actualiterRoute.js";
import serviceAdminRoute from "../src/routes/serviceAdminRoute.js";
import departementRoute from "../src/routes/departementRoute.js";
import batimentRoute from "../src/routes/batimentRoute.js";
import salleRoute from "../src/routes/salleRoute.js";
import authRoutes from "../src/routes/authRoutes.js";
import errorHandler from "../src/middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

app.use("/api/filieres", filliereRoute);
app.use("/api/enseignants", enseignantRoute);
app.use("/api/departements", auth, departementRoute);
app.use("/api/batiments", batimentRoute);
app.use("/api/salles", salleRoute);
app.use("/api/actualiter", actualiterRoute);
app.use("/api/annonces", actualiterRoute);
// app.use("/api/servicesadmin", serviceAdminRoute);
app.use("/api/services", serviceAdminRoute);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 App is listening on Port: http://localhost:${PORT}`);
});
