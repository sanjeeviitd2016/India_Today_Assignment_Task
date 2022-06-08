const express= require('express');
const { signup,login,logout, updatePassword, updateProfile,forgotPassword ,resetPassword, myProfile} = require('../controllers/user');
const router= express.Router();
const auth= require("../middlewares/auth")


router.post("/signup",signup)
router.post("/login",login)
router.get("/me",auth,myProfile)
router.get('/logout',logout)
router.post("/update/password",auth,updatePassword)
router.post("/update/profile",auth,updateProfile);
router.post('/forgot/password',forgotPassword)

router.post("/password/reset/:token",resetPassword)

module.exports= router;