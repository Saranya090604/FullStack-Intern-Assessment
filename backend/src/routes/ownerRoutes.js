const express = require("express");
const ownerController = require("../controllers/ownerController");
const { authenticate } = require("../middlewares/auth");
const { roleGuard } = require("../middlewares/roleGuard");

const router = express.Router();

router.get("/dashboard", authenticate, roleGuard("STORE_OWNER"), ownerController.dashboard);

module.exports = router;
