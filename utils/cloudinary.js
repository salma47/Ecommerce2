const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME ,
  api_key:  process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

/////function for uploading img
const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(fileToUploads, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };

/////////cloudinary delete img

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(fileToDelete, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };
  
  module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };