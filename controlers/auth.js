const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper ( async (req,res,next) => {
    // post data
    
    const {name,email,password,role} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });
    
    // sendJwtToClient(user,res);

    // const token = user.generateJwtFromUser();
    
    // console.log(token);

    res
    .status(200)
    .json({
        success : true,
        data : user
    })
}
)



// const errorTest = (req,res,next) => {
//     // throw new Error("Error with no reason :D");    //senron kodda bir error yakalarsa fırlatır
//     // return next(new Error("Error with no reason :D"));     //express method
//     // return next(new CustomError(": Custom Error! Status:",400));
//     // return next(new SyntaxError(": Custom Error! Status:",400));
//     return next(new TypeError("Type Error!"));
// };

const login = asyncErrorWrapper( async (req,res,next) => {
    
    const {email,password} = req.body;
    // console.log(email,password)
    if(!validateUserInput(email,password)){
        return next(new CustomError("Please Check Your Inputs!",400));
    }

    const user = await User.findOne({email}).select("+password");
    // console.log(user);
    
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please Check Your Credentials!",400));
    }
    
    // res
    // .status(200)
    // .json({
    //     success : true
    // })
    sendJwtToClient(user,res);

})

const logout = asyncErrorWrapper( async(req,res,next) => {
    
    const {NODE_ENV} = process.env;

    return res.status(200)
    .cookie({
        httpsOnly : true,
        expires : new Date(Date.now()),
        secure : NODE_ENV === "development" ? false : true
    }).json({
        success : true,
        message : "Log out Successfull!"
    })
})

const getUser = (req,res,next) => {
    res.json({
        success : true,
        data : {
            id : req.user.id,
            name : req.user.name,
            role : req.user.role
        }
    })
}

const imageUpload = asyncErrorWrapper( async (req,res,next) => {
    
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
    })
    
    //image upload success
    res.status(200).json({
        success : true,
        message : "Image Upload Successfull!",
        data : user
    })
})

//forgot password
const forgotPassword = asyncErrorWrapper( async (req,res,next) => {
    
    const resetEmail = req.body.email;

    const user = await User.findOne({email : resetEmail});
    if(!user){
        return next(new CustomError("There is No User With That Email!",400));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `https://localhost:5500/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
        <h3> Reset Your Email! </h3>
        <p> This <a href = '${resetPasswordUrl}' target ='_blank' > link </a> will expire in 1 hour </p>
    `;

    try{ //try ın ıcıne aldım cunku herhangi bir sıkıntı olursa tekrardan await user.save() e dönme fırsatımız yok mesela resetpasswordtokenı bir sıkıntı durumunda tekrar undefined yapmamız gerkiyor o yüzden merkezi custumErrorHnadlerı kullanmak yerine kendi errorhandlerımızı kullanıcaz
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset Your Email!",
            html : emailTemplate
        });
        return res.status(200).json({
        success : true,
        message : "Token Sent To Your Email!"
    })
    }catch(err){
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined
        await user.save();
        return next(new CustomError("Email Could Not Be Sent!",500));
    }
})

const resetPassword = asyncErrorWrapper( async(req,res,next) => {
    
    const {resetPasswordToken} = req.query;
    const {password} = req.body;
    
    if(!resetPasswordToken){
        return next(new CustomError("Please Provide a Valid Token!",400));
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}                                            //        resetPasswordExpire < Date.now()
    })

    if(!user){
        return next(new CustomError("Invalid Token Or Session Expired!",404))
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200)
    .json({
        success : true,
        message : "Reset Password Process Success!"
    })
})

const editDetails = asyncErrorWrapper( async(req,res,next) => {
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
        new : true,
        runValidators : true,
    })
    return res.status(200).json({
        success : true,
        data : user
    })
});

module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
    // errorTest
}