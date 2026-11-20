const express = require("express");
const ratingController = require("../controllers/ratingController");
const { authenticate } = require("../middlewares/auth");
const { roleGuard } = require("../middlewares/roleGuard");
const { validate } = require("../middlewares/validate");
const { ratingValueSchema, submitRatingSchema } = require("../validators/schemas");

const router = express.Router();

router.post("/", authenticate, roleGuard("USER"), validate(submitRatingSchema), ratingController.submitRating);
router.put(
  "/:storeId",
  authenticate,
  roleGuard("USER"),
  validate(ratingValueSchema),
  ratingController.updateRating
);

module.exports = router;
