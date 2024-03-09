const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { deleteMessage, createGroup, deleteGroup, getConversationMessage, sendConversationMessage } = require('../controllers/Inbox');

router.get("/:RelationshipId", validateToken, getConversationMessage)

router.post("/", validateToken, sendConversationMessage);

router.delete("/:id", validateToken, deleteMessage);

router.post("/group", validateToken, createGroup);

router.delete("/group", validateToken, deleteGroup);

module.exports = router;
