import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import filliereRoute from "../src/routes/filliereRoute.js";
import enseignantRoute from "../src/routes/enseignantRoute.js"
import actualiterRoute from "../src/routes/actualiterRoute.js"
import serviceAminRoute from "../src/routes/serviceAdminRoute.js"

dotenv.config();

const app = express();

app.use(express.json())

app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

// Route de test — à supprimer après
//app.post('/test-body', (req, res) => {
  //console.log('Body reçu:', req.body)
  //res.json({ bodyRecu: req.body })
//})

app.use("/api/filieres", filliereRoute);
app.use('/api/enseignants', enseignantRoute);
app.use('/api/actualiters', actualiterRoute);
app.use('/api/servicesadmin', serviceAminRoute);


const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`App is Listenning on Port: ${PORT}`);
  });

