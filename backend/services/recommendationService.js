const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Review = require("../models/Review");
const Address = require("../models/Address");
const RecommendationInteraction = require(
  "../models/RecommendationInteraction"
);

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const getWords = (value) => {
  return normalizeText(value)
    .split(/[\s,.-]+/)
    .filter((word) => word.length >= 2);
};

const calculateLocationMatch = (
  productLocation,
  customerLocation
) => {
  const productText = normalizeText(
    productLocation
  );

  const customerText = normalizeText(
    customerLocation
  );

  if (!productText || !customerText) {
    return 0;
  }

  const productWords = getWords(productText);
  const customerWords = getWords(customerText);

  let matches = 0;

  customerWords.forEach((word) => {
    if (productWords.includes(word)) {
      matches += 1;
    }
  });

  if (matches >= 2) {
    return 15;
  }

  if (matches === 1) {
    return 8;
  }

  return 0;
};

const calculatePriceScore = (
  productPrice,
  preferredMin,
  preferredMax
) => {
  if (
    preferredMin === null ||
    preferredMax === null
  ) {
    return 0;
  }

  const price = Number(productPrice);

  if (price >= preferredMin && price <= preferredMax) {
    return 15;
  }

  const distance =
    price < preferredMin
      ? preferredMin - price
      : price - preferredMax;

  const range =
    Math.max(
      preferredMax - preferredMin,
      100
    );

  if (distance <= range * 0.5) {
    return 7;
  }

  return 0;
};

// Personalized recommendations
const getPersonalizedRecommendations = async (
  userId
) => {
  const user = await User.findById(userId)
    .populate("favorites", "category");

  if (!user) {
    throw new Error("User not found");
  }

  // ================= ORDERS =================

  const orders = await Order.find({
    customer: userId,
    orderStatus: "delivered",
  }).populate(
    "items.product",
    "category price name location"
  );

  // ================= CART =================

  const cart = await Cart.findOne({
    user: userId,
  }).populate(
    "items.product",
    "category price name location"
  );

  // ================= REVIEWS =================

  const reviews = await Review.find({
    customer: userId,
  }).populate(
    "product",
    "category price name location"
  );

  // ================= ADDRESS =================

  const address = await Address.findOne({
    user: userId,
    isDefault: true,
  });

  // If no default address, use latest address
  const customerAddress =
    address ||
    (await Address.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    }));

  // ================= INTERACTIONS =================

  const interactions =
    await RecommendationInteraction.find({
      customer: userId,
    })
      .populate(
        "product",
        "category price name description location"
      )
      .sort({
        createdAt: -1,
      })
      .limit(200);

  // ================= CATEGORY INTEREST =================

  const categoryScore = {};

  const addCategoryScore = (
    category,
    score
  ) => {
    if (!category) return;

    const key = normalizeText(category);

    categoryScore[key] =
      (categoryScore[key] || 0) + score;
  };

  // Delivered orders
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.product?.category) {
        addCategoryScore(
          item.product.category,
          25
        );
      }
    });
  });

  // Favorites
  user.favorites.forEach((product) => {
    if (product?.category) {
      addCategoryScore(
        product.category,
        20
      );
    }
  });

  // Cart
  if (cart) {
    cart.items.forEach((item) => {
      if (item.product?.category) {
        addCategoryScore(
          item.product.category,
          18
        );
      }
    });
  }

  // Reviews
  reviews.forEach((review) => {
    if (
      review.product?.category &&
      review.rating >= 4
    ) {
      addCategoryScore(
        review.product.category,
        review.rating * 4
      );
    }
  });

  // Product views
  interactions.forEach((interaction) => {
    if (
      interaction.action === "view" &&
      interaction.product?.category
    ) {
      addCategoryScore(
        interaction.product.category,
        10
      );
    }
  });

  // ================= SEARCH INTEREST =================

  const searchTerms = interactions
    .filter(
      (interaction) =>
        interaction.action === "search" &&
        interaction.searchTerm
    )
    .map((interaction) =>
      normalizeText(interaction.searchTerm)
    );

  // ================= PRICE PREFERENCE =================

  const priceValues = [];

  // Delivered order prices
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (Number.isFinite(Number(item.price))) {
        priceValues.push(Number(item.price));
      }
    });
  });

  // Cart prices
  if (cart) {
    cart.items.forEach((item) => {
      if (
        item.product &&
        Number.isFinite(
          Number(item.product.price)
        )
      ) {
        priceValues.push(
          Number(item.product.price)
        );
      }
    });
  }

  // Viewed product prices
  interactions.forEach((interaction) => {
    if (
      interaction.action === "view" &&
      interaction.product &&
      Number.isFinite(
        Number(interaction.product.price)
      )
    ) {
      priceValues.push(
        Number(interaction.product.price)
      );
    }
  });

  let preferredMin = null;
  let preferredMax = null;

  if (priceValues.length > 0) {
    const sortedPrices = [...priceValues].sort(
      (a, b) => a - b
    );

    const average =
      sortedPrices.reduce(
        (sum, price) => sum + price,
        0
      ) / sortedPrices.length;

    preferredMin = Math.max(
      0,
      average * 0.5
    );

    preferredMax =
      average * 1.5;
  }

  // ================= LOCATION =================

  const locationParts = [];

  if (customerAddress) {
    if (customerAddress.village) {
      locationParts.push(
        customerAddress.village
      );
    }

    if (customerAddress.city) {
      locationParts.push(
        customerAddress.city
      );
    }

    if (customerAddress.district) {
      locationParts.push(
        customerAddress.district
      );
    }

    if (customerAddress.state) {
      locationParts.push(
        customerAddress.state
      );
    }
  }

  const customerLocation =
    locationParts.join(" ");

  // ================= EXCLUDED PRODUCTS =================

  const excludedIds = new Set();

  // Purchased products
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.product?._id) {
        excludedIds.add(
          String(item.product._id)
        );
      }
    });
  });

  // Favorites
  user.favorites.forEach((product) => {
    if (product?._id) {
      excludedIds.add(
        String(product._id)
      );
    }
  });

  // ================= CANDIDATE PRODUCTS =================

  const products = await Product.find({
    isAvailable: true,
    quantity: {
      $gt: 0,
    },
  }).lean();

  // ================= SCORE PRODUCTS =================

  const scoredProducts = products.map(
    (product) => {
      let score = 0;

      const productCategory =
        normalizeText(product.category);

      // Category interest
      if (
        categoryScore[productCategory]
      ) {
        score +=
          categoryScore[productCategory];
      }

      // Search relevance
      if (searchTerms.length > 0) {
        const searchableText =
          normalizeText(
            `${product.name} ${product.category} ${product.description} ${product.shopName} ${product.location}`
          );

        searchTerms.forEach((term) => {
          if (
            searchableText.includes(term)
          ) {
            score += 20;
          } else {
            const words = getWords(term);

            words.forEach((word) => {
              if (
                searchableText.includes(word)
              ) {
                score += 5;
              }
            });
          }
        });
      }

      // Product view frequency
      const viewCount =
        interactions.filter(
          (interaction) =>
            interaction.action === "view" &&
            String(
              interaction.product?._id
            ) === String(product._id)
        ).length;

      score +=
        Math.min(viewCount * 8, 32);

      // Cart match
      if (cart) {
        const isInCart =
          cart.items.some(
            (item) =>
              String(
                item.product?._id
              ) === String(product._id)
          );

        if (isInCart) {
          score += 25;
        }
      }

      // Review/category preference
      const positiveReview =
        reviews.some(
          (review) =>
            review.rating >= 4 &&
            normalizeText(
              review.product?.category
            ) === productCategory
        );

      if (positiveReview) {
        score += 20;
      }

      // Price preference
      score += calculatePriceScore(
        product.price,
        preferredMin,
        preferredMax
      );

      // Location preference
      score += calculateLocationMatch(
        product.location,
        customerLocation
      );

      // Existing product rating
      score +=
        Number(product.rating || 0) * 2;

      // Newer products get a small boost
      const ageInDays =
        product.createdAt
          ? Math.max(
              0,
              (
                Date.now() -
                new Date(
                  product.createdAt
                ).getTime()
              ) /
                (1000 * 60 * 60 * 24)
            )
          : 9999;

      if (ageInDays <= 30) {
        score += 5;
      }

      // Don't recommend already purchased/favorited
      if (
        excludedIds.has(
          String(product._id)
        )
      ) {
        score = -999999;
      }

      return {
        ...product,
        recommendationScore: score,
      };
    }
  );

  // ================= SORT =================

  scoredProducts.sort(
    (a, b) => {
      if (
        b.recommendationScore !==
        a.recommendationScore
      ) {
        return (
          b.recommendationScore -
          a.recommendationScore
        );
      }

      if (
        Number(b.rating || 0) !==
        Number(a.rating || 0)
      ) {
        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );
      }

      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    }
  );

  let recommendations =
    scoredProducts
      .filter(
        (product) =>
          product.recommendationScore >
          0
      )
      .slice(0, 10);

  // ================= FALLBACK =================

  if (
    recommendations.length === 0
  ) {
    recommendations =
      products
        .filter(
          (product) =>
            !excludedIds.has(
              String(product._id)
            )
        )
        .sort((a, b) => {
          if (
            Number(b.rating || 0) !==
            Number(a.rating || 0)
          ) {
            return (
              Number(b.rating || 0) -
              Number(a.rating || 0)
            );
          }

          return (
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
          );
        })
        .slice(0, 10);
  }

  return recommendations;
};

// Similar products
// Existing functionality preserved
const getSimilarProducts = async (
  productId
) => {
  const product =
    await Product.findById(productId);

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  const products =
    await Product.find({
      category: product.category,

      _id: {
        $ne: productId,
      },

      isAvailable: true,
    })
      .sort({
        rating: -1,
        createdAt: -1,
      })
      .limit(10);

  return products;
};

module.exports = {
  getPersonalizedRecommendations,
  getSimilarProducts,
};