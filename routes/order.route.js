const express = require("express");
const authenticate = require("../middleware/authenticate");
const { index, store, show } = require("../controllers/order.controller");
const {
  acceptOrder,
  requestProcessOrder,
  requestSuccessOrder,
  acceptSuccessOrder,
  requestCancelOrder,
  acceptCancelOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/", authenticate, index);
router.post("/:id", authenticate, store);
router.get("/:id", authenticate, show);

// order process
router.post("/accept/:id", authenticate, acceptOrder);
router.post("/requestProcess/:id", authenticate, requestProcessOrder);
router.post("/acceptProcess/:id", authenticate, requestProcessOrder);
router.post("/requestSuccess/:id", authenticate, requestSuccessOrder);
router.post("/acceptSuccess/:id", authenticate, acceptSuccessOrder);
router.post("/requestCancel/:id", authenticate, requestCancelOrder);
router.post("/acceptCancel/:id", authenticate, acceptCancelOrder);

module.exports = router;
