const news= require("../models/news");
const errorHandler= require("../utils/errorHandler")
const catchAsyncAwait= require("../middlewares/catchAsyncAwaitError");
const apiFeature = require("../utils/apifeature")


const getAllNews= catchAsyncAwait(async(req,res,next)=>{

    const apifeature= new apiFeature(news.find(),req.query)
    apifeature.search();

    const News= await apifeature.query;

    res.status(200).json({success:true,News})
})

module.exports= {getAllNews}