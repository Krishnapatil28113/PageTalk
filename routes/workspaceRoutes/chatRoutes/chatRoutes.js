const express = require("express");
const router = express();
const chatController = require("../../../controllers/workspaceController/chatController/chatController");

router.get("/workspace/chat/allChats", chatController.getAllChats);

router.post("/workspace/chat/send", chatController.send);

router.post("/workspace/chat/create", chatController.createChat);

module.exports = router;
