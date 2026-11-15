const User = require("../models/User");
const Product = require("../models/Product");

// ==========================================
// GET CUSTOMER PROFILE
// ==========================================

const getCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate(
        "favorites",
        "name price image category rating"
      )
      .populate(
        "followingSellers",
        "name email profileImage"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// CUSTOMER DASHBOARD
// ==========================================

const getCustomerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate(
        "favorites",
        "name price image category rating"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      dashboard: {
        totalFavorites: user.favorites.length,
        totalFollowingSellers:
          user.followingSellers.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// BROWSE PRODUCTS
// ==========================================

const getCustomerProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    // ------------------------------------------
    // BASIC FILTER
    // ------------------------------------------

    const filter = {
      isAvailable: true,
    };

    // ------------------------------------------
    // SEARCH
    // Search in:
    // Product Name
    // Category
    // Description
    // Shop Name
    // Location
    // ------------------------------------------

    if (search && search.trim()) {
      const searchText = search.trim();

      // Escape special regex characters
      const escapedSearch = searchText.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = {
        $regex: escapedSearch,
        $options: "i",
      };

      filter.$or = [
        {
          name: searchRegex,
        },
        {
          category: searchRegex,
        },
        {
          description: searchRegex,
        },
        {
          shopName: searchRegex,
        },
        {
          location: searchRegex,
        },
      ];
    }

    // ------------------------------------------
    // CATEGORY FILTER
    // ------------------------------------------

    if (
      category &&
      category.trim() &&
      category !== "All Categories"
    ) {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i",
      };
    }

    // ------------------------------------------
    // PRICE FILTER
    // ------------------------------------------

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // ------------------------------------------
    // SORT
    // ------------------------------------------

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price_low") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price_high") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        rating: -1,
      };
    }

    // ------------------------------------------
    // GET PRODUCTS
    // ------------------------------------------

    const products = await Product.find(filter)
      .populate(
        "seller",
        "name email profileImage"
      )
      .sort(sortOption);

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get Customer Products Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET FAVORITES
// ==========================================

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate(
        "favorites",
        "name description price quantity category image location shopName rating totalReviews isAvailable seller"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADD FAVORITE
// ==========================================

const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyFavorite =
      user.favorites.some(
        (id) =>
          id.toString() ===
          productId.toString()
      );

    if (alreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: "Product is already in favorites",
      });
    }

    user.favorites.push(productId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to favorites",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// REMOVE FAVORITE
// ==========================================

const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.favorites =
      user.favorites.filter(
        (id) =>
          id.toString() !==
          productId.toString()
      );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// FOLLOW SELLER
// ==========================================

const followSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Cannot follow yourself
    if (
      req.user.id.toString() ===
      sellerId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Check seller
    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Current user
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already following?
    const alreadyFollowing =
      user.followingSellers.some(
        (id) =>
          id.toString() ===
          sellerId.toString()
      );

    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        message:
          "You are already following this seller",
      });
    }

    user.followingSellers.push(
      sellerId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Seller followed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UNFOLLOW SELLER
// ==========================================

const unfollowSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.followingSellers =
      user.followingSellers.filter(
        (id) =>
          id.toString() !==
          sellerId.toString()
      );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Seller unfollowed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET FOLLOWED SELLERS
// ==========================================

const getFollowedSellers = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    ).populate(
      "followingSellers",
      "name email phone profileImage role"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.followingSellers.length,
      sellers: user.followingSellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getCustomerProfile,
  getCustomerDashboard,
  getCustomerProducts,
  getFavorites,
  addFavorite,
  removeFavorite,
  followSeller,
  unfollowSeller,
  getFollowedSellers,
};