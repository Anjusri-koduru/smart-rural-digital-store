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

const {
  validateProduct,
} = require("../validators/productValidator");

// Public
router.get("/", getAllProducts);

// Seller
router.get(
  "/seller/my-products",
  authMiddleware,
  sellerMiddleware,
  getSellerProducts
);

router.post(
  "/",
  authMiddleware,
  sellerMiddleware,
  upload.single("image"),
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  sellerMiddleware,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  sellerMiddleware,
  deleteProduct
);

// Single product
router.get("/:id", getProductById);

module.exports = router;