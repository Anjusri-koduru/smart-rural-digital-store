const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      ) +
      path.extname(
        file.originalname
      );

    cb(null, uniqueName);
  },
});

// Allow all image file types
const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    file.mimetype &&
    file.mimetype.startsWith(
      "image/"
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  // No file size restriction
});

module.exports = upload;