const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/api/posts", verifyToken, postController.createPost);
module.exports = router;
