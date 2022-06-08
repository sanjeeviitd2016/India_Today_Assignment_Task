const errorHandler= require('../utils/errorHandler')

const errorMiddleware= (err,req,res,next)=>{

    const statusCode= err.statusCode ||500;
    const message= err.message || 'internal server error'

    console.log(err)


    if (err.name==='CastError'){
        const message= `Resouces not found, Invalid: ${err.path}`
        err=new errorHandler(message,400);
    }
     // duplicate key error
    if(err.code===11000){
        const message= `User Already exits because of Duplicate ${Object.keys(err.keyValue)} Entered`
        err= new errorHandler(message,400)
    }
    // jwt token error
    if (err.name==='JsonWebTokenError'){
        const message= "Json web Toekn is invalid . try again"
        err= new errorHandler(message,400)
    }

    // if jwt reset token is expired
    if(err.name ==='TokenExpiredError'){
        err= new errorHandler('Json web Token is expired,Plsease try again',400);
        
    }

    res.status(statusCode).json({
        success:false,
        message: message,
    })
}

module.exports= errorMiddleware;