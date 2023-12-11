const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

//Storage , File Filter
const storage = multer.diskStorage({
    destination : function(req,file,cb){    //callback ile ister hata fırlat ister dosyayı nereye yollayacagını soyle
        const rootDir = path.dirname(require.main.filename);  
        cb(null,path.join(rootDir,"/public/uploads"))           //ilk parametre hatayı yollar
    },
    filename : function(req,file,cb){
        //File - MimeType  - img/png(jpg)
        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + extension;  //multer bir middleware oldugundan buraya bir request geliyo ve reuestin icinde bir deger olusturuyoruz (savedProfileImage). veri tababınına kaydettigimizxe kullanıcaz. ikinci adımda getAccessToRoute ta request.user id si olusunca onu ekliyoruz sonra extension umuzu ekliyoruz
        cb(null,req.savedProfileImage);             
    }
    
})

const fileFilter = (req,file,cb) => {
    let allowMimeTypes = ["image/jpg","image/gif","image/jpeg,","image/png"];

    if(!allowMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("Please Provide a Valid Image File!",400),false);
    }
    return cb(null,true)
}

const profileImageUpload = multer({storage,fileFilter});

module.exports = {
    profileImageUpload
}
