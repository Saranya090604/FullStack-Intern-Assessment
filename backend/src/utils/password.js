const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const hashPassword = (plain) => bcrypt.hash(plain, 10);
const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);

const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  address: user.address,
  role: user.role,
});

module.exports = { hashPassword, comparePassword, signToken, publicUser };
