import express from "express";
import {
  addService,
  deleteService,
  getAllService,
  getServiceCount,
  getSingleService,
  updateService,
} from "../controllers/serviceAdminController.js";

const router = express.Router();

router.get("/", getAllService);
router.get("/count", getServiceCount);

router.get("/:id", getSingleService);

router.post("/", addService);

router.put("/:id", updateService);

router.delete("/:id", deleteService);

export default router;
