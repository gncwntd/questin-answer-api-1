const express = require("express");
const dotenv = require("dotenv");
const {connectDatabase} = require("./helpers/database/connectDatabase");
const {customErrorHandler} = require("./middlewares/errors/customErrorHandler");
const routers = require("./routers/index"); 
const path = require("path");    //express

//Environment Variables
dotenv.config({
    path : "./config/env/config.env"
})

//MongoDb Connection
connectDatabase();

const app = express();

//express body middleware
app.use(express.json());

const PORT = process.env.PORT;

//Routhers Middleware => herhangi bir middleware i biz <>.use() şeklinde dahil ediyoduk

//Routers Middleware
app.use("/api",routers);

//Error Handler
app.use(customErrorHandler);

//Static Files
// console.log(__dirname);
app.use(express.static(path.join(__dirname,"public")));


app.listen(PORT,() => {
    console.log(`Application Connected on ${PORT}! : ${process.env.NODE_ENV}`);
});
