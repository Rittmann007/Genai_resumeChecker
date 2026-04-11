const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")
const User = require("../models/user.model")
const TokenBlacklist = require("../models/tokenblacklist.model")

/**
 * @name  registeruser
 * @description registers a new user, expects username,email,password in req 
 * @returns id,username,email of newly created user
 */

async function registeruser(req,res) {
    const {username,email,password} = req.body

    if (
      [username,email,password].some((field)=> field?.trim() === "")
   ) {
      throw new ApiError(400,"All fields are required")
   } 

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

   const resuser = {
    id: createduser._id,
    username,
    email
   }

   return res.status(201).json(
    new ApiResponse(200,resuser,"user created successfully")
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
    throw new ApiError(400,"user doesn't exists")
   }

   const validpassword = await founduser.isPasswordCorrect(password)

   if (!validpassword) {
      throw new ApiError(400,"password is incorrect")
   }

   const token = await founduser.generateToken()

   const loggedinuser = {
      id:founduser._id,
      username
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

module.exports = {
    registeruser,
    loginuser,
    logoutuser
}