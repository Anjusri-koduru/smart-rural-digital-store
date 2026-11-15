const dashboardService =
  require("../services/dashboardService");

// Seller
const sellerDashboard = async (
  req,
  res
) => {
  try {
    const dashboard =
      await dashboardService.getSellerDashboard(
        req.user.id
      );

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to load seller dashboard",
      error: error.message,
    });
  }
};

// Customer
const customerDashboard = async (
  req,
  res
) => {
  try {
    const dashboard =
      await dashboardService.getCustomerDashboard(
        req.user.id
      );

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to load customer dashboard",
      error: error.message,
    });
  }
};

// Admin
const adminDashboard = async (
  req,
  res
) => {
  try {
    const dashboard =
      await dashboardService.getAdminDashboard();

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to load admin dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  sellerDashboard,
  customerDashboard,
  adminDashboard,
};