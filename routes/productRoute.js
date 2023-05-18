const express = require ("express");
const {createProduct, 
    getaProduct,
     getAllProduct, 
     updateProduct,
      deleteProduct, 
      addToWishlist,
      rating,
      uploadIamges}=require("../controller/productCtrl")
const router= express.Router();
const {isAdmin, authMiddleware}=require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");


router.post("/",authMiddleware,isAdmin,createProduct);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images,10"),productImgResize, uploadIamges);
router.get("/:id",getaProduct);

router.put("/wishlist",authMiddleware, addToWishlist);
router.put("/rating",authMiddleware, rating);

router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);
router.get("/",getAllProduct);


module.exports = router;