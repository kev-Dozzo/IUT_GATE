const router = require("express").Router();
const ctrl = require("../controllers/actualiterController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", ctrl.getAll);
router.get("/count", ctrl.count);
router.get("/:id", ctrl.getById);
router.post("/", auth, upload.uploadMultiple.array("photos", 10), ctrl.create);
router.put("/:id", auth, upload.uploadMultiple.array("photos", 10), ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
