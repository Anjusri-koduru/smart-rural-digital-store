const mongoose = require("mongoose");

const recommendationInteractionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    action: {
      type: String,
      enum: ["view", "search"],
      required: true,
    },

    searchTerm: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

recommendationInteractionSchema.index({
  customer: 1,
  action: 1,
  createdAt: -1,
});

recommendationInteractionSchema.index({
  customer: 1,
  product: 1,
  action: 1,
});

module.exports = mongoose.model(
  "RecommendationInteraction",
  recommendationInteractionSchema
);