
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";

import {
  getSellerProducts,
  deleteProduct,
} from "../../services/productService";

const BACKEND_URL =
  "https://smart-rural-digital-store.onrender.com";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getSellerProducts();

      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await deleteProduct(productId);

      if (response.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="seller-page">
      <div className="seller-page-header">
        <div>
          <h1>My Products</h1>
          <p>Manage the products you sell</p>
        </div>

        <Link
          to="/seller/products/add"
          className="seller-primary-button"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="seller-empty-state">
          <Package size={65} />

          <h2>No Products Yet</h2>

          <p>
            Start selling by adding your first product.
          </p>

          <Link
            to="/seller/products/add"
            className="seller-primary-button"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="seller-product-grid">
          {products.map((product) => {
            const imageUrl = product.image
              ? product.image.startsWith("http")
                ? product.image
                : `${BACKEND_URL}${product.image}`
              : "/logo.png";

            return (
              <div
                className="seller-product-card"
                key={product._id}
              >
                {/* PRODUCT IMAGE */}
                <div
                  className="seller-product-image"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/logo.png";
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                {/* PRODUCT CONTENT */}
                <div className="seller-product-content">
                  <h3>{product.name}</h3>

                  <p className="seller-product-category">
                    {product.category}
                  </p>

                  <div className="seller-product-details">
                    <strong>₹{product.price}</strong>

                    <span>
                      Stock: {product.quantity}
                    </span>
                  </div>

                  <div
                    className={
                      product.quantity > 0 &&
                      product.isAvailable
                        ? "seller-stock available"
                        : "seller-stock unavailable"
                    }
                  >
                    {product.quantity > 0 &&
                    product.isAvailable
                      ? "Available"
                      : "Out of Stock"}
                  </div>

                  <div className="seller-product-actions">
                    <Link
                      to={`/seller/products/edit/${product._id}`}
                      className="seller-edit-button"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>

                    <button
                      className="seller-delete-button"
                      onClick={() =>
                        handleDelete(product._id)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
