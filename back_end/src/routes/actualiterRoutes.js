const router = require("express").Router();
const ctrl = require("../controllers/actualiterController");
const auth = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/upload");

router.get("/", ctrl.getAll);
router.get("/count", ctrl.count);
router.get("/:id", ctrl.getById);
router.post("/", auth, uploadMultiple.array("fichiers", 5), ctrl.create);
router.put("/:id", auth, uploadMultiple.array("fichiers", 5), ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
