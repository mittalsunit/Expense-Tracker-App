const razorpay = require("../config/razorpay");
const { User, Order } = require("../models");

exports.createOrder = async (req, res) => {
  const userId = req.user.id; // Extract the logged-in user's ID from req.user

  try {
    const options = {
      amount: 14900, // Amount in rupee (₹149.00)
      currency: "INR",
      receipt: `order_${userId}`.slice(0, 40),
    };

    console.log("Order options:", options);

    const order = await razorpay.orders.create(options);

    // Save order details in the database
    await Order.create({
      id: order.id,
      status: "PENDING",
      amount: options.amount,
      currency: options.currency,
      userId,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error?.error?.description || "Unknown error",
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { order_id, payment_id, status } = req.body;

  try {
    // Find the order in the database
    const order = await Order.findOne({ where: { id: order_id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update the order status
    order.status = status;
    await order.save();

    // If payment is successful, update the user to premium
    if (status === "SUCCESS") {
      const user = await User.findByPk(order.userId);
      user.isPremium = true;
      await user.save();
    }

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error });
  }
};
