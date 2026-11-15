import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Upload,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";

import {
  getProductById,
  updateProduct,
} from "../../services/productService";

const BACKEND_URL =
  "https://smart-rural-digital-store.onrender.com";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      location: "",
      shopName: "",
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response =
          await getProductById(id);

        if (response.success) {
          const product =
            response.product;

          setFormData({
            name: product.name || "",
            description:
              product.description || "",
            price:
              product.price ?? "",
            quantity:
              product.quantity ?? "",
            category:
              product.category || "",
            location:
              product.location || "",
            shopName:
              product.shopName || "",
          });

          if (product.image) {
            setPreview(
              `${BACKEND_URL}${product.image}`
            );
          }
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      if (image) {
        data.append("image", image);
      }

      const response =
        await updateProduct(
          id,
          data
        );

      if (response.success) {
        toast.success(
          "Product updated successfully"
        );

        navigate("/seller/products");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

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
        <h1>Edit Product</h1>
        <p>
          Update your product information
        </p>
      </div>

      <form
        className="seller-product-form"
        onSubmit={handleSubmit}
      >

        <div className="seller-form-grid">

          <div className="seller-form-group">

            <label>
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

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

          </div>

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
            />

          </div>

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
            />

          </div>

          <div className="seller-form-group">

            <label>
              Shop Name
            </label>

            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />

          </div>

          <div className="seller-form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="seller-form-group">

          <label>
            Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />

        </div>

        <div className="seller-form-group">

          <label>
            Product Image
          </label>

          <label className="seller-image-upload">

            <Upload size={25} />

            <span>
              Choose new image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </label>

          {preview && (
            <div className="seller-image-preview">

              <img
                src={preview}
                alt="Product"
              />

            </div>
          )}

        </div>

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
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditProduct;