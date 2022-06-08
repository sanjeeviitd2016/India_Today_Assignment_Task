const jwt= require('jsonwebtoken');
const users= require("../models/user")
const errorHandler = require("../utils/errorHandler");

const authentication= async(req,res,next)=>{

    const {token}= req.cookies;

    if(!token){
        return  next( new errorHandler("Please Login to access",400))
    }

    const decodedData= await jwt.verify(token,process.env.PRIVATE_KEY)

    req.user= await users.findById(decodedData.id)
    next();
}


module.exports= authentication;