const express = require("express");
const { index, store, show } = require("../controllers/order.controller");
const {
  acceptOrder,
  requestProcessOrder,
  acceptProcessOrder,
  requestSuccessOrder,
  acceptSuccessOrder,
  requestCancelOrder,
  acceptCancelOrder,
} = require("../controllers/order.controller");
const accountActivated = require("../middleware/accountActivated");

const router = express.Router();

router.get("/", accountActivated, index);
router.post("/:id", accountActivated, store);
router.get("/:id", accountActivated, show);

// order process
router.post("/accept/:id", accountActivated, acceptOrder);
router.post("/requestProcess/:id", accountActivated, requestProcessOrder);
router.post("/acceptProcess/:id", accountActivated, acceptProcessOrder);
router.post("/requestSuccess/:id", accountActivated, requestSuccessOrder);
router.post("/acceptSuccess/:id", accountActivated, acceptSuccessOrder);
router.post("/requestCancel/:id", accountActivated, requestCancelOrder);
router.post("/acceptCancel/:id", accountActivated, acceptCancelOrder);

module.exports = router;
