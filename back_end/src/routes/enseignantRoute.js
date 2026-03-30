import express from "express";
import {
  addEnseignant,
  deleteEnseignant,
  getAllEnseignant,
  getSingleEnseignant,
  updateEnseignant,
} from "../controllers/enseignantController.js";

const router = express.Router();

router.get("/", getAllEnseignant);
router.get("/:id", getSingleEnseignant);
router.post("/", addEnseignant);
router.put("/:id", updateEnseignant);
router.delete("/:id", deleteEnseignant);

export default router;
