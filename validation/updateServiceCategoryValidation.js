const { body, validationResult } = require("express-validator");
const { ServiceCategory } = require("../models");

const rules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters")
    .custom(async (value, { req }) => {
      const existingCategory = await ServiceCategory.findOne({
        where: { name: value },
      });
      if (existingCategory && existingCategory.id == req.params.id) {
        return true;
      }
      if (existingCategory) {
        throw new Error("Service Category already registered");
      }
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Description must be between 1 and 255 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = rules;
