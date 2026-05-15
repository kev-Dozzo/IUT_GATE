const router = require("express").Router();
const ctrl = require("../controllers/enseignantController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", ctrl.getAll);
router.get("/count", ctrl.count);
router.get("/:id", ctrl.getById);
router.post("/", auth, upload.single("photo"), ctrl.create);
router.put("/:id", auth, upload.single("photo"), ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
