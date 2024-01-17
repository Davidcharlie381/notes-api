const UserController = require("../controllers/user.controller");
const AuthMiddleware = require("../middleware/auth");

const router = require("express").Router();

// router.use((req, res, next) => {
//   if (req.url === "/api/v1/users/" && req.method === "POST") {
//     console.log("gotten")
//     return next();
//   }
//   AuthMiddleware.isAuth(req, res, next);
// });

router
  .route("/")
  .get(AuthMiddleware.isAuth, AuthMiddleware.isAdmin, UserController.getUsers)
  .post(UserController.registerUser)
  .delete(
    AuthMiddleware.isAuth,
    AuthMiddleware.isAdmin,
    UserController.deleteAllUsers
  );

router.post("/login", UserController.loginUser);

router
  .route("/:id")
  .all(AuthMiddleware.isAuth)
  .get(UserController.getSingleUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
