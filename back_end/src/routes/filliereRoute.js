import express from "express";
import {
  addFilliere,
  deleteFilliere,
  getAllFilliere,
  getSingleFilliere,
  updateFilliere,
} from "../controllers/filliereController.js";

const router = express.Router();

router.get("/", getAllFilliere);
router.get("/:id", getSingleFilliere);
router.post("/", addFilliere);
router.put("/:id", updateFilliere);
router.delete("/:id", deleteFilliere);

export default router;
