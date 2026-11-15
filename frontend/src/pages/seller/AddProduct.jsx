import { useState } from "react";
import {
  ArrowLeft,
  Upload,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createProduct,
} from "../../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    location: "",
    shopName: "",
  });

  const [customCategory, setCustomCategory] =
    useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear custom category when user selects
    // a normal category
    if (
      name === "category" &&
      value !== "Other"
    ) {
      setCustomCategory("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Allow all image files
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image file"
      );

      e.target.value = "";
      return;
    }

    setImage(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate normal required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      formData.quantity === "" ||
      !formData.category
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    // Validate custom category
    if (
      formData.category === "Other" &&
      !customCategory.trim()
    ) {
      toast.error(
        "Please enter your product category"
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "quantity",
        formData.quantity
      );

      // If Other is selected,
      // send custom category instead
      const finalCategory =
        formData.category === "Other"
          ? customCategory.trim()
          : formData.category;

      data.append(
        "category",
        finalCategory
      );

      data.append(
        "location",
        formData.location
      );

      data.append(
        "shopName",
        formData.shopName
      );

      if (image) {
        data.append(
          "image",
          image
        );
      }

      const response =
        await createProduct(data);

      if (response.success) {
        toast.success(
          "Product added successfully"
        );

        navigate(
          "/seller/products"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page">

      <Link
        to="/seller/products"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <div className="seller-form-header">
        <h1>Add Product</h1>

        <p>
          Add a new product to your store
        </p>
      </div>

      <form
        className="seller-product-form"
        onSubmit={handleSubmit}
      >

        <div className="seller-form-grid">

          {/* PRODUCT NAME */}

          <div className="seller-form-group">

            <label>
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />

          </div>

          {/* CATEGORY */}

          <div className="seller-form-group">

            <label>
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">
                Select Category
              </option>

              <option value="Vegetables">
                Vegetables
              </option>

              <option value="Fruits">
                Fruits
              </option>

              <option value="Handicrafts">
                Handicrafts
              </option>

              <option value="Clothing">
                Clothing
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* CUSTOM CATEGORY */}

            {formData.category === "Other" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) =>
                  setCustomCategory(
                    e.target.value
                  )
                }
                placeholder="Enter your category"
                style={{
                  marginTop: "10px",
                }}
                autoFocus
              />
            )}

          </div>

          {/* PRICE */}

          <div className="seller-form-group">

            <label>
              Price (₹) *
            </label>

            <input
              type="number"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />

          </div>

          {/* QUANTITY */}

          <div className="seller-form-group">

            <label>
              Quantity *
            </label>

            <input
              type="number"
              min="0"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
            />

          </div>

          {/* SHOP NAME */}

          <div className="seller-form-group">

            <label>
              Shop Name
            </label>

            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter shop name"
            />

          </div>

          {/* LOCATION */}

          <div className="seller-form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter shop location"
            />

          </div>

        </div>

        {/* DESCRIPTION */}

        <div className="seller-form-group">

          <label>
            Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product"
            rows="5"
          />

        </div>

        {/* PRODUCT IMAGE */}

        <div className="seller-form-group">

          <label>
            Product Image
          </label>

          <label className="seller-image-upload">

            <Upload size={25} />

            <span>
              Click to upload product image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </label>

          {preview && (
            <div
              className="seller-image-preview"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >

              <img
                src={preview}
                alt="Product Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain",
                  display: "block",
                }}
              />

            </div>
          )}

          <small>
            All image formats are supported.
            No file size limit.
          </small>

        </div>

        {/* ACTIONS */}

        <div className="seller-form-actions">

          <Link
            to="/seller/products"
            className="seller-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="seller-primary-button"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddProduct;