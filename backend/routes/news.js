const express= require('express');

const router= express.Router();
const {getAllNews} = require("../controllers/news")

router.get("/news",getAllNews)

module.exports= router;