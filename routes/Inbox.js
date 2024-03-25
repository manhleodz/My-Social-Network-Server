const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { deleteMessage, createGroup, deleteGroup, getConversationMessage, sendConversationMessage, changeMessage, getListGroups, sendGroupMessage, getGroupById, getGroupMessage, addUserIntoGroup, seenMessage } = require('../controllers/Inbox');

router.get("/:RelationshipId", validateToken, getConversationMessage)

router.post("/", validateToken, sendConversationMessage);

router.delete("/:id", validateToken, deleteMessage);

router.put("/:id", validateToken, changeMessage);

router.put("/seen/:RelationshipId", validateToken, seenMessage);

router.get("/group/all", validateToken, getListGroups);

router.get("/group/:ChannelId", validateToken, getGroupMessage);

router.post("/group", validateToken, sendGroupMessage);

router.post("/group/newgroup", validateToken, createGroup);

router.post("/group/addUser", validateToken, addUserIntoGroup);

router.delete("/group/delete", validateToken, deleteGroup);

module.exports = router;
