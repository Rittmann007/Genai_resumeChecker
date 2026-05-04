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

module.exports = {generateInterviewReportController}