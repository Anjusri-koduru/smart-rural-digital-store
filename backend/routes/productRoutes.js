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