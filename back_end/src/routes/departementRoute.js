import express from "express";
import {
  addDepartement,
  deleteDepartementController,
  getAllDepartement,
  getSingleDepartement,
  updateDepartementController,
} from "../controllers/departementController.js";

const router = express.Router();

router.get("/", getAllDepartement);
router.get("/:id", getSingleDepartement);
router.post("/", addDepartement);
router.put("/:id", updateDepartementController);
router.delete("/:id", deleteDepartementController);

export default router;
