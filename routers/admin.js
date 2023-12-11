const express = require("express");
const {testAdminAccess, blockUser, deleteUser} = require("../controlers/admin");
const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorization/auth");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");
const { deleteDeletedUsersQuestion } = require("../controlers/question");

const router = express.Router();

router.use([getAccessToRoute,getAdminAccess]);
router.get("/",testAdminAccess);

// router.use(checkUserExist);
router.get("/blockuser/:id",checkUserExist,blockUser);
router.delete("/deleteuser/:id",checkUserExist,deleteUser);


module.exports = router;