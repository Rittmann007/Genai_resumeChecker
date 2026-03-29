const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

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

userschema.pre("save" , async function(next) {  // encrypt the password before saving
    if(!this.isModified("password")) return next(); // only run if the passsword is modified
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userschema.methods.isPasswordCorrect = async function(password) { // custom method to validate given password
    return await bcrypt.compare(password , this.password)
}

const User = mongoose.model("User",userschema)

module.exports = User