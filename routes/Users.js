const express = require('express');
const router = express.Router();

const { signup, verifyEmail, login, makeInfo, getProfile, updateUserProfile, refreshStateUser, updateAvatarAndBackground } = require('../controllers/User');

const { Users, Posts } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');
const uploadMiddleware = require('../middlewares/multer');

// sign up
router.post("/", signup);

// make new user info
router.put("/", validateToken, makeInfo);

// login
router.post('/login', login);

//verify email
router.post("/verify", verifyEmail);

// update username
router.put("/name/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByPk(id);
        const username = await user.update({ username: req.body.username });
        res.status.json(username);
    } catch (err) {
        res.status(400).json({
            message: "Update failed",
            error: err.message
        });
    }
});

// get user profile
router.get("/:info", validateToken, getProfile);

//update user profile
router.put("/changeinfo", validateToken, updateUserProfile);

// get owner profile by id
router.get("/user/refresh", validateToken, refreshStateUser);

// update avatar
router.put("/upload", validateToken, uploadMiddleware, updateAvatarAndBackground);

module.exports = router;