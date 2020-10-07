const userRouter = require("express").Router();

// const {signup} = require("../middlewares/authController");
const {signup, login, forgotPassword, resetPassword} = require("../controllers/userController");

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

userRouter.route("/forgot-password").patch(forgotPassword);
userRouter.route("/reset-password").patch(resetPassword);

module.exports = userRouter;