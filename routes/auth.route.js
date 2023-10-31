const express = require("express");
const registerValidation = require("../validation/registerValidation.js");
const loginValidation = require("../validation/loginValidation.js");
const {
  register,
  login,
  reqActivateToken,
  activate,
} = require("../controllers/auth.controller.js");
const authenticate = require("../middleware/authenticate.js");

const router = express.Router();

router.post("/register", [registerValidation], register);
router.post("/login", [loginValidation], login);
router.get("/activate/:token", activate);
router.post("/activate/resend", authenticate, reqActivateToken);

module.exports = router;
