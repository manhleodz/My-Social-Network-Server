const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { UserRela } = require('../models');
const { Users } = require("../models");
const { Op } = require("sequelize");
const { addFriends, deleteFriend, getListFriend, getFriendRequest } = require("../controllers/UserRela");

// get list friend
router.get("/", validateToken, getListFriend);

//get list friend request
router.get("/request", validateToken, getFriendRequest);

// follow
router.post("/addFriend", validateToken, addFriends);

//unfollow
router.delete('/unfriend', validateToken, deleteFriend);

module.exports = router;