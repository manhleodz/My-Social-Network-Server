const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { getPost, getPostById, getPostByUser, makeNewPost, deletePost, updatePost, updateLikeNum } = require('../controllers/Post');
const uploadMiddleware = require('../middlewares/multer');

// get all posts
router.get("/", validateToken, getPost);

// get post by id
router.get("/:id", validateToken, getPostById);

//update like num
router.post("/like/:postId", updateLikeNum);

// make new post
router.post("/", validateToken, uploadMiddleware, makeNewPost);

// update post
router.put("/:id", validateToken, updatePost);

// delete post
router.delete("/:postId", validateToken, deletePost);

// get user 's posts
router.get("/profile/user",validateToken, getPostByUser);

module.exports = router;