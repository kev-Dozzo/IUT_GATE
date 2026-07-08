const router = require("express").Router();
const ctrl = require("../controllers/programmeController");
const auth = require("../middlewares/auth");

router.get("/", ctrl.getAll);
router.get("/admin", auth, ctrl.getAllAdmin);
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
