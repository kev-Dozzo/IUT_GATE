const router = require("express").Router();
const ctrl = require("../controllers/salleController");
const auth = require("../middlewares/auth");

router.get("/", ctrl.getAll);
router.get("/count", ctrl.count);
router.get("/:id", ctrl.getById);
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
