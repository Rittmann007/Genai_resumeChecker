const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userschema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true,"username already taken"],
        required: true,
    },
    email: {
        type: String,
        unique: [true,"account already exists"],
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},{timestamps: true})

userschema.pre("save" , async function() {  // encrypt the password before saving
    if(!this.isModified("password")) return; // only run if the passsword is modified
    this.password = await bcrypt.hash(this.password , 10)
})

userschema.methods.isPasswordCorrect = async function(password) { // custom method to validate given password
    return await bcrypt.compare(password , this.password)
}

userschema.methods.generateToken = function() {
  return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username
      },
      process.env.JWT_SECRET,
      {
         expiresIn: "1d"
      }
   )
}

const User = mongoose.model("User",userschema)

module.exports = User