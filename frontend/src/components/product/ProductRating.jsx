import { Star } from "lucide-react";

const ProductRating = ({
  rating = 0,
  totalReviews = 0,
  showCount = true,
}) => {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <div className="product-rating">
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            fill={star <= roundedRating ? "currentColor" : "none"}
          />
        ))}
      </div>

      <span className="rating-number">
        {Number(rating || 0).toFixed(1)}
      </span>

      {showCount && (
        <span className="rating-count">
          ({totalReviews || 0} reviews)
        </span>
      )}
    </div>
  );
};

export default ProductRating;