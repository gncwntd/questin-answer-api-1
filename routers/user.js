const express = require("express");
const { getSingleUser, getAllUsers } = require("../controlers/user.js");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers.js");
const { userQueryMiddleware } = require("../middlewares/query/userQueryMiddleware.js");
const User = require("../models/User.js");
const router = express.Router();

router.get("/:id",checkUserExist,getSingleUser);
router.get("/",userQueryMiddleware(User),getAllUsers);

module.exports = router;