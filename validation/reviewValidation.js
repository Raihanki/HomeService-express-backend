const { body, validationResult } = require("express-validator");

const rules = [
  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 5 })
    .withMessage("Comment must be at least 5 characters long"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = rules;
