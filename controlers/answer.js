const Answer = require("../models/Answer");
const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion = asyncErrorWrapper( async(req,res,next) => {
    
    const {question_id} = req.params;

    const user_id = req.user.id;

    const information = req.body;

    const answer = await Answer.create({
        ...information,
        question : question_id,
        user : user_id
    })

    return res.status(200).json({
        success : true,
        data : answer
    })
})

const getAllAnswersByQuestion = asyncErrorWrapper( async(req,res,next) => {
    
    const {question_id} = req.params;

    const question = await Question.findById(question_id).populate("answers");
    
    const answers = question.answers; 

    return res.status(200).json({
        success : true,
        count : answers.length,
        data : answers
    })

})

const getSingleAnswer = asyncErrorWrapper( async (req,res,next) => {
    
    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id)
    .populate({
        path : "user",
        select : "name profile_image"
    })
    .populate({
        path : "question",
        select : "title"
    });

    return res.status(200).json({
        success : true,
        data : answer
    })
})

const editAnswer = asyncErrorWrapper( async (req,res,next) => {
    
    const {answer_id} = req.params;
    
    const {content} = req.body;

    const answer = await Answer.findById(answer_id);

    answer.content = content;

    await answer.save();

    return res.status(200).json({
        success : true,
        data : answer
    }) 

})
const deleteAnswer = asyncErrorWrapper( async (req,res,next) => {
    //post hook la da yapılabilir
    const {answer_id,question_id} = req.params;

    await Answer.findByIdAndDelete(answer_id);
    
    const question = await Question.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id),1);
    question.answerCount = question.answers.length;

    await question.save();

    return res.status(200).json({
        success : true,
        message : "Answer deleted successfull!"
    }) 
   

})

const likeAnswer = asyncErrorWrapper( async(req,res,next) => {

    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id);

    if(answer.likes.includes(req.user.id)){
        next(new CustomError("You already liked this answer!",400));
    }else{
        answer.likes.push(req.user.id);
    }

    await answer.save();

    return res.status(200).json({
        success : true,
        data : answer
    })
})
const dislikeAnswer = asyncErrorWrapper( async(req,res,next) => {

    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id);

    if(!answer.likes.includes(req.user.id)){
        next(new CustomError("You can not undo like this operations!",400));
    }

    const index = answer.likes.indexOf(req.user.id);

    answer.likes.splice(index,1);

    await answer.save();

    return res.status(200).json({
        success : true,
        data : answer
    })
})

module.exports = {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    dislikeAnswer
}