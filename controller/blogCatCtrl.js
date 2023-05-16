const Category = require("../models/blogCatModel");
const asyncHandler = require ("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");

const createCategory= asyncHandler(async(req,res)=> {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
        
    }
});
const updateCategory= asyncHandler(async(req,res)=> {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new:true,
        });
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
        
    }
});
////////////delete  category
const deleteCategory= asyncHandler(async(req,res)=> {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
        
    }
});

///////////fetch for category
const getCategory= asyncHandler(async(req,res)=> {
    const {id}=req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
        
    }
});
/////////// get all categories
const getallCategory= asyncHandler(async(req,res)=> {
    
        try {
        const getallCategories = await Category.find();
        res.json(getallCategories);
    } catch (error) {
        throw new Error(error);
        
    }
});


module.exports = {createCategory, updateCategory, deleteCategory, getCategory, getallCategory};