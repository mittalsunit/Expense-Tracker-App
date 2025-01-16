const express = require("express");
const {
  createOrder,
  updateOrderStatus,
} = require("../controllers/paymentController");
const { verifyTokenMiddleware } = require("../utils/jwt");

const router = express.Router();

// Route to create an order
router.post("/create-order", verifyTokenMiddleware, createOrder);

// Route to update order status
router.post("/update-status", verifyTokenMiddleware, updateOrderStatus);

module.exports = router;
