const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question = require("./Question");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : {
        type : String,
        required : [true,"Please Provide a Name!"]
    },
    email : {
        type : String, 
        required : [true,"Please Provide an Email!"],
        unique : true,
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please Provide a Valid Email!"
        ]
    },
    role : {
        type : String,
        default : "user",
        enum : ["user","admin"] //kaç faklı rol oldugunu ifade ediyors
    },
    password : {
        type : String,
        minlength : [6,"Please Provide a Password with min length 6!"],
        required : [true,"Please Provide a Password!"],
        select : false 
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    title : {
        type : String
    },
    about : {
        type : String
    },
    place : {
        type : String
    },
    website : {
        type : String
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    blocked : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : String
    }
})

//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function(){
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;
    const payload = {
        id : this.id,
        name : this.name,
        role : this.role
    }
    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE
    })
    return token;
}

UserSchema.methods.getResetPasswordTokenFromUser = function(){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    // console.log(randomHexString);
    const {RESET_PASSWORD_EXPIRE} = process.env;
    const resetPasswordToken = crypto
    .createHash("MD5")
    .update(randomHexString)
    .digest("hex");
    // console.log(resetPasswordToken);
    // return resetPasswordToken;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
}

//Pre Hooks
UserSchema.pre("save",function(next){

    if(!this.isModified("password")){  //user da belirli değişiklikler yapılıp parola degismemisşe skipliyoruz <=isModified=>
        next();
    }
    
    bcrypt.genSalt(10,(err, salt) => {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err);
            this.password = hash;
            next();
        });
    });
})

UserSchema.post("deleteOne",async function(){  //remove olması lazım ama userdelete de calısmıyo gextim

    await Question.deleteMany({
        user : this._id
    })

})

module.exports = mongoose.model("User",UserSchema);