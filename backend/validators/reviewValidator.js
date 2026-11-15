const validateReview = (data) => {
  const { rating, comment } = data;

  if (rating === undefined || rating === null) {
    return "Rating is required";
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return "Rating must be between 1 and 5";
  }

  if (comment && comment.length > 500) {
    return "Comment cannot exceed 500 characters";
  }

  return null;
};

module.exports = validateReview;