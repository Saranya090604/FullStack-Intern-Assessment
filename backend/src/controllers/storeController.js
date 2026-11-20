const storeService = require("../services/storeService");
const { asyncHandler } = require("../utils/asyncHandler");

const listStores = asyncHandler(async (req, res) => {
  const data = await storeService.listStoresForUser(req.user.id, req.query);
  res.json({ success: true, data });
});

module.exports = { listStores };
