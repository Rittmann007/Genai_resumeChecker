const mongoose = require("mongoose")

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

const User = mongoose.model("User",userschema)

module.exports = User