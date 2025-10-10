import Order from "../models/Order.js";
import Cracker from "../models/Cracker.js";
import User from "../models/User.js";

// Place a new order (Customer)
export const placeOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, crackers } = req.body;

    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: "Name & email required" });
    }

    if (!crackers || !crackers.length) {
      return res.status(400).json({ message: "Order must contain at least one cracker" });
    }

    let totalAmount = 0;
    const updatedCrackers = [];

    for (let item of crackers) {
      const cracker = await Cracker.findById(item.cracker);
      if (!cracker) return res.status(404).json({ message: "Cracker not found" });

      // Check stock availability
      if (cracker.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${cracker.name}` });
      }

      // Reduce stock
      cracker.quantity -= item.quantity;
      await cracker.save();

      totalAmount += cracker.price * item.quantity;

      updatedCrackers.push({
        crackerId: cracker._id,
        name: cracker.name,
        remainingStock: cracker.quantity,
      });
    }

    const order = await Order.create({
      customerName,
      customerEmail,
      crackers,
      totalAmount,
      status: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
      updatedStocks: updatedCrackers,
    });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "crackers.cracker",
        select: "name price",
      });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get my orders (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const { email } = req.query;
    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .populate({
        path: "crackers.cracker",
        select: "name price",
      });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//  Total Orders
export const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Total Customers
export const getTotalCustomers = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "customer" });
    res.json({ totalCustomers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Total Sales
export const getTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ totalSales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Top Selling Crackers
export const getTopCrackers = async (req, res) => {
  try {
    const orders = await Order.find().populate("crackers.cracker");
    const salesMap = {};

    orders.forEach((o) => {
      o.crackers.forEach((c) => {
        const name = c.cracker.name;
        if (!salesMap[name]) salesMap[name] = 0;
        salesMap[name] += c.quantity;
      });
    });

    const topCrackers = Object.entries(salesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5
    res.json(topCrackers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
