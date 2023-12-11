const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = require("../models/Question");

const AnswerSchema = new Schema({
    content : {
        type : String,
        required : [true,"Please provide a content!"],
        minlenght : [5,"Please provide a content at least 5 characters!"],
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    question : {
        type : mongoose.Schema.ObjectId,
        ref : "Question",
        required : true
    }
})

AnswerSchema.pre("save",async function(next){
    
    try{
        if(!this.isModified("user")) next();

        const question = await Question.findById(this.question);
    
        question.answers.push(this._id);
        question.answerCount = question.answers.length;
    
        await question.save();
    
        next();

    }
    catch(err){
        return console.log(err)
    }
})

module.exports = mongoose.model("Answer",AnswerSchema);