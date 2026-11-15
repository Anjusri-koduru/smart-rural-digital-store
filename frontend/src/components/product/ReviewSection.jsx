import { useEffect, useState } from "react";
import {
  Edit,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
  addProductReview,
  deleteReview,
  getProductReviews,
  updateReview,
} from "../../services/reviewService";

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await getProductReviews(productId);

      if (response.success) {
        setReviews(response.reviews || []);
      }
    } catch (error) {
      console.error("Reviews error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    try {
      setSubmitting(true);

      let response;

      if (editingReviewId) {
        response = await updateReview(
          editingReviewId,
          {
            rating,
            comment: comment.trim(),
          }
        );
      } else {
        response = await addProductReview(
          productId,
          {
            rating,
            comment: comment.trim(),
          }
        );
      }

      if (response.success) {
        toast.success(
          editingReviewId
            ? "Review updated successfully"
            : "Review added successfully"
        );

        setComment("");
        setRating(5);
        setEditingReviewId(null);

        await fetchReviews();
      } else {
        toast.error(
          response.message || "Unable to save review"
        );
      }
    } catch (error) {
      console.error("Review submit error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment || "");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      const response = await deleteReview(reviewId);

      if (response.success) {
        toast.success("Review deleted successfully");
        await fetchReviews();
      } else {
        toast.error(
          response.message || "Unable to delete review"
        );
      }
    } catch (error) {
      console.error("Delete review error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete review"
      );
    }
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment("");
  };

  return (
    <section className="review-section">

      <div className="review-section-header">
        <div>
          <h2>Customer Reviews</h2>
          <p>
            See what customers say about this product
          </p>
        </div>

        <div className="review-total">
          {reviews.length} reviews
        </div>
      </div>

      {/* Review Form */}

      {user && (
        <form
          className="review-form"
          onSubmit={handleSubmit}
        >
          <h3>
            {editingReviewId
              ? "Edit Your Review"
              : "Write a Review"}
          </h3>

          <div className="review-rating-input">
            <span>Your Rating:</span>

            <div className="star-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={
                    star <= rating
                      ? "active"
                      : ""
                  }
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={24}
                    fill={
                      star <= rating
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            placeholder="Write your review..."
            rows="4"
            maxLength="1000"
          />

          <div className="review-form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="review-submit-button"
            >
              {submitting
                ? "Saving..."
                : editingReviewId
                ? "Update Review"
                : "Submit Review"}
            </button>

            {editingReviewId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="review-cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Reviews List */}

      {loading ? (
        <div className="reviews-loading">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty">
          <Star size={40} />
          <h3>No reviews yet</h3>
          <p>
            Be the first customer to review this product.
          </p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => {
            const reviewer =
              review.user?.name ||
              review.customer?.name ||
              "Customer";

            const isOwner =
              user &&
              (review.user?._id === user._id ||
                review.user === user._id ||
                review.customer?._id === user._id);

            return (
              <div
                key={review._id}
                className="review-card"
              >
                <div className="review-card-header">

                  <div className="review-user">
                    <div className="review-avatar">
                      {reviewer
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h4>{reviewer}</h4>

                      <div className="review-stars">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={15}
                              fill={
                                star <=
                                review.rating
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="review-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(review)
                        }
                        title="Edit review"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            review._id
                          )
                        }
                        title="Delete review"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  )}
                </div>

                <p className="review-comment">
                  {review.comment}
                </p>

                {review.createdAt && (
                  <small className="review-date">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </small>
                )}
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};

export default ReviewSection;