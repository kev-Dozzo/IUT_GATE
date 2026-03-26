const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/annonceController");
const auth = require("../middlewares/auth");

router.get("/", ctrl.getAll);
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
