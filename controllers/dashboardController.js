import Order from "../models/Order.js";
import Cracker from "../models/Cracker.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Order.distinct("customerEmail");
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    const topCrackers = await Order.aggregate([
      { $unwind: "$crackers" },
      {
        $group: {
          _id: "$crackers.cracker",
          totalQuantity: { $sum: "$crackers.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "crackers",
          localField: "_id",
          foreignField: "_id",
          as: "crackerDetails",
        },
      },
      {
        $project: {
          name: { $arrayElemAt: ["$crackerDetails.name", 0] },
          totalQuantity: 1,
        },
      },
    ]);

    res.json({
      totalOrders,
      totalCustomers: totalCustomers.length,
      totalSales,
      topCrackers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
