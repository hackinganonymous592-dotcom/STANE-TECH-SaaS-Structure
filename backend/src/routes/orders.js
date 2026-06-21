const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  processPayment,
  paymentWebhook
} = require("../controllers/orders");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").get(protect, getOrders).post(protect, createOrder);
router.route("/:id").get(protect, getOrder).put(protect, updateOrder).delete(protect, authorize("admin"), deleteOrder);
router.post("/payment/:orderId", protect, processPayment);
router.post("/webhook", paymentWebhook);

module.exports = router;
