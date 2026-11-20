const express = require("express");
const authController = require("../controllers/authController");
const { validate } = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");
const { roleGuard } = require("../middlewares/roleGuard");
const { signupSchema, loginSchema, updatePasswordSchema } = require("../validators/schemas");

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);
router.patch(
  "/update-password",
  authenticate,
  roleGuard("USER", "STORE_OWNER"),
  validate(updatePasswordSchema),
  authController.updatePassword
);

module.exports = router;
