const express = require("express");
const router = express.Router();
const answer = require("./answer");
const Question = require("../models/Question");

const {getAllQuestions, askNewQuestion, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, dislikeQuestion} = require("../controlers/question");
const { getAccessToRoute, getQuestionOwnerAccess } = require("../middlewares/authorization/auth");
const { checkQuestionExist } = require("../middlewares/database/databaseErrorHelpers");
const { questionQueryMiddleware } = require("../middlewares/query/questionQueryMiddleware");
const { answerQueryMiddleware } = require("../middlewares/query/answerQueryMiddleware");

router.post("/ask",getAccessToRoute,askNewQuestion);

router.get("/",questionQueryMiddleware(Question,{
    population : {
        path : "user",
        select : "name profile_image"
    }
}),getAllQuestions);

router.get("/:id",checkQuestionExist,answerQueryMiddleware(Question,{
    population : [
        {
            path : "user",
            select : "name profile_image"
        },
        {
            path : "answers",
            select : "content"
        }
    ]

}),getSingleQuestion);

router.get("/dislike/:id",[getAccessToRoute,checkQuestionExist],dislikeQuestion);
router.get("/like/:id",[getAccessToRoute,checkQuestionExist],likeQuestion)

router.put("/edit/:id",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);

router.delete("/deletequestion/:id",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion)

router.use("/:question_id/answers",checkQuestionExist,answer);

module.exports = router;