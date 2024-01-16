const UserController = require("../controllers/user.controller");

const router = require("express").Router();

router
  .route("/")
  .get(UserController.getUsers)
  .post(UserController.registerUser);

router
  .route("/:id")
  .get(UserController.getSingleUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
