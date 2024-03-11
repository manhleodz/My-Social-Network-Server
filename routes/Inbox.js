const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { deleteMessage, createGroup, deleteGroup, getConversationMessage, sendConversationMessage, changeMessage, getListGroups, sendGroupMessage, getGroupById } = require('../controllers/Inbox');

router.get("/:RelationshipId", validateToken, getConversationMessage)

router.post("/", validateToken, sendConversationMessage);

router.delete("/:id", validateToken, deleteMessage);

router.put("/:id", validateToken, changeMessage);

router.get("/group/all", validateToken, getListGroups);

router.get("/group/:id", validateToken, getGroupById);

router.post("/group", validateToken, sendGroupMessage);

router.post("/group/newgroup", validateToken, createGroup);

router.delete("/group/delete", validateToken, deleteGroup);

module.exports = router;
