const ownerService = require("../services/ownerService");
const { asyncHandler } = require("../utils/asyncHandler");

const dashboard = asyncHandler(async (req, res) => {
  const data = await ownerService.getDashboard(req.user.id, req.query);
  res.json({ success: true, data });
});

module.exports = { dashboard };
