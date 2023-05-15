const mongoose = require('mongoose'); 
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
            },
    description:{
        type:String,
        required:true,
           },
    category:{
        type:String,
        required:true,
        
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisLiked:{
        type:Boolean,
        default:false,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_960_720.jpg"
    },
    author:{
        type:String,
        default:"admin",
    }
},
{
  toJSON:{
    virtuals:true,
  },
  toObject:{
    virtuals:true,
  },
  timestamps:true,

}

);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);