const adminService = require("../services/adminService");
const { asyncHandler } = require("../utils/asyncHandler");

const stats = asyncHandler(async (_req, res) => {
  const data = await adminService.getStats();
  res.json({ success: true, data });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

const createStore = asyncHandler(async (req, res) => {
  const store = await adminService.createStore(req.body);
  res.status(201).json({ success: true, data: store });
});

const listStores = asyncHandler(async (req, res) => {
  const data = await adminService.listStores(req.query);
  res.json({ success: true, data });
});

const listUsers = asyncHandler(async (req, res) => {
  const data = await adminService.listUsers(req.query);
  res.json({ success: true, data });
});

const getUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  const data = await adminService.getUserById(id);
  res.json({ success: true, data });
});

const availableOwners = asyncHandler(async (_req, res) => {
  const data = await adminService.listStoreOwnersWithoutStore();
  res.json({ success: true, data });
});

module.exports = {
  stats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUser,
  availableOwners,
};
