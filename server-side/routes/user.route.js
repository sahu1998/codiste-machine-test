const express = require("express");
const UserController = require("../controller/user.controller");
const { verifyUser } = require("../middleware/auth.middleware");
const router = express.Router();

router
  .route("/")
  .post(UserController.createUser)
  .get(UserController.getAllUsers);
router
  .route("/:id")
  .delete(UserController.deleteUser)
  .put(UserController.updateUser)
  .get(UserController.getUserById);

// Login api
router.route("/login").post(UserController.loginUser);

// Profile api for logged in user
router.route("/auth/profile").get(verifyUser, UserController.getUserById);

module.exports = router;
