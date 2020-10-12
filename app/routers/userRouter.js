const userRouter = require("express").Router();

const {getAllUsers, deleteUser} = require("../controllers/userController");
const {signup, login, forgotPassword, resetPassword, adminLogin } = require("../controllers/authController");
const {isLoggedIn} = require("../middlewares/authMiddleware");

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/login/admin").post(adminLogin);

userRouter.route("/forgot-password").patch(forgotPassword);
userRouter.route("/reset-password").patch(resetPassword);

userRouter.route("/").get(isLoggedIn([0]), getAllUsers);
userRouter.route("/:user_id").delete(isLoggedIn([0]), deleteUser);

module.exports = userRouter;