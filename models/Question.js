const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const QuestionSchema = new Schema({
    title : {
        type : String,
        required : [true,"Please Provide a Title!"],
        minlenght : [5,"Please Provide a Title at least 5 characters!"],
        unique : true
    },
    content : {
        type : String,
        required : [true,"Please Provide a Content!"],
        minlenght : [5,"Please Provide a Title at least 5 characters!"],
    },
    slug : String,
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },
    likeCount : {
        type : Number,
        default : 0
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    answerCount : {
        type : Number,
        default : 0
    },
    answers : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Answer"
        }
    ]
});

QuestionSchema.pre("save",function(next){
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
})

QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title, {
        replacement: '-',           // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g,   // remove characters that match regex, defaults to `undefined`
        lower: true,                // convert to lower case, defaults to `false`
        strict: false,              // strip special characters except replacement, defaults to `false`
        locale: 'vi',               // language code of the locale to use
        trim: true                  // trim leading and trailing replacement chars, defaults to `true`
      })
}

module.exports = mongoose.model("Question",QuestionSchema);