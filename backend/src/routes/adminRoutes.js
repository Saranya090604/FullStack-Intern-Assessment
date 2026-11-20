const express = require("express");
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middlewares/auth");
const { roleGuard } = require("../middlewares/roleGuard");
const { validate } = require("../middlewares/validate");
const { createUserSchema, createStoreSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate, roleGuard("ADMIN"));

router.get("/stats", adminController.stats);
router.get("/owners/available", adminController.availableOwners);
router.post("/users", validate(createUserSchema), adminController.createUser);
router.get("/users", adminController.listUsers);
router.get("/users/:id", adminController.getUser);
router.post("/stores", validate(createStoreSchema), adminController.createStore);
router.get("/stores", adminController.listStores);

module.exports = router;
