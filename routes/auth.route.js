const express = require("express");
const registerValidation = require("../validation/registerValidation.js");
const loginValidation = require("../validation/loginValidation.js");
const { register, login } = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/register", [registerValidation], register);
router.post("/login", [loginValidation], login);

module.exports = router;
