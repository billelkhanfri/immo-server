const multer = require("multer");
const path = require("path");

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    if (file) {
      const uniqueSuffix =
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
      cb(null, uniqueSuffix);
    } else {
      cb(new Error("Aucun fichier fourni"), false);
    }
  },
});

// Configuration du middleware de téléchargement de photos
const photoUpload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Format non supporté"), false);
    }
  },
  limits: { fileSize: 1024 * 1024 }, // Limite de taille de fichier à 1 Mo
});

module.exports = photoUpload;
