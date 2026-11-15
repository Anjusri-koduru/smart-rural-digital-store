const jwt = require("jsonwebtoken");

const env = require("../config/env");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRE,
    }
  );
};

module.exports = generateToken;