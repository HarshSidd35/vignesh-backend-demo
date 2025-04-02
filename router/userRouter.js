const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { isUser} = require("../middleware/isUser");
const {isAdmin}  = require("../middleware/isAdmin");

// User Routes
router.post("/", userController.createUser);
router.post("/addAdmin", isAdmin, userController.createAdmin);
router.get("/", userController.getUsers);
router.get("/:id", isUser, userController.getUserById);
router.put("/:id", isUser, userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;