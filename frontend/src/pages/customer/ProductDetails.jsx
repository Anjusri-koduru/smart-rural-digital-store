import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  UserPlus,
  UserMinus,
} from "lucide-react";

import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import RecommendationSection from "../../components/product/RecommendationSection";
import ReviewSection from "../../components/product/ReviewSection";

import {
  getProductById,
} from "../../services/productService";

import {
  addToCart,
} from "../../services/cartService";

import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  followSeller,
  unfollowSeller,
  getFollowingSellers,
} from "../../services/customerService";

import {
  trackProductView,
} from "../../services/recommendationInteractionService";

const BACKEND_URL =
  "https://smart-rural-digital-store.onrender.com";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [quantity, setQuantity] =
    useState(1);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const [
    isFollowingSeller,
    setIsFollowingSeller,
  ] = useState(false);

  const [followLoading, setFollowLoading] =
    useState(false);

  // ================= FETCH PRODUCT =================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response =
          await getProductById(id);

        if (response.success) {
          setProduct(response.product);

          // Track product browsing
          trackProductView(id).catch(
            (error) => {
              console.error(
                "Product view tracking error:",
                error
              );
            }
          );
        } else {
          toast.error(
            response.message ||
              "Product not found"
          );
        }
      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= CHECK FAVORITE =================

  useEffect(() => {
    const checkFavorite = async () => {
      if (!id) return;

      try {
        const response =
          await getFavorites();

        if (response.success) {
          const favorites =
            response.favorites || [];

          const exists =
            favorites.some(
              (item) =>
                item._id === id ||
                item.product?._id === id
            );

          setIsFavorite(exists);
        }
      } catch (error) {
        console.error(
          "Favorite check error:",
          error
        );
      }
    };

    checkFavorite();
  }, [id]);

  // ================= CHECK FOLLOWING SELLER =================

  useEffect(() => {
    const checkFollowingSeller =
      async () => {
        if (!product?.seller) return;

        const sellerId =
          typeof product.seller === "object"
            ? product.seller._id
            : product.seller;

        if (!sellerId) return;

        try {
          const response =
            await getFollowingSellers();

          if (response.success) {
            const sellers =
              response.sellers ||
              response.following ||
              [];

            const exists =
              sellers.some(
                (seller) =>
                  seller._id === sellerId
              );

            setIsFollowingSeller(
              exists
            );
          }
        } catch (error) {
          console.error(
            "Following seller check error:",
            error
          );
        }
      };

    checkFollowingSeller();
  }, [product]);

  // ================= ADD TO CART =================

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      const response =
        await addToCart({
          productId: product._id,
          quantity,
        });

      if (response.success) {
        toast.success(
          "Product added to cart"
        );
      } else {
        toast.error(
          response.message ||
            "Unable to add product"
        );
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // ================= FAVORITE =================

  const handleFavorite = async () => {
    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        const response =
          await removeFromFavorites(
            product._id
          );

        if (response.success) {
          setIsFavorite(false);

          toast.success(
            "Removed from favorites"
          );
        }
      } else {
        const response =
          await addToFavorites(
            product._id
          );

        if (response.success) {
          setIsFavorite(true);

          toast.success(
            "Added to favorites"
          );
        }
      }
    } catch (error) {
      console.error(
        "Favorite error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update favorites"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  // ================= FOLLOW SELLER =================

  const handleFollowSeller = async () => {
    if (!product?.seller) {
      toast.error(
        "Seller information not available"
      );
      return;
    }

    const sellerId =
      typeof product.seller === "object"
        ? product.seller._id
        : product.seller;

    if (!sellerId) {
      toast.error(
        "Seller information not available"
      );
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowingSeller) {
        const response =
          await unfollowSeller(
            sellerId
          );

        if (response.success) {
          setIsFollowingSeller(false);

          toast.success(
            "Seller unfollowed successfully"
          );
        }
      } else {
        const response =
          await followSeller(
            sellerId
          );

        if (response.success) {
          setIsFollowingSeller(true);

          toast.success(
            "Seller followed successfully"
          );
        }
      }
    } catch (error) {
      console.error(
        "Follow seller error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update seller follow"
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return <Loader />;
  }

  // ================= PRODUCT NOT FOUND =================

  if (!product) {
    return (
      <div className="simple-page">
        <h2>
          Product not found
        </h2>

        <button
          onClick={() =>
            navigate("/products")
          }
        >
          Back to Products
        </button>
      </div>
    );
  }

  const imageUrl = product.image
    ? `${BACKEND_URL}${product.image}`
    : "/logo.png";

  const maxQuantity = Math.max(
    1,
    Number(product.quantity) || 1
  );

  // ================= SELLER ID =================

  const sellerId =
    typeof product.seller === "object"
      ? product.seller?._id
      : product.seller;

  const sellerName =
    typeof product.seller === "object"
      ? product.seller?.name
      : null;

  return (
    <div className="product-details-page">
      {/* BACK */}

      <button
        className="back-button"
        onClick={() =>
          navigate("/products")
        }
      >
        <ArrowLeft size={18} />
        Back to Products
      </button>

      {/* PRODUCT CARD */}

      <div className="product-details-card">
        {/* IMAGE */}

        <div className="product-details-image-section">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-details-image"
          />
        </div>

        {/* INFO */}

        <div className="product-details-info">
          <span className="product-details-category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>

          {/* RATING */}

          <div className="product-details-rating">
            <Star
              size={18}
              fill="currentColor"
            />

            <span>
              {product.rating || 0}
            </span>

            <span>
              (
              {product.totalReviews || 0}
              reviews)
            </span>
          </div>

          {/* PRICE */}

          <h2 className="product-details-price">
            ₹{product.price}
          </h2>

          {/* DESCRIPTION */}

          <p className="product-details-description">
            {product.description}
          </p>

          {/* SHOP */}

          {product.shopName && (
            <div className="product-detail-row">
              <strong>
                Shop:
              </strong>

              <span>
                {product.shopName}
              </span>
            </div>
          )}

          {/* LOCATION */}

          {product.location && (
            <div className="product-detail-row">
              <strong>
                Location:
              </strong>

              <span>
                {product.location}
              </span>
            </div>
          )}

          {/* SELLER */}

          {sellerName && (
            <div className="product-detail-row">
              <strong>
                Seller:
              </strong>

              <span>
                {sellerName}
              </span>
            </div>
          )}

          {/* AVAILABLE */}

          <div className="product-detail-row">
            <strong>
              Available:
            </strong>

            <span>
              {product.quantity > 0
                ? `${product.quantity} items`
                : "Out of stock"}
            </span>
          </div>

          {/* FOLLOW SELLER */}

          {sellerId && (
            <div className="seller-follow-section">
              <button
                type="button"
                className={
                  isFollowingSeller
                    ? "seller-follow-button following"
                    : "seller-follow-button"
                }
                onClick={
                  handleFollowSeller
                }
                disabled={followLoading}
              >
                {isFollowingSeller ? (
                  <UserMinus size={18} />
                ) : (
                  <UserPlus size={18} />
                )}

                {followLoading
                  ? "Please wait..."
                  : isFollowingSeller
                  ? "Following Seller"
                  : "Follow Seller"}
              </button>
            </div>
          )}

          {/* QUANTITY */}

          {product.quantity > 0 &&
            product.isAvailable !== false && (
              <>
                <div className="quantity-section">
                  <strong>
                    Quantity
                  </strong>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        setQuantity(
                          (prev) =>
                            Math.max(
                              1,
                              prev - 1
                            )
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity(
                          (prev) =>
                            Math.min(
                              maxQuantity,
                              prev + 1
                            )
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="product-details-actions">
                  <button
                    className="add-cart-button"
                    onClick={
                      handleAddToCart
                    }
                    disabled={
                      addingToCart
                    }
                  >
                    <ShoppingCart
                      size={19}
                    />

                    {addingToCart
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>

                  <button
                    className={
                      isFavorite
                        ? "favorite-details-button active"
                        : "favorite-details-button"
                    }
                    onClick={
                      handleFavorite
                    }
                    disabled={
                      favoriteLoading
                    }
                    title={
                      isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      size={19}
                      fill={
                        isFavorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </>
            )}

          {/* OUT OF STOCK */}

          {(product.quantity <= 0 ||
            product.isAvailable === false) && (
            <div className="out-of-stock-message">
              This product is currently
              out of stock.
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS */}

      <ReviewSection
        productId={product._id}
      />

      {/* SIMILAR PRODUCTS */}

      <RecommendationSection
        productId={product._id}
      />
    </div>
  );
};

export default ProductDetails;