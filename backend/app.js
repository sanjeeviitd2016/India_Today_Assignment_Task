const express= require('express');

const app = express();
const bodyparser= require('body-parser')
const cookieParser= require('cookie-parser');
const errorMiddleware = require('./middlewares/error.js');
const userRouter= require("./routes/user")
const newsRouter= require("./routes/news")

require('dotenv').config({path: __dirname + "/config/.env"})
require("./config/database")

app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/",userRouter);
app.use("/",newsRouter)

app.use(errorMiddleware);
module.exports= app