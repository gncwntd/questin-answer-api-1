const express = require("express");
const router = express.Router();
const {register , getUser, login , logout , imageUpload , forgotPassword, resetPassword, editDetails} = require("../controlers/auth");
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const {profileImageUpload} = require("../middlewares/libraries/profileImageUpload");

router.post("/register",register);
router.post("/login",login);
router.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_img")],imageUpload);
router.post("/forgotpassword",forgotPassword); 
router.get("/profile", getAccessToRoute , getUser);
router.get("/logout", getAccessToRoute , logout);
router.put("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editDetails);
// router.get("/error",errorTest)

module.exports = router;