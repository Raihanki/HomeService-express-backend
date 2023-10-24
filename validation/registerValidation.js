import { body, validationResult } from "express-validator";
import User from "../models/user.js";

const rules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (value) => {
      const email = await User.findOne({ where: { email: value } });
      if (email) {
        throw new Error("Email already registered");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters"),
  body("password_confirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .equals("password")
    .withMessage("Password confirmation does not match"),
  body("telp")
    .notEmpty()
    .withMessage("Telp is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Telp must be between 8 and 20 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

export default rules;
