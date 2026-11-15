const bcrypt = require("bcryptjs");

const User = require("../models/User");

const env = require("../config/env");

const generateToken = require("../utils/generateToken");

// ================= ROLE HELPERS =================

const ALL_ROLES = [
  "customer",
  "seller",
  "admin",
];

const getRolesForUser = (user) => {
  const currentRoles = Array.isArray(user.roles)
    ? user.roles
    : [];

  const roles = [...currentRoles];

  // Always keep the current active role
  if (user.role && !roles.includes(user.role)) {
    roles.push(user.role);
  }

  // Admin account gets ALL roles
  if (
    env.ADMIN_EMAIL &&
    user.email.toLowerCase().trim() ===
      env.ADMIN_EMAIL.toLowerCase().trim()
  ) {
    return [
      "admin",
      "seller",
      "customer",
    ];
  }

  // Seller can also be customer
  if (
    roles.includes("seller") &&
    !roles.includes("customer")
  ) {
    roles.push("customer");
  }

  // Customer + seller accounts
  if (
    roles.includes("customer") &&
    roles.includes("seller")
  ) {
    return [
      "seller",
      "customer",
    ];
  }

  return roles.length
    ? roles
    : ["customer"];
};

// ================= USER RESPONSE =================

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    roles: user.roles,
    phone: user.phone,
    profileImage: user.profileImage,
  };
};

// ================= REGISTER =================

const registerUser = async ({
  name,
  email,
  password,
  phone = "",
  role = "customer",
}) => {
  if (!name || !email || !password) {
    throw new Error(
      "Name, email and password are required"
    );
  }

  email = email.toLowerCase().trim();

  // Only Customer and Seller can be selected
  // from the public Register page.
  if (
    !["customer", "seller"].includes(role)
  ) {
    role = "customer";
  }

  const isAdminEmail =
    env.ADMIN_EMAIL &&
    email ===
      env.ADMIN_EMAIL.toLowerCase().trim();

  // ================= EXISTING USER =================

  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    /*
      If this is the configured Admin email,
      make sure the account has ALL roles.
    */

    if (isAdminEmail) {
      const passwordCorrect =
        await bcrypt.compare(
          password,
          existingUser.password
        );

      if (!passwordCorrect) {
        throw new Error(
          "This email already exists. Please use the existing account password."
        );
      }

      existingUser.roles = [
        "admin",
        "seller",
        "customer",
      ];

      existingUser.role = "admin";

      await existingUser.save();

      const token =
        generateToken(existingUser);

      return {
        user: getUserResponse(
          existingUser
        ),
        token,
      };
    }

    /*
      Existing normal user wants another role.

      Example:

      Existing:
      customer

      Register again as:
      seller

      Result:
      customer + seller
    */

    const passwordCorrect =
      await bcrypt.compare(
        password,
        existingUser.password
      );

    if (!passwordCorrect) {
      throw new Error(
        "This email already exists. Please use the same password used for your existing account."
      );
    }

    let roles = getRolesForUser(
      existingUser
    );

    // Add requested role
    if (!roles.includes(role)) {
      roles.push(role);
    }

    // Seller always gets customer access
    if (
      role === "seller" &&
      !roles.includes("customer")
    ) {
      roles.push("customer");
    }

    // Remove duplicates
    roles = [
      ...new Set(roles),
    ];

    // Keep only valid roles
    roles = roles.filter((item) =>
      ALL_ROLES.includes(item)
    );

    existingUser.roles = roles;

    /*
      The newly selected role becomes
      the active role.

      Example:
      customer → seller

      active role becomes seller.
    */

    existingUser.role = role;

    await existingUser.save();

    const token =
      generateToken(existingUser);

    return {
      user: getUserResponse(
        existingUser
      ),
      token,
    };
  }

  // ================= NEW USER =================

  const hashedPassword =
    await bcrypt.hash(password, 10);

  let newRole = role;

  let roles = [];

  /*
    Admin email gets all three roles.
  */

  if (isAdminEmail) {
    newRole = "admin";

    roles = [
      "admin",
      "seller",
      "customer",
    ];
  }

  /*
    New seller gets seller + customer.
  */

  else if (role === "seller") {
    newRole = "seller";

    roles = [
      "seller",
      "customer",
    ];
  }

  /*
    Normal customer.
  */

  else {
    newRole = "customer";

    roles = [
      "customer",
    ];
  }

  const user = await User.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    phone,
    role: newRole,
    roles,
  });

  const token =
    generateToken(user);

  return {
    user: getUserResponse(user),
    token,
  };
};

// ================= LOGIN =================

const loginUser = async (
  email,
  password
) => {
  if (!email || !password) {
    throw new Error(
      "Email and password are required"
    );
  }

  email = email.toLowerCase().trim();

  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new Error(
      "Invalid email or password"
    );
  }

  /*
    Admin access is allowed ONLY
    for the configured ADMIN_EMAIL.
  */

  const isAdminEmail =
    env.ADMIN_EMAIL &&
    email ===
      env.ADMIN_EMAIL.toLowerCase().trim();

  if (
    user.role === "admin" &&
    !isAdminEmail
  ) {
    throw new Error(
      "You are not authorized to access the Admin panel."
    );
  }

  /*
    If this is the Admin account,
    always make all three roles available.
  */

  if (isAdminEmail) {
    user.roles = [
      "admin",
      "seller",
      "customer",
    ];

    user.role = "admin";

    await user.save();
  } else {
    /*
      Repair old accounts.
    */

    const correctRoles =
      getRolesForUser(user);

    const rolesChanged =
      JSON.stringify(user.roles) !==
      JSON.stringify(correctRoles);

    if (rolesChanged) {
      user.roles = correctRoles;
      await user.save();
    }
  }

  const token =
    generateToken(user);

  return {
    user: getUserResponse(user),
    token,
  };
};

// ================= CURRENT USER =================

const getCurrentUser = async (
  userId
) => {
  const user =
    await User.findById(userId)
      .select("-password");

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  /*
    Admin account should always have
    all three roles.
  */

  const isAdminEmail =
    env.ADMIN_EMAIL &&
    user.email.toLowerCase().trim() ===
      env.ADMIN_EMAIL.toLowerCase().trim();

  if (isAdminEmail) {
    user.roles = [
      "admin",
      "seller",
      "customer",
    ];

    await user.save();
  } else {
    /*
      Repair old customer/seller accounts.
    */

    const correctRoles =
      getRolesForUser(user);

    const rolesChanged =
      JSON.stringify(user.roles) !==
      JSON.stringify(correctRoles);

    if (rolesChanged) {
      user.roles = correctRoles;
      await user.save();
    }
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};