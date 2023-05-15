const User=require("../models/userModel");
const asyncHandler=require("express-async-handler");

const { generateToken } = require("../config/jwtToken");
const validateMongodbId= require("../utils/validateMongodbId");

const { generateRefreshToken } = require("../config/refreshToken");
const crypto =require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail =require("./emailCtrl")

//Create a user
const createUser = asyncHandler(async(req, res)=> {
    const email = req.body.email;
    const findUser= await User.findOne({email:email});
    if (!findUser){
        //create a new user
        const newUser= await User.create(req.body);
        res.json(newUser);
    } else {
        //user already exist
        throw new Error("User already exists");
    }
});
//login user
const loginUserCtrl = asyncHandler(async(req,res) =>{
    const {email, password} = req.body;

    //check if user exists or not
const findUser = await User.findOne({email});
if (findUser && (await findUser.isPasswordMatched(password))){
    const refreshToken=  await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
            refreshToken: refreshToken,
        },
        {
            new: true
        }
    );
    res.cookie('refresh Token', refreshToken,{
        httpOnly: true,
        maxAge: 72*60*60*1000,
    });
    res.json({
        _id:findUser?._id,
        firstname:findUser?.firstname,
        lastname:findUser?.lastname,
        email:findUser?.email,
        mobile:findUser?.mobile,
        token:generateToken(findUser?._id),

    });
} else {
    throw new Error("Invalid Credentials");
}
});
//handle refresh token

const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error  ("No refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err,decoded) =>{
        if (err || user.id !== decoded.id){
            throw new Error ("Something is wrong with refresh Token!")
        }
        const accessToken= generateToken(user?._id)
        res.json({accessToken});
    });

});

// handle LogOut *-*

const logout= asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user){
        res.clearCookie("refreshToken", {
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);//forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",

    });
    res.clearCookie("refreshToken", {
        httpOnly:true,
        secure:true,
    });
    return res.sendStatus(204);//forbidden

});

//Update a user

const updatedUser = asyncHandler(async (req,res)=>{
    const {_id}=req.user;
    validateMongodbId(_id);
    try {
        const updatedUser= await User.findByIdAndUpdate(
            _id,
            {
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile,

            },
            {
                new:true,
            }
            );
            res.json(updatedUser); 

    } catch (error) {
        throw new Error(error);
        
    }
})
// Get all users
const getallUser = asyncHandler(async (req,res)=>{
    try {
        const getUsers = await User.find();
        res.json(getUsers);

    } catch (error) {
        throw new Error(error)
        
    }

});

//Get a single user
const getaUser = asyncHandler(async (req, res)=> {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const getaUser = await User.findById(id) ;
        res.json({
            getaUser
        })
    } catch (error) {
        throw new Error(error);
        
    }
})
//Delete a  user
const deleteaUser = asyncHandler(async (req, res)=> {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser
        })
    } catch (error) {
        throw new Error(error);
        
    }
});
const blockUser = asyncHandler(async (req, res)=> {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const blockusr = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
                new : true
            },
            );
            res.json(blockusr);
    } catch (error) {
        throw new Error (error)
        
    }
});

const unblockUser = asyncHandler(async (req, res)=> {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new : true
            },
            );
            res.json(unblock);
    } catch (error) {
        throw new Error (error)
        
    }
});

//update password method
const updatePassword = asyncHandler ( async(req,res)=>{
    const {_id}=req.user;
    const {password} =req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password=password;
        const updatedPassword= await user.save();
        res.json(updatedPassword);
        
    } else {
        res.json(user);
    }
});
const forgotPasswordToken= asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const user = await User.findOne({email});
    if (!user) throw new Error(`user not found with this email!`);
    try {
        const token= await user.createPasswordResetToken();
        await user.save();
        const resetURL= `Please fllow this link to reset your password; this link is valid for 30 minutes onyl: <a href='http://localhost:6000/api/user/reset-password/${token}' > Click here </>`
        const data = {
            to: email,
            text: "Hello user",
            subject: "Forgot password link",
            htm: resetURL,

        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error)
        
    }

});

const resetPassword =asyncHandler(async(req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const  hashedToken=crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : {$gt: Date.now()},
    });

if (!user) throw new Error("Token expired, Please try again later!");
user.password= password;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();
res.json(user);

});


module.exports = {createUser,
     loginUserCtrl, 
     getallUser, 
     getaUser, 
     deleteaUser, 
     updatedUser, 
     blockUser,
     unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword};