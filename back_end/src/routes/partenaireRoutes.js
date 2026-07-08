const router = require("express").Router();
const ctrl = require("../controllers/partenaireController");
const auth = require("../middlewares/auth");
const { uploadSingle } = require("../middlewares/upload"); // ← déstructure

router.get("/", ctrl.getAll);
router.get("/admin", auth, ctrl.getAllAdmin);
router.post("/", auth, uploadSingle.single("logo"), ctrl.create); // ← uploadSingle
router.put("/:id", auth, uploadSingle.single("logo"), ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
