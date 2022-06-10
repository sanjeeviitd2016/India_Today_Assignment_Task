const users = require("../models/user");
const catchAsyncAwait = require("../middlewares/catchAsyncAwaitError");
const sendToken = require("../utils/jwtToken");
const errorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const signup = catchAsyncAwait(async (req, res, next) => {
  const {
    name,
    email,
    password,
    phoneNo,
    gender,
    language,
    maritalStatus,
    DateofBirth,
    timeofBirth,
    tnc,
    avatar
  } = req.body;


  const User = await users.findOne({ email });
  if (User) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "avatars",
  });

  const user = await users.create({
    name,
    email,
    password,
    phoneNo,
    gender,
    language,
    maritalStatus,
    DateofBirth,
    timeofBirth,
    tnc,
    avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });
  
  sendToken(user, 200, res);
});

const login = catchAsyncAwait(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Mendatory feilds", 400));
  }
  const user = await users.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorHandler("User does not exits", 401));
  }
  const iscomparePassword = await user.comparePassword(password);
  if (iscomparePassword) {
    sendToken(user, 200, res);
  } else {
    return next(new errorHandler("Please enter correct credentials"));
  }
});

const logout = catchAsyncAwait(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: "logged out successfully" });
});

const updatePassword = catchAsyncAwait(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await users.findById(req.user.id).select("+password");

  const iscomparePassword = await user.comparePassword(oldPassword);

  if (!iscomparePassword) {
    return next(new errorHandler("Old Password is incorrect", 401));
  }

  if (newPassword !== confirmPassword) {
    return next(new errorHandler("Password does not match", 400));
  }
  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "password updated successfully!!" });
});

const updateProfile = catchAsyncAwait(async (req, res, next) => {
  const avatar= req.body.avatar;
  // if (req.body.email) {
  //   const user = await users.findOne({ email: req.body.email });
  //   if (user) {
  //     return next(new errorHandler("this email already exits", 201));
  //   }
  // }
  const User = await users.findById(req.user._id);
  if (avatar) {
    await cloudinary.v2.uploader.destroy(User.avatar.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    User.avatar.public_id = myCloud.public_id;
    User.avatar.url = myCloud.secure_url;
  }

  await User.save();
  
  const user = await users.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  
  await user.save();
  console.log("user",user)
  res
    .status(200)
    .json({ message: "Profile Updated successfully", success: true, user });
});

const forgotPassword = catchAsyncAwait(async (req, res, next) => {
  const user = await users.findOne({ email: req.body.email });
  if (!user) {
    return next(new errorHandler("user not recognised", 404));
  }
  //reset password token --->
  const resetToken = await user.getResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password  reset token is :- \n\n ${resetPasswordUrl}\n\n if you have not requested this email, please ignore`;

  try {
    await sendEmail({
      email: user.email,
      subject: "NewsMania password recovery email",
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to ${req.body.email} successfully!`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new errorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncAwait(async (req, res, next) => {
  const resetToken = req.params.token;
  const { newPassword, confirmPassword } = req.body;

  const resetPasswordToken =  crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await users.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
 

  if (!user) {
    return next(new errorHandler("Token is invalid or expired", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new errorHandler("Password does not match", 400));
  }
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
 await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset successfully!" ,user});
});

const myProfile= catchAsyncAwait(async(req,res,next)=>{

  const me= await users.findById(req.user.id)

  res.status(200).json({success:true,me})
})

module.exports = {
  signup,
  login,
  logout,
  updatePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
  myProfile
};
