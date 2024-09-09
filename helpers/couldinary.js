const cloudinary = require("cloudinary");

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRECT,
  cloud_name: "dpm7amyxt",
  api_key: "475122297495548",
  api_secret: "0K3FaVhxa8xej-ZU8BMWWKSpZ2M",
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
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};
