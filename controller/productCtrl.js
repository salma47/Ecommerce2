const Product = require("../models/productModel");
const asyncHandler =require("express-async-handler");
const User = require("../models/userModel");
const slugify =require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");


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
        // Filtering search
        const queryObj={...req.query};
        const excludeFields=["page","sort","limit","fields"];
        excludeFields.forEach((el)=> delete queryObj[el]);
        let queryStr= JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match)=> `$${match}`);

       let query = Product.find(JSON.parse(queryStr));

       //Sorting search

       if (req.query.sort) {
        
        const sortBy=req.query.sort.split(",").join(" ");
        query=query.sort(sortBy);
       } else {
        query= query.sort("-createdAt");
        
       }

       ///Limiting the fields ( fields to not show for user)

       if (req.query.fields) {
        const fields=req.query.sort.split(",").join(" ");
        query=query.select(fields);
        
       } else {
        query=query.select("-__v");
        
       }

       /// Pagination
       const page=req.query.page;
       const limit = req.query.limit;
       const skip= (page - 1)*limit;
       query= query.skip(skip).limit(limit);
       if (req.query.page) {
        productCount = await Product.countDocuments();
        if(skip >=productCount) throw new Error ("This page does not exist!");
        
       }
       console.log(page,limit,skip);


       const product = await query;
        res.json(product);
        
    } catch (error) {
        throw new Error(error)
        
    }
});

//////whishlist fonctionality
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
      const user = await User.findById(_id);
      const alreadyadded = user.wishlist.find((id)=>id.toString() ===prodId);
      if (alreadyadded) {
        let user = await User.findByIdAndUpdate(
          _id,
          {
            $pull: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      } else {
        let user = await User.findByIdAndUpdate(
          _id,
          {
            $push: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      }
    } catch (error) {
      throw new Error(error);
    }
  });
  

  ////////////////Rating product

  const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
      const product = await Product.findById(prodId);
      let alreadyRated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      );
      if (alreadyRated) {
        const updateRating = await Product.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
      } else {
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                star: star,
                comment: comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
        };
        ///////total ratings
        const getallratings = await Product.findById(prodId);
        //get total number of ratings
        let totalRating = getallratings.ratings.length;
        //////sum the rating(map gives array and the reduce gives us the sum of the array)
        let ratingsum = getallratings.ratings
          .map((item) => item.star)
          .reduce((prev, curr) => prev + curr, 0);
          //calculate the average of rating
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
          prodId,
          {
            totalrating: actualRating,
          },
          { new: true }
        );
        res.json(finalproduct);
      } catch (error) {
        throw new Error(error);
      }
    });
    //////////

    const uploadIamges = asyncHandler(async(req,res)=>{
        console.log(req.files)
    });
    





module.exports={createProduct, 
    getaProduct, 
    getAllProduct,
    updateProduct,
     deleteProduct,
    addToWishlist,
    rating,
    uploadIamges};