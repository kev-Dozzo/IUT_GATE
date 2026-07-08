const router = require("express").Router();
const ctrl = require("../controllers/adminUserController");
const auth = require("../middlewares/auth");
const checkPermission = require("../middlewares/checkPermission");

// Toutes les routes nécessitent d'être connecté
router.use(auth);

// Gestion users — super admin uniquement
router.get("/", checkPermission("manage_users"), ctrl.getAll);
router.post("/", checkPermission("manage_users"), ctrl.create);
router.put("/:id", checkPermission("manage_users"), ctrl.update);
router.delete("/:id", checkPermission("manage_users"), ctrl.delete);

// Activités
router.get("/activities/me", ctrl.getMyActivity);
router.get(
  "/activities/all",
  checkPermission("view_logs"),
  ctrl.getAllActivity,
);

module.exports = router;
