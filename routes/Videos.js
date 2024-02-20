const express = require("express");
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { postVideos } = require('../controllers/Videos');

router.post('/', validateToken, postVideos);

module.exports = router;