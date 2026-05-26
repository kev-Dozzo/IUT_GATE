const router = require("express").Router();
const ctrl = require("../controllers/filiereController");
const auth = require("../middlewares/auth");
const { uploadSingle } = require("../middlewares/upload");


router.get("/", ctrl.getAll);
router.get("/count", ctrl.count);
router.get("/:id", ctrl.getById);
router.post("/", auth, uploadSingle.single("photo"), ctrl.create);
router.put("/:id", auth, uploadSingle.single("photo"), ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
