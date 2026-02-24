import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String , unique:true},
    password:String,
    otp:{type:String},
    otpExpire:{type:Date},
    isVerified : {type:Boolean , default:false},
    resetPasswordOtp : {type:String},
    resetPasswordOtpExpire:{type:Date},

})

export default mongoose.model("user", userSchema);