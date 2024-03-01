const express = require("express");
const router = express();
const userController = require("./../controllers/userController");

router.get("/user/allUsers", userController.getAllusers);

router.post("/user/addUser", userController.addUser);

module.exports = router;
