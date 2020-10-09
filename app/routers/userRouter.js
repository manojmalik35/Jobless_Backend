const userRouter = require("express").Router();

const {getAllUsers, deleteUser} = require("../controllers/userController");
const {signup, login, forgotPassword, resetPassword, logout} = require("../controllers/authController");
const {isLoggedIn} = require("../middlewares/authMiddleware");

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(isLoggedIn, logout);

userRouter.route("/forgot-password").patch(forgotPassword);
userRouter.route("/reset-password").patch(resetPassword);

userRouter.route("/").get(isLoggedIn, getAllUsers);
userRouter.route("/:user_id").delete(isLoggedIn, deleteUser);

module.exports = userRouter;