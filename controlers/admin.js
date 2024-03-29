const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Question = require("../models/Question");

const testAdminAccess = asyncErrorWrapper( async(req,res,next) => {
    res.status(200).json({
        success : true,
        message : "Admin Page"
    })
})

const blockUser = asyncErrorWrapper( async(req,res,next) => {
    const {id} = req.params;

    const user = await User.findById(id);

    user.blocked = !user.blocked;

    //user olup olmadıgını genel middlewareimde kontrol ettim

    await user.save();

    return res.status(200).json({
        success : true,
        message : "Blocked - Unblocked successfull!"
    })
})

const deleteUser = asyncErrorWrapper( async(req,res,next) => {
    const {id} = req.params;

    const user = await User.findById(id);

    await user.deleteOne();  //.remove() calısmadı

    return res.status(200).json({
        success : true,
        message : "Delete operation successfull!"
    })
})

module.exports = {
    testAdminAccess,
    blockUser,
    deleteUser
}