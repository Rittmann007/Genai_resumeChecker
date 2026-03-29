const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")
const User = require("../models/user.model")
const jwt = require('jsonwebtoken')
const { use } = require("react")

/**
 * @name  registeruser
 * @description registers a new user, expects username,email,password in req 
 * @returns username,email of newly created user
 */

async function registeruser(req,res) {
    const {username,email,password} = req.body

    if (
      [username,email,fullname,password].some((field)=> field?.trim() === "")
   ) {
      throw new ApiError(400,"All fields are required")
   } 

   const user = await User.findOne({
    $or: [{username},{password}]
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
    username,
    email
   }

   return res.status(201).json(
    new ApiResponse(200,resuser,"user created successfully")
   )

}

module.exports = {
    registeruser
}