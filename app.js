const express = require("express");
const app = express();
require('dotenv').config();
const userRouter = require("./app/routers/userRouter");
const jobRouter = require("./app/routers/jobRouter");
const applicationRouter = require("./app/routers/applicationRouter");
app.use(express.json());

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
});

app.use(helmet());
app.use(limiter);

app.get("/*", function (req, res, next) {
    res.header("X-XSS-Protection", 1);
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, OPTIONS, PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type, Accept, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin"
    );
    next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/application", applicationRouter);
var port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Server is listening at port " + port);
})