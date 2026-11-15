
const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { validateProduct } = require("../validators/productValidator");

// Get all products
router.get("/", getAllProducts);

// Get seller products
router.get(
  "/seller/my-products",
  authMiddleware,
  sellerMiddleware,
  getSellerProducts
);

// Add product
router.post(
  "/",
  authMiddleware,
  sellerMiddleware,
  upload.single("image"),
  validateProduct,
  createProduct
);

// Update product
router.put(
  "/:id",
  authMiddleware,
  sellerMiddleware,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  authMiddleware,
  sellerMiddleware,
  deleteProduct
);

// Get single product
router.get("/:id", getProductById);

module.exports = router;
