const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

// Simulate payment providers
const moneyFlowProvider = async (amount, orderId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        resolve({ status: "completed", transactionId: `mf_${Date.now()}` });
      } else {
        resolve({ status: "failed", transactionId: null, message: "Money Flow payment failed" });
      }
    }, 1500);
  });
};

const fallbackProvider = async (amount, orderId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.5; // 50% success rate
      if (success) {
        resolve({ status: "completed", transactionId: `fb_${Date.now()}` });
      } else {
        resolve({ status: "failed", transactionId: null, message: "Fallback payment failed" });
      }
    }, 1000);
  });
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === "admin") {
    query = Order.find().populate({ path: "user", select: "name email" }).populate({ path: "products.product", select: "name price" });
  } else {
    query = Order.find({ user: req.user.id }).populate({ path: "products.product", select: "name price" });
  }

  const orders = await query;

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({ path: "user", select: "name email" }).populate({ path: "products.product", select: "name price" });

  if (!order) {
    return next(new Error(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order owner or admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new Error(`User ${req.user.id} is not authorized to view this order`, 401));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { products } = req.body;

  if (!products || products.length === 0) {
    return next(new Error("No products in order", 400));
  }

  let totalAmount = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new Error(`Product not found with id ${item.product}`, 404));
    }
    totalAmount += product.price * item.quantity;
    orderProducts.push({ product: item.product, quantity: item.quantity });
  }

  const order = await Order.create({
    user: req.user.id,
    products: orderProducts,
    totalAmount,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Update order status (admin only)
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Error(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is admin
  if (req.user.role !== "admin") {
    return next(new Error(`User ${req.user.id} is not authorized to update this order`, 401));
  }

  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Delete order (admin only)
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Error(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is admin
  if (req.user.role !== "admin") {
    return next(new Error(`User ${req.user.id} is not authorized to delete this order`, 401));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Process payment for an order
// @route   POST /api/v1/orders/payment/:orderId
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new Error(`Order not found with id of ${req.params.orderId}`, 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new Error(`User ${req.user.id} is not authorized to pay for this order`, 401));
  }

  if (order.status !== "pending") {
    return next(new Error("Order is not pending payment", 400));
  }

  const { paymentMethod } = req.body;
  let paymentResult;

  // Simulate modular payment gateway selection
  if (paymentMethod === "moneyflow") {
    paymentResult = await moneyFlowProvider(order.totalAmount, order._id);
  } else if (paymentMethod === "fallback") {
    paymentResult = await fallbackProvider(order.totalAmount, order._id);
  } else {
    return next(new Error("Invalid payment method", 400));
  }

  if (paymentResult.status === "completed") {
    order.status = "completed";
    order.paymentDetails = {
      paymentId: paymentResult.transactionId,
      method: paymentMethod,
      status: "completed",
      amount: order.totalAmount,
      currency: "EUR", // Assuming EUR for now
      paidAt: Date.now(),
    };
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful",
      order,
    });
  } else {
    order.paymentDetails = {
      paymentId: paymentResult.transactionId || null,
      method: paymentMethod,
      status: "failed",
      amount: order.totalAmount,
      currency: "EUR",
      paidAt: Date.now(),
    };
    await order.save();
    return next(new Error(`Payment failed: ${paymentResult.message || "Unknown error"}`, 400));
  }
});

// @desc    Handle payment webhooks
// @route   POST /api/v1/orders/webhook
// @access  Public (but should be secured by provider's signature)
exports.paymentWebhook = asyncHandler(async (req, res, next) => {
  // In a real application, you would verify the webhook signature here
  // and then process the payment status update based on the provider's data.
  console.log("Payment Webhook Received:", req.body);

  // Example: Update order status based on webhook data
  // const { orderId, status, transactionId, provider } = req.body;
  // const order = await Order.findById(orderId);
  // if (order) {
  //   order.status = status;
  //   order.paymentDetails.paymentId = transactionId;
  //   order.paymentDetails.method = provider;
  //   order.paymentDetails.status = status;
  //   await order.save();
  // }

  res.status(200).json({ received: true });
});
