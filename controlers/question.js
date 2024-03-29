const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const askNewQuestion = asyncErrorWrapper( async(req,res,next) => {
    
    const information = req.body;

    const question = await Question.create({
        ...information,
        user : req.user.id
    });  

    res.status(200).json({
        success : true,
        data : question
    })

})

const getAllQuestions = asyncErrorWrapper( async(req,res,next) => {

    // console.log(req.query.search);
    // const questions = await Question.find().where({title : "Questions 6 - Title"});
    
    // let query = Question.find();

    // const populate = true;
    // const populateObject = {
    //     path : "user",
    //     select : "name profile_image"
    // };

    // if(req.query.search){
    //     const searchObject = {};
    //     const regex = new RegExp(req.query.search,"i");
    //     searchObject ["title"] = regex;
    //     query = query.where(searchObject);
        
    // }

    // if(populate){
    //     query = query.populate(populateObject);
    // }

    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 5;

    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;

    // const pagination = {};
    // const total = await Question.countDocuments();

    // if( startIndex > 0 ){
    //     pagination.previous = {
    //         page : page - 1,
    //         limit : limit
    //     }
    // }

    // if( endIndex < total ){
    //     pagination.next = {
    //         page : page + 1,
    //         limit : limit
    //     }
    // }

    // query = query.skip(startIndex).limit(limit);

    // const sortKey = req.query.sortBy;
    
    // if(sortKey === "most-answered"){
    //     query = query.sort("-answerCount -createdAt");
    // }

    // if(sortKey === "most-liked"){
    //     query = query.sort("-likeCount -createdAt");
    // }

    // else{
    //     query = query.sort("-createdAt"); 
    // }

    // const questions = await query;

    return res.status(200).json(res.queryResults
    //     {
    //     success : true,
    //     count : questions.length,
    //     pageCount : total / limit,
    //     pagination : pagination,
    //     data : questions
    // }
    );

})

const getSingleQuestion = asyncErrorWrapper( async (req,res,next) => {
    // const {id} = req.params;

    // const question = await Question.findById(id);

    return res.status(200).json(res.queryResults
        
    //     {
    //     success : true,
    //     data : question
    // }
    )
})

const editQuestion =  asyncErrorWrapper( async(req,res,next) => {
    
    const {id} = req.params;
    
    const {title,content} = req.body;
    
    let question = await Question.findById(id);             //questinonmu daha sonra degistirecegimden constla degil letle aldım
    
    question.title = title;
    question.content = content;

    question = await question.save();

    return res.status(200).json({
        success : true,
        data : question
    })
    
})

const deleteQuestion = asyncErrorWrapper( async(req,res,next) => {
    
    const {id} = req.params;

    const question = await Question.findByIdAndDelete(id);

    // const question = await Question.findById(id);

    // question.deleteOne();

    return res.status(200).json({
        success : true,
        message : "Question Deleted!"
    })

})

const likeQuestion = asyncErrorWrapper( async(req,res,next) => {

    const {id} = req.params;

    const question = await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        next(new CustomError("You already liked this question!",400));
    }else{
        question.likes.push(req.user.id);
        question.likeCount = question.likes.length;
    }

    await question.save();

    return res.status(200).json({
        success : true,
        data : question
    })
})
const dislikeQuestion = asyncErrorWrapper( async(req,res,next) => {

    const {id} = req.params;

    const question = await Question.findById(id);

    if(!question.likes.includes(req.user.id)){
        next(new CustomError("You can not undo like this operations!",400));
    }

    const index = question.likes.indexOf(req.user.id);

    question.likes.splice(index,1);
    question.likeCount = question.likes.length;

    await question.save();

    return res.status(200).json({
        success : true,
        data : question
    })
})

module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    dislikeQuestion
}