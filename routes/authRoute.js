const express = require ("express");
const { createUser,
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
    resetPassword } = require("../controller/userCtrl");
const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/forgot-password-token",forgotPasswordToken);
router.put("/reset-password/:token",resetPassword);

router.get("/all-users", getallUser);
router.get("/refresh",handleRefreshToken);
router.get("/:id",authMiddleware,isAdmin, getaUser);
router.post("/logout",logout);

router.delete("/:id", deleteaUser);
router.put("/edit-user",authMiddleware, updatedUser);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser);
router.put("/password",authMiddleware,updatePassword);//we need authMiddleware to get req.user and with it we get the _id



module.exports=router;
