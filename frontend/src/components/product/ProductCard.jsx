import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  addFavorite,
  removeFavorite,
} from "../../services/wishlistService";

const BACKEND_URL =
  "https://smart-rural-digital-store.onrender.com";

const ProductCard = ({ product }) => {
  const [favorite, setFavorite] =
    useState(false);

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const imageUrl = product.image
    ? `${BACKEND_URL}${product.image}`
    : "/logo.png";

  const handleFavorite = async () => {
    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      if (favorite) {
        await removeFavorite(
          product._id
        );

        setFavorite(false);

        toast.success(
          "Removed from favorites"
        );
      } else {
        await addFavorite(
          product._id
        );

        setFavorite(true);

        toast.success(
          "Added to favorites"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update favorite"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}

      <div
        className="product-image-wrapper"
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
          className="product-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />

        <button
          className="favorite-button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          aria-label="Add to favorites"
        >
          <Heart
            size={19}
            fill={
              favorite
                ? "currentColor"
                : "none"
            }
          />
        </button>

      </div>

      {/* CONTENT */}

      <div className="product-card-content">

        <h3>
          {product.name}
        </h3>

        <p className="product-category">
          {product.category}
        </p>

        <div className="product-rating">

          <Star
            size={16}
            fill="currentColor"
          />

          <span>
            {product.rating || 0}
          </span>

          <span className="reviews">
            ({product.totalReviews || 0})
          </span>

        </div>

        <div className="product-bottom">

          <strong>
            ₹{product.price}
          </strong>

          <Link
            to={`/products/${product._id}`}
          >
            View
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;