const Blog = require("../models/blogModel");
const User= require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");


const createBlog= asyncHandler(async(req,res)=>{

    try {
        const  newBlog = await Blog.create(req.body);
        res.json({ newBlog});
        
    } catch (error) {
        throw new Error (error);
        
    }


});

////////update blog 
const updateBlog= asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const  updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new : true,
        });
        res.json(updateBlog);
        
    } catch (error) {
        throw new Error (error);
        
    }


});

///////////get blog

const getBlog= asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const  getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        const updateViews =await Blog.findByIdAndUpdate(
            id,
            {
                $inc:{numViews:1},
            },
            {new:true}
        );
        res.json(getBlog);
        
    }   catch (error) {
        throw new Error (error);
        
    }


});
////////GET ALL BLOGS

const getAllBlogs= asyncHandler(async (req,res)=>{

    try {
        const  getBlogs = await Blog.find();
        
        res.json(getBlogs);
        
    }   catch (error) {
        throw new Error (error);
        
    }


}); 

///////////////Delete blog
const deleteBlog= asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);

    try {
        const  deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
        
    } catch (error) {
        throw new Error (error);
        
    }


});
////////likeBlog fonctionality

const liketheBlog = asyncHandler( async (req,res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId);
    ///we the help of blogId we need to find the blog which we want to like it
    const blog = await Blog.findById(blogId);
    ////only login user can like or dislike

    const loginUserId = req?.user?._id;
    //Did the user liked the blog?
    const isLiked = blog?.isLiked;
////find if the user has disliked the post?

const alreadyDisliked=blog?.dislikes?.find(
    (userId => userId?.toString() === loginUserId?.toString())
);
if (alreadyDisliked){
    const blog = await Blog.findByIdAndUpdate(blogId, {
        //pull the dislike
        $pull: { dislikes: loginUserId},
        isDisLiked: false
    },
    {new: true}
    );
    res.json(blog);
}
if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(blogId, {
        //pull the dislike
        $pull: { likes: loginUserId},
        isLiked: false,
    },
    {new: true}
    );
    res.json(blog);
} else {
    const blog = await Blog.findByIdAndUpdate(blogId, {
        //pull the dislike
        $push: { likes: loginUserId},
        isLiked: true,
    },
    {new: true}
    );
    res.json(blog);

}

});
///////lDislikeBlog fonctionality

const disliketheBlog = asyncHandler( async (req,res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId);
    ///we the help of blogId we need to find the blog which we want to like it
    const blog = await Blog.findById(blogId);
    ////only login user can like or dislike

    const loginUserId = req?.user?._id;
    //Did the user liked the blog?
    const isDisLiked = blog?.isDisLiked;
////find if the user has disliked the post?

const alreadyliked=blog?.likes?.find(
    (userId => userId?.toString() === loginUserId?.toString())
);
if (alreadyliked){
    const blog = await Blog.findByIdAndUpdate(blogId, {
        //pull the dislike
        $pull: { likes: loginUserId},
        isLiked: false
    },
    {new: true}
    );
    res.json(blog);
}
if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(blogId, {
        //pull the dislike
        $pull: { dislikes: loginUserId},
        isDisLiked: false,
    },
    {new: true}
    );
    res.json(blog);
} else {
    const blog = await Blog.findByIdAndUpdate(blogId, {
        //pull the dislike
        $push: { dislikes: loginUserId},
        isDisLiked: true,
    },
    {new: true}
    );
    res.json(blog);

}

});
//// UPLOAD IMG IN THE BLOG
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const findBlog = await Blog.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          }),
        },
        {
          new: true,
        }
      );
      res.json(findBlog);
    } catch (error) {
      throw new Error(error);
    }
  });
module.exports= {createBlog, 
    updateBlog, 
    getBlog,
    getAllBlogs, 
    deleteBlog, 
    liketheBlog,
    disliketheBlog,
    uploadImages};