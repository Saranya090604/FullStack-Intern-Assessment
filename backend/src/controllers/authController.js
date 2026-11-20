const authService = require("../services/authService");
const { asyncHandler } = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json({ success: true, ...result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, ...result });
});

const updatePassword = asyncHandler(async (req, res) => {
  await authService.updatePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: "Password updated successfully" });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      address: req.user.address,
      role: req.user.role,
    },
  });
});

module.exports = { signup, login, updatePassword, me };
