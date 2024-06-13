
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  //generate a name for each image
    filename: (req, file, callback) => {
        if (file) {
            const name =
              new Date().toISOString().replace(/:/g, "-") + file.originalname;

            callback(null, name);
        } else {
            cb(null, false)
      }
  
  },
});
const photoUpload = multer({ storage : storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true)
        } else {
            cb({ message: "Format non supporté" }, false)
        }  
    },
    limits: {fileSize: 1024 * 1024} // 1 megabyte
})

module.exports = photoUpload ;
