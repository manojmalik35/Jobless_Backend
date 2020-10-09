const userRouter = require("express").Router();

const {signup, login, forgotPassword, resetPassword, getAllUsers, deleteUser} = require("../controllers/userController");
const {isLoggedIn} = require("../middlewares/authController");

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

userRouter.route("/forgot-password").patch(forgotPassword);
userRouter.route("/reset-password").patch(resetPassword);

userRouter.route("/").get(isLoggedIn, getAllUsers);
userRouter.route("/:user_id").delete(isLoggedIn, deleteUser);

module.exports = userRouter;