const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const env = require("../config/env");


// =========================================================
// GET AVAILABLE ROLES
// =========================================================

const getAvailableRoles = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select(
      "name email role roles"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isAdminEmail =
      env.ADMIN_EMAIL &&
      user.email.toLowerCase().trim() ===
        env.ADMIN_EMAIL.toLowerCase().trim();


    let roles;


    // Admin always gets all 3 roles
    if (isAdminEmail) {

      roles = [
        "admin",
        "seller",
        "customer",
      ];

      if (
        user.role !== "admin" ||
        JSON.stringify(user.roles) !==
          JSON.stringify(roles)
      ) {
        user.role = "admin";
        user.roles = roles;

        await user.save();
      }

    } else {

      roles =
        user.roles &&
        user.roles.length
          ? [...user.roles]
          : [user.role];


      // Seller can always act as customer
      if (
        roles.includes("seller") &&
        !roles.includes("customer")
      ) {
        roles.push("customer");
      }


      // Remove duplicates
      roles = [
        ...new Set(roles),
      ];


      // Save repaired roles
      if (
        JSON.stringify(user.roles) !==
        JSON.stringify(roles)
      ) {
        user.roles = roles;

        await user.save();
      }
    }


    return res.status(200).json({
      success: true,
      currentRole: user.role,
      availableRoles: roles,
    });

  } catch (error) {

    console.error(
      "Get available roles error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// SWITCH ROLE
// =========================================================

const switchRole = async (req, res) => {
  try {

    const { role } = req.body;


    const allowedRoles = [
      "customer",
      "seller",
      "admin",
    ];


    if (
      !allowedRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }


    const user =
      await User.findById(req.user.id);


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const isAdminEmail =
      env.ADMIN_EMAIL &&
      user.email.toLowerCase().trim() ===
        env.ADMIN_EMAIL.toLowerCase().trim();


    // =====================================================
    // ADMIN ACCOUNT
    // =====================================================

    if (isAdminEmail) {

      user.roles = [
        "admin",
        "seller",
        "customer",
      ];

    } else {

      // ===================================================
      // NORMAL USER
      // ===================================================

      let roles =
        user.roles &&
        user.roles.length
          ? [...user.roles]
          : [user.role];


      // Seller always gets customer access
      if (
        roles.includes("seller") &&
        !roles.includes("customer")
      ) {
        roles.push("customer");
      }


      roles = [
        ...new Set(roles),
      ];


      user.roles = roles;
    }


    // =====================================================
    // CHECK ROLE ACCESS
    // =====================================================

    if (
      !user.roles.includes(role)
    ) {

      return res.status(403).json({
        success: false,
        message:
          `You do not have ${role} access.`,
      });

    }


    // Admin role only for configured admin email
    if (
      role === "admin" &&
      !isAdminEmail
    ) {

      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access the Admin panel.",
      });

    }


    // =====================================================
    // CHANGE ACTIVE ROLE
    // =====================================================

    user.role = role;

    await user.save();


    // Generate new token with new active role
    const token =
      generateToken(user);


    return res.status(200).json({

      success: true,

      message:
        `Switched to ${role} account successfully`,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles,
      },

      token,

    });

  } catch (error) {

    console.error(
      "Switch role error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getAvailableRoles,
  switchRole,
};