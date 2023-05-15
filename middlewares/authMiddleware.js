//we are going to verify our token and verify if the user is admin or not

const User =require("../models/userModel");
const jwt = require ("jsonwebtoken");
const asyncHandler = require ("express-async-handler");


const authMiddleware = asyncHandler(async (req,res,next) =>{
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')){
        token=req.headers.authorization.split(" ")[1];
        try {
            if (token){
                const decoded=jwt.verify(token, process.env.JWT_SECRET);
                //console.log(decoded);
                const user = await User.findById(decoded?.id);
                req.user= user;
                next();
            }
        } catch (error) {
            throw new Error ("Not Aithorized token expired! Please login again!")
            
        }

    } else {
        throw new Error ("There is no token attached to header")
    }
});

const isAdmin = asyncHandler(async(req, res, next) =>{
    //console.log(req.user);
    // we will take the email from req.user then we will find the user
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if (adminUser.role!== "admin"){
        throw new Error ("YOU CAN NOT PROCESS THIS REQUEST BECAUSE YOU ARE NOT AN ADMIN !");
    } else {
        next();
    }
});
module.exports={authMiddleware, isAdmin};