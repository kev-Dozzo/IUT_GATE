import express from "express";
import {
  addSalle,
  deleteSalleController,
  getAllSalle,
  getSingleSalle,
  updateSalleController,
} from "../controllers/salleController.js";

const router = express.Router();

router.get("/", getAllSalle);
router.get("/:id", getSingleSalle);
router.post("/", addSalle);
router.put("/:id", updateSalleController);
router.delete("/:id", deleteSalleController);

export default router;
