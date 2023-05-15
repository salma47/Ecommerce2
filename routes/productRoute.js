const express = require ("express");
const {createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct}=require("../controller/productCtrl")
const router= express.Router();
const {isAdmin, authMiddleware}=require("../middlewares/authMiddleware")


router.post("/",authMiddleware,isAdmin,createProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);
router.get("/:id",getaProduct);
router.get("/",getAllProduct);


module.exports = router;