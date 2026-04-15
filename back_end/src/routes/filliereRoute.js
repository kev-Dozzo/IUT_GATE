import express from "express";
import {
  addFilliere,
  deleteFilliere,
  getAllFilliere,
  getSingleFilliere,
  getFilliereCount,
  updateFilliere,
} from "../controllers/filliereController.js";

const router = express.Router();

router.get("/", getAllFilliere);
router.get("/count", getFilliereCount);
router.get("/:id", getSingleFilliere);
router.post("/", addFilliere);
router.put("/:id", updateFilliere);
router.delete("/:id", deleteFilliere);

export default router;
