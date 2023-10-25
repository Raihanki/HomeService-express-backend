const express = require("express");
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../controllers/service.controller");
const serviceValidation = require("../validation/serviceValidation.js");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", index);
router.post("/", [serviceValidation, authenticate], store);
router.get("/:id", show);
router.put("/:id", [serviceValidation, authenticate], update);
router.delete("/:id", authenticate, destroy);

module.exports = router;
