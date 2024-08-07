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
      resource_type: "auto",
    });
    return data;
  } catch (error) {
       console.error("Erreur lors du téléversement sur Cloudinary:", error);
       throw new Error("Cloudinary upload failed");

  }
};

const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);

    return result;
  } catch (error) {
console.error("Erreur lors de la suppression sur Cloudinary:", error);
throw new Error("Cloudinary delete failed");
  }
  {
    return error;
  }
};
module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};
