var express = require('express');
const { registeruser } = require('../controllers/user.controller');
var router = express.Router();

router.post("/register",registeruser)

module.exports = router;
