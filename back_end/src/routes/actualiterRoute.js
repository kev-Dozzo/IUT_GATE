import express from "express";
import {
  addActualiter,
  getSingleActualiter,
  deleteActualiter,
  getAllActualiter,
  updateActualiter,
  
} from "../controllers/actualiterController.js";

const router = express.Router();

router.get("/", getAllActualiter);

router.get("/:id", getSingleActualiter);


router.post("/", addActualiter);

router.put("/:id", updateActualiter);

router.delete("/:id", deleteActualiter);


export default router;
