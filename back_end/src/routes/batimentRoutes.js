const router = require("express").Router();
const ctrl = require("../controllers/batimentController");
const auth = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/upload");


router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", auth, uploadMultiple.single("photo"), ctrl.create);
router.put("/:id", auth, uploadMultiple.single("photo"), ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
