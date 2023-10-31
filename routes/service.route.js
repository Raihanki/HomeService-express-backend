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
const accountActivated = require("../middleware/accountActivated");

const router = express.Router();

router.get("/", index);
router.post("/", [serviceValidation, accountActivated], store);
router.get("/:id", show);
router.put("/:id", [serviceValidation, accountActivated], update);
router.delete("/:id", accountActivated, destroy);

module.exports = router;
