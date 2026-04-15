import express from "express";
import {
  addActualiter,
  deleteActualiter,
  getAllActualiter,
  getAnnonceCount,
  getSingleActualiter,
  updateActualiter,
} from "../controllers/actualiterController.js";

const router = express.Router();

router.get("/", getAllActualiter);
router.get("/count", getAnnonceCount);

router.get("/:id", getSingleActualiter);

router.post("/", addActualiter);

router.put("/:id", updateActualiter);

router.delete("/:id", deleteActualiter);


export default router;
