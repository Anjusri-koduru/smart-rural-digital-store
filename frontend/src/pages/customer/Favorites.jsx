import { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Loader from "../../components/common/Loader";
import ProductCard from "../../components/product/ProductCard";

import {
  getFavorites,
  removeFromFavorites,
} from "../../services/customerService";

const Favorites = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const response = await getFavorites();

      if (response.success) {
        setFavorites(response.favorites || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const response =
        await removeFromFavorites(productId);

      if (response.success) {
        setFavorites((previous) =>
          previous.filter(
            (product) =>
              product._id !== productId
          )
        );

        toast.success(
          "Removed from favorites"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove favorite"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="favorites-page">

      <div className="favorites-container">

        {/* Header */}

        <div className="favorites-header">

          <div>
            <div className="favorites-title">
              <Heart size={28} />
              <h1>My Favorites</h1>
            </div>

            <p>
              Products you saved for later
            </p>
          </div>

          <div className="favorites-count">
            {favorites.length}{" "}
            {favorites.length === 1
              ? "Product"
              : "Products"}
          </div>

        </div>

        {/* Empty State */}

        {favorites.length === 0 ? (
          <div className="favorites-empty">

            <div className="favorites-empty-icon">
              <Heart size={55} />
            </div>

            <h2>
              No Favorites Yet
            </h2>

            <p>
              Save products you love and
              find them easily later.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
            >
              <ShoppingBag size={18} />
              Explore Products
            </button>

          </div>
        ) : (

          <div className="favorites-grid">

            {favorites.map((product) => (

              <div
                className="favorite-product-wrapper"
                key={product._id}
              >

                <ProductCard
                  product={product}
                />

                <button
                  type="button"
                  className="favorite-remove-button"
                  onClick={() =>
                    handleRemove(product._id)
                  }
                  title="Remove from favorites"
                >
                  <Trash2 size={17} />
                  Remove
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Favorites;