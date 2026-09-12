const pdfParse = require("pdf-parse")
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service")
const interviewReport = require("../models/interviewReport.model")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const axios = require("axios")

/**
 * @name generateInterviewReportController 
 * @description generates the complete report saves to db and returns it
 * @returns the complete interview report as response
 * @access private
 */
async function generateInterviewReportController(req,res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    // const pdfData = await pdfParse(req.file.buffer)  // ✅ correct usage
    // const resumeContent = pdfData.text
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

    // fire-and-forget — don't block the response on this
    axios.post(`${process.env.RAG_SERVICE_URL}/ingest`, {
        interviewID: FinalInterviewReport._id,
        userID: req.user._id,
        resumeText: resumeContent.text,
        jobDescription,
        selfDescription
    }, {
        headers: { "X-Internal-Key": process.env.INTERNAL_API_KEY }
    }).catch(err => console.log("Error ingesting chat context:", err.message))

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

/**
 * @name generateInterviewReportController
 * @description gives a pdf of the updated resume based on the
 * given jobdescription,resume,selfdescription
 * @input interviewID from params
 * @returns a resume pdf
 * @access private
 */
async function generateResumePdfController(req,res) {
    const {interviewID} = req.params
    const report = await interviewReport.findOne({ _id: interviewID, user: req.user._id })
    
    if (!report) {
        throw new ApiError(404,"report not found")
    }

    const {resume,jobDescription,selfDescription} = report

    const pdfBuffer = await generateResumePdf({jobDescription,resume,selfDescription})

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewID}.pdf`
    })

    res.send(pdfBuffer)

}

/**
 * @name chatWithBotController
 * @description gives the response of the user query
 * from the rag chatbot microservice,acts as a proxy between frontend and microservice
 * @input interviewID from params, message from body
 * @returns response of the user query
 * @access private
 */
async function chatWithBotController(req,res) {
    const {interviewID} = req.params
    const {message} = req.body

    if (!message) {
        throw new ApiError(400,"message is required")
    }

    const report = await interviewReport.findOne({ _id: interviewID, user: req.user._id })

    if (!report) {
        throw new ApiError(404,"report not found")
    }

    const response = await axios.post(`${process.env.RAG_SERVICE_URL}/chat`, {
        interviewID,
        userID: req.user._id,
        message
    }, {
        headers: { "X-Internal-Key": process.env.INTERNAL_API_KEY }
    })

    return res.status(200)
    .json(new ApiResponse(200,response.data,"chat response generated successfully"))
}

module.exports = {generateInterviewReportController
    ,getInterviewReportByIDController
    ,getAllInterviewReportsController
,generateResumePdfController,chatWithBotController}