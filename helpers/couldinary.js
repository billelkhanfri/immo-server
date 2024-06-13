const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUNINARY_CLOUD_NAME,
  api_key: process.env.CLOUNINARY_API_KEY,
  api_secret: process.env.CLOUNINARY_API_SECRECT,
});


// Cloudinary Upload Image
 

const cloudinaryUploadImage = async (fileToUpload) => {
    
    try { 
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto'
        });
        return data;
    } catch (error){
        return error;
    }
}

const cloudinaryRemoveImage = async (imagePiblicId) => {
  try {
    const result = await cloudinary.Uploader.destroy(imagePiblicId)

    return result;
  } catch {
    error;
  }
  {
    return error;
  }
};
module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage

}