const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReport = require("../models/interviewReport.model")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")

/**
 * @name generateInterviewReportController 
 * @description generates the complete report saves to db and returns it
 * @returns the complete interview report as response
 * @access private
 */
async function generateInterviewReportController(req,res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription} = req.body

    if (!resumeContent || !selfDescription || !jobDescription) {
        throw new ApiError(401," all fields are required")
    }

    const interviewReportByAi = await generateInterviewReport({
        jobdescription: jobDescription,
        resume: resumeContent.text,
        selfdescription: selfDescription
    })

    const FinalInterviewReport = await interviewReport.create({
        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    return res.status(201)
    .json(new ApiResponse(201,FinalInterviewReport,"Interview report generated successfully"))

}

/**
 * @name getInterviewReportByIDController 
 * @description gives a specific interview report by interviewId and user
 * @returns a specific report
 * @access private
 */
async function getInterviewReportByIDController(req,res) {
    const {interviewID} = req.params

    const FinalinterviewReport = await interviewReport.findOne({_id: interviewID,user: req.user._id})

    if (!FinalinterviewReport) {
        throw new ApiError(400,"report not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,FinalinterviewReport,"report fetched successfully"))
}

/**
 * @name getAllInterviewReportsController 
 * @description gives all reports of a specific user based on userid
 * @returns all reports
 * @access private
 */
async function getAllInterviewReportsController(req,res) {
    const Reports = await interviewReport.find({user: req.user._id})
    .sort({createdAt: -1}).select("-resume -jobDescription -selfDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan")

    if (!Reports) {
        throw new ApiError(400,"reports not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,Reports,"Reports fetched successfully"))
}

module.exports = {generateInterviewReportController,getInterviewReportByIDController,getAllInterviewReportsController}