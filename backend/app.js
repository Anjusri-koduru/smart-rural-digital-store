const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const productRoutes = require("./routes/productRoutes");

const adminRoutes = require("./routes/adminRoutes");

const sellerRoutes = require("./routes/sellerRoutes");

const customerRoutes = require("./routes/customerRoutes");

const orderRoutes = require("./routes/orderRoutes");

const addressRoutes = require("./routes/addressRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const cartRoutes = require("./routes/cartRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const recommendationRoutes = require("./routes/recommendationRoutes");

const recommendationInteractionRoutes = require(
  "./routes/recommendationInteractionRoutes"
);

const couponRoutes = require("./routes/couponRoutes");

const referralRoutes = require("./routes/referralRoutes");

const notificationRoutes = require("./routes/notificationRoutes");

const accountRoutes = require("./routes/accountRoutes");

const app = express();


// ================================
// Middleware
// ================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ================================
// Uploaded Files
// ================================

app.use(
  "/uploads",
  express.static("uploads")
);


// ================================
// Routes
// ================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Users
app.use(
  "/api/users",
  userRoutes
);

// Products
app.use(
  "/api/products",
  productRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);

// Seller
app.use(
  "/api/seller",
  sellerRoutes
);

// Customer
app.use(
  "/api/customer",
  customerRoutes
);

// Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Addresses
app.use(
  "/api/addresses",
  addressRoutes
);

// Dashboard
app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Cart
app.use(
  "/api/cart",
  cartRoutes
);

// Reviews
app.use(
  "/api/reviews",
  reviewRoutes
);

// AI Recommendations
app.use(
  "/api/recommendations",
  recommendationRoutes
);

// Recommendation Interactions
app.use(
  "/api/recommendation-interactions",
  recommendationInteractionRoutes
);

// Coupons
app.use(
  "/api/coupons",
  couponRoutes
);

// Referrals
app.use(
  "/api/referrals",
  referralRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

// Account Switching
app.use(
  "/api/account",
  accountRoutes
);


// ================================
// Health Check
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Smart Rural Digital Store Backend is running",
  });
});


// ================================
// 404 Handler
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});


// ================================
// Global Error Handler
// ================================

app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});


module.exports = app;