const express = require("express");
const router = express.Router({mergeParams:true});       //diger router lardaki paramsları birleştirmek icin kullandım
const { getAccessToRoute, getAnswerOwnerAccess } = require("../middlewares/authorization/auth");
const { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, dislikeAnswer } = require("../controlers/answer");
const { checkQuestionExist, checkQuestionAndAnswerExist } = require("../middlewares/database/databaseErrorHelpers");

router.post("/",getAccessToRoute,addNewAnswerToQuestion)

router.get("/",checkQuestionExist,getAllAnswersByQuestion);
router.get("/:answer_id",checkQuestionAndAnswerExist,getSingleAnswer);
router.get("/:answer_id/like",checkQuestionAndAnswerExist,getAccessToRoute,likeAnswer);
router.get("/:answer_id/dislike",checkQuestionAndAnswerExist,getAccessToRoute,dislikeAnswer );

router.put("/edit/:answer_id",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer)
router.delete("/delete_answer/:answer_id",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer)


// router.get("/",(req,res,next) => {
//     console.log(req.params)
//     res.send("-_-")
// })

module.exports = router;