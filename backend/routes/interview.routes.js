var express = require('express');
const authUser = require('../middleware/auth.middleware');
const { generateInterviewReportController } = require('../controllers/interview.controller');
const upload = require('../middleware/multer.middleware');
var router = express.Router();

router.post('/',authUser,upload.single("resume"), generateInterviewReportController);

module.exports = router;
