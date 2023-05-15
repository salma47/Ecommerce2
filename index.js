const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require ("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require ("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute")
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan=require("morgan");
//Database connection
dbConnect();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Middleware
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);

//errorHandler Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
