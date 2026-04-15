import express from "express";
import {
  addBatiment,
  deleteBatimentController,
  getAllBatiment,
  getSingleBatiment,
  updateBatimentController,
} from "../controllers/batimentController.js";

const router = express.Router();

router.get("/", getAllBatiment);
router.get("/:id", getSingleBatiment);
router.post("/", addBatiment);
router.put("/:id", updateBatimentController);
router.delete("/:id", deleteBatimentController);

export default router;
