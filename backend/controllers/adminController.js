const User = require("../models/User");
const Product = require("../models/Product");

// Admin dashboard summary
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalSellers = await User.countDocuments({
      role: "seller",
    });

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalProducts =
      await Product.countDocuments();

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalSellers,
        totalCustomers,
        totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get all sellers
const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sellers",
      error: error.message,
    });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getAllSellers,
  getAllCustomers,
};