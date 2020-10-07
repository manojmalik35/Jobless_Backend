const express = require("express");
const app = express();
require('dotenv').config();
const userRouter = require("./app/routers/userRouter");
const jobRouter = require("./app/routers/jobRouter");
const applicationRouter = require("./app/routers/applicationRouter");
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/application", applicationRouter);
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening at port " + port);
})