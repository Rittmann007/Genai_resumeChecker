var express = require('express');
const authUser = require('../middleware/auth.middleware');
const { generateInterviewReportController, getInterviewReportByIDController, getAllInterviewReportsController, generateResumePdfController } = require('../controllers/interview.controller');
const upload = require('../middleware/multer.middleware');
var router = express.Router();

// get input and generate interview report
router.post('/',authUser,upload.single("resume"), generateInterviewReportController);

// get a single interview report by interviewID
router.get("/report/:interviewID",authUser,getInterviewReportByIDController)

// get all interview reports of a specific user
router.get("/allreports",authUser,getAllInterviewReportsController)

// get a updated resume pdf fit to the given jobdescription
router.post("/resume/Pdf/:interviewID",authUser,generateResumePdfController)

module.exports = router;
