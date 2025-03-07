const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/users");
const { registerUser } = require("../controllers/users");

router.post("/login", loginUser);
router.post("/create", registerUser);

module.exports = router;
