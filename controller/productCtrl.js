const Product = require("../models/productModel");
const asyncHandler =require("express-async-handler");
const slugify =require("slugify");


const createProduct = asyncHandler(async(req,res)=>{

    try {
        if (req.body.title) {
            req.body.slug=slugify(req.body.title);
        }
        const newProduct= await Product.create(req.body);
        res.json(newProduct)

    } catch (error) {
        throw new Error(error);
    }
    
});

//update a product
const updateProduct = asyncHandler(async(req,res)=>{
    const id=req.params;
try {
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    const updateProduct= await Product.findOneAndUpdate({id},req.body,{
        new:true,
    });
    res.json(updateProduct)
    
} catch (error) {
    throw new Error(error)
    
}

});
//delete a product
const deleteProduct = asyncHandler(async(req,res)=>{
    const id=req.params;
try{
    const deleteProduct= await Product.findOneAndDelete(id);
      res.json(deleteProduct) ;
} 
 catch (error) {
    throw new Error(error)
    
}

});

// search for product
const getaProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    try {
        const findProduct= await Product.findById(id);
        res.json(findProduct);


        
    } catch (error) {
        throw new Error(error)
        
    }
});

const getAllProduct = asyncHandler(async(req,res)=>{
    try {
        const getallProducts= await Product.find();
        res.json(getallProducts);
        
    } catch (error) {
        throw new Error(error)
        
    }
})




module.exports={createProduct, getaProduct, getAllProduct,updateProduct, deleteProduct};