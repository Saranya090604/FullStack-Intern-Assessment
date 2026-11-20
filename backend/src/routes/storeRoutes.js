const express = require("express");
const storeController = require("../controllers/storeController");
const { authenticate } = require("../middlewares/auth");
const { roleGuard } = require("../middlewares/roleGuard");

const router = express.Router();

router.get("/", authenticate, roleGuard("USER"), storeController.listStores);

module.exports = router;
