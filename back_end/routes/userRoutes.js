const express = require("express");
const router = express.Router();

const getUser = require("../controllers/userControllers");
router.get("/getUser", getUser);

module.exports = router;
