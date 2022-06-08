const sendToken = async(user,statusCode,res)=>{

   const token=  await user.getJWTtoken();

   const options= { 
       expires: new Date(Date.now() + 5*24*60*60*1000),  // till 5 days
       httpOnly:true}

   res.status(statusCode).cookie('token',token,options).json({user,token,success:true,message:"signedup successfully"})
   


}

module.exports= sendToken