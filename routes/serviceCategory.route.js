const express = require("express");
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/serviceCategory.controller");
const authenticate = require("../middleware/authenticate");
const createServiceCategoryValidation = require("../validation/createServiceCategoryValidation");
const updateServiceCategoryValidation = require("../validation/updateServiceCategoryValidation");

const router = express.Router();

router.get("/", index);
router.post("/", [authenticate, createServiceCategoryValidation], store);
router.put("/:id", [authenticate, updateServiceCategoryValidation], update);
router.delete("/:id", authenticate, destroy);

module.exports = router;
