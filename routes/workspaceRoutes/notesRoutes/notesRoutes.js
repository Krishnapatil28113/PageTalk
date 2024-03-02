const express = require("express");
const router = express();
const notesController = require("../../../controllers/workspaceController/notesController/notesController");

router.get("/workspace/notes/allNotes", notesController.getAllNotes);

router.post("/workspace/notes/save", notesController.saveChat);

module.exports = router;
