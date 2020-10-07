const userRouter = require("express").Router();

// const {signup} = require("../middlewares/authController");
const {signup, login} = require("../controllers/userController");

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

module.exports = userRouter;