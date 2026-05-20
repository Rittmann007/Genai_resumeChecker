const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")
const User = require("../models/user.model")
const TokenBlacklist = require("../models/tokenblacklist.model")
const sendEmail = require("../services/email.service")
const {generateOtp,getOtpHtml} = require("../utils/Otp")
const bcrypt = require("bcrypt")
const otpModel = require("../models/Otp.model")

/**
 * @name  registeruser
 * @description registers a new user then sends him otp email,for verification, expects username,email,password in req 
 * @returns id,username,email of newly created user
 */

async function registeruser(req,res) {
   const {username,email,password} = req.body

   const user = await User.findOne({
    $or: [{username},{email}]
   })

   if (user) {
    throw new ApiError(400,"user already exists")
   }

   const createduser = await User.create({
    username,
    email,
    password
   })

   //for email otp conformation
   const otp = generateOtp()
   const html = getOtpHtml(otp)

   const otphash = await bcrypt.hash(otp,10)

   await otpModel.create({
      email,
      user: createduser._id,
      otpHash: otphash
   })

   await sendEmail(email,"OTP verification",`Your OTP code is ${otp}`,html)

   const resuser = {
    id: createduser._id,
    username,
    email,
    verified: createduser.verified
   }

   return res.status(201)
   .json(
    new ApiResponse(200,resuser,"user created. check your email for OTP")
   )

}

/**
 * @name loginuser 
 * @description logs in a user,expects username and password in its req
 * @returns id and username of logged in user
 */

async function loginuser(req,res) {
    const {username,password} = req.body

    if (
      [username,password].some((field)=> field?.trim() === "")
   ) {
      throw new ApiError(400,"All fields are required")
   } 

   const founduser = await User.findOne({username})

   if (!founduser) {
    throw new ApiError(400,"username or password is incorrect")
   }

   if (!founduser.verified) {
      throw new ApiError(400,"email not verified")
   }

   const validpassword = await founduser.isPasswordCorrect(password)

   if (!validpassword) {
      throw new ApiError(400,"username or password is incorrect")
   }

   const token = await founduser.generateToken()

   const loggedinuser = {
      id:founduser._id,
      username,
      verified: founduser.verified
   }

   const options = {
      httpOnly: true,
      secure: true
   }

   return res.status(200)
   .cookie("token",token,options)
   .json(new ApiResponse(200,loggedinuser,"user logged in successfully"))

}

// if we just remove token from cookie as logout
//it wouldn't be secure because if another user has your
//cookie somehow then it can access your account
//most reliable method is to blacklist the cookie upon
// loggin out, server maintains a list for blacklisted cookies for verification
// usually blacklist is implemented with a db with high throughput like redis
// here we will implement it with mongodb
/**
 * @name logoutuser
 * @description logs out user
 * @returns  success message
 */
async function logoutuser(req,res) {
   const token = req.cookies.token

   if (token) {
      await TokenBlacklist.create({token})
   }

   const options = {
      httpOnly: true,
      secure: true
   }

   return res     // clearing all the cookies
   .status(200)
   .clearCookie("token",options)
   .json(new ApiResponse(200,{},"user logged out"))

}

/**
 * @name getcurrentuser
 * @description gets the current user
 * @access private
 */
function getcurrentuser(req,res) {
   const user = req.user

   if (!user) {
      throw new ApiError(401,"user didn't exists")
   }

   return res.status(200)
   .json(new ApiResponse(200,user,"user fetched successfully"))
}

/**
 * @name verifyEmail
 * @description verifies the given email with given otp,then logs user by creating token
 * @returns verified user details
 * @access public
 */
async function verifyEmail(req,res) {
   const {otp,email} = req.body

   if (!otp || !email) {
      throw new ApiError(400, "OTP and email are required")
   }

   // Find the OTP record for this email
   const otpRecord = await otpModel.findOne({email})

   if (!otpRecord) {
      throw new ApiError(400, "OTP expired or not found")
   }

   // Compare provided OTP with stored hash
   const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHash)

   if (!isOtpValid) {
      throw new ApiError(400, "Invalid OTP")
   }

   // Find and update user as verified
   const user = await User.findByIdAndUpdate(otpRecord.user,{verified:true},{new: true})

   // Delete OTP record after verification
   await otpModel.deleteOne({_id: otpRecord._id})

   // generate token after verification
   const token = await user.generateToken()

   const data = {
      id: user._id,
      username: user.username,
      email,
      verified: user.verified
   }

   const options = {
      httpOnly: true,
      secure: true
   }

   return res.status(200)
   .cookie("token",token,options)
   .json(new ApiResponse(200,data, "Email verified successfully"))
}

module.exports = {
    registeruser,
    loginuser,
    logoutuser,
    getcurrentuser,
    verifyEmail
}