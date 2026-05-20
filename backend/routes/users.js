var express = require('express');
const { registeruser, loginuser, logoutuser, getcurrentuser, verifyEmail } = require('../controllers/user.controller');
const authUser = require('../middleware/auth.middleware');
var router = express.Router();
const {body} = require("express-validator");
const handleValidationErrors = require('../middleware/validation.middleware');

router.post("/register",
[  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters'),
    
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
],handleValidationErrors,registeruser)

router.post("/login",loginuser)

router.post("/logout",logoutuser)

router.get("/getuser",authUser,getcurrentuser)

router.post("/verify-email",verifyEmail)

module.exports = router;
