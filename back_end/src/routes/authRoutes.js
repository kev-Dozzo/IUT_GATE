const router = require("express").Router();
const ctrl = require("../controllers/authController");
const auth = require("../middlewares/auth");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/profile", auth, ctrl.profile);
router.put("/profile", auth, ctrl.updateProfile);
router.put("/password", auth, ctrl.updatePassword);
router.post("/forgot-password", ctrl.forgotPassword); // ← nouveau
router.post("/reset-password", ctrl.resetPassword); // ← nouveau

module.exports = router;
