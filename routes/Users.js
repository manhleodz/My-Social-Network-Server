const express = require('express');
const router = express.Router();

const { signup, verifyEmail, login, makeInfo, getProfile, updateUserProfile, refreshStateUser } = require('../controllers/User');

const { Users } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

// sign up
router.post("/", signup);

// make new user info
router.put("/", validateToken, makeInfo);

// login
router.post('/login', login);

//verify email
router.post("/verify", verifyEmail);

// update avatar
router.put("/avatar/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByPk(id);
        const avatar = await user.update({ avatar: req.body.avatar });
        res.status(200).json("success");
    } catch (err) {
        res.status(400).json({
            message: "Update failed",
            error: err.message
        });
    }
});

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

router.get("/all/users", async (req, res) => {
    try {
        const listUser = await Users.findAll({ attributes: ['id', 'username', 'nickname', 'avatar', 'confirm'] });
        res.status(200).json(listUser);
    } catch (err) {
        res.status(400).json(err);
    }
})

//update user profile
router.put("/changeinfo", validateToken, updateUserProfile);

// get owner profile by id
router.get("/user/profile", validateToken, refreshStateUser);

// update avatar
router.put("/upload-avatar", async (req, res) => {
    const avatar = req.body.avatar;
    const id = req.body.id;
    const newAva = await Users.update({ avatar: avatar }, { where: { id: id } })
    res.json({ newAva })
});

module.exports = router;