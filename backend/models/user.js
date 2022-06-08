const mongoose= require("mongoose")
const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs');
const validator= require('validator');
const crypto= require('crypto');
const { time } = require("console");
const { Timestamp } = require("mongodb");

const userSchema= new mongoose.Schema({

    name:{
        type:String,
        required: true
    },

    email:{
        type: String,
        required:[true ,'Please Enter Email'],
        unique: [true,'Email already exits'],
        validate: [validator.isEmail ,'Please enter valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter Password'],
        minLength:[ 8,'Password must have length 8 characters'],
        select: false
    },
    avatar: {

        public_id:{
            type: String
        },
        url: {
            type: String
        }
    },

    phoneNo: {
        type: Number,
        required: true
    },
    gender: {
        type:String,
        required: true
    },

    language: {
        type:String
    },
    maritalStatus:{

        type: String,
        required: true
    },

    DateofBirth:{
        type: Date,
        required: true,
        default: 1999
    },

    timeofBirth:{
        type: String,
        required: true,
        default:0
    },

    tnc :{
        type: Boolean,
        required:true,
        default: false
    },

    resetPasswordToken :{
        type: String,
    },
    resetPasswordExpire:{
        type: String
    }
})

userSchema.pre("save", async function (next) {
   
    if (!this.isModified("password")) {
        next();
      }
    this.password= await bcrypt.hash(this.password,10)
} )

userSchema.methods.getJWTtoken= async function (){
    const expireTime= process.env.TOKEN_EXPIRE_TIME || "1000h"
    const token= jwt.sign({id:this._id},process.env.PRIVATE_KEY,{expiresIn:expireTime})
    return token;

}

userSchema.methods.comparePassword= async function (Password){
    return await bcrypt.compare(Password,this.password)
}

userSchema.methods.getResetPasswordToken =  function () {

    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire= Date.now() + 15*60*1000;
  
    return resetToken;
}
module.exports= mongoose.model("users",userSchema)
