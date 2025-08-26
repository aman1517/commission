const express = require("express");
const { getUsers, createUser,updateUser,createUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUsers);
router.patch("/:id", updateUser); // ✅ PATCH route

module.exports = router;
