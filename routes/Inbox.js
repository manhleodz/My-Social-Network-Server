const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { getMessage, sendMessaeg, deleteMessage, createGroup, deleteGroup } = require('../controllers/Inbox');

router.get("/:friend", validateToken, getMessage)

router.post("/", validateToken, sendMessaeg);

router.delete("/:id", validateToken, deleteMessage);

router.post("/group", validateToken, createGroup);

router.delete("/group", validateToken, deleteGroup);

module.exports = router;
