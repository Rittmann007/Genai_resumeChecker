var express = require('express');
const { registeruser, loginuser, logoutuser, getcurrentuser } = require('../controllers/user.controller');
const authUser = require('../middleware/auth.middleware');
var router = express.Router();

router.post("/register",registeruser)

router.post("/login",loginuser)

router.post("/logout",logoutuser)

router.get("/getuser",authUser,getcurrentuser)

module.exports = router;
