const ratingService = require("../services/ratingService");
const { asyncHandler } = require("../utils/asyncHandler");

const submitRating = asyncHandler(async (req, res) => {
  const storeId = Number(req.body.storeId);
  const data = await ratingService.upsertRating(req.user.id, storeId, req.body.rating);
  res.status(201).json({ success: true, data });
});

const updateRating = asyncHandler(async (req, res) => {
  const storeId = Number(req.params.storeId);
  const data = await ratingService.upsertRating(req.user.id, storeId, req.body.rating);
  res.json({ success: true, data });
});

module.exports = { submitRating, updateRating };
