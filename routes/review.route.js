const express = require("express");
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/review.controller.js");
const authenticate = require("../middleware/authenticate.js");
const reviewValidation = require("../validation/reviewValidation.js");

const router = express.Router();

router.get("/:id", index);
router.post("/:id", [authenticate, reviewValidation], store);
router.put("/:id", [authenticate, reviewValidation], update);
router.delete("/:id", authenticate, destroy);

module.exports = router;
