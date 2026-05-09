const mongoose = require("mongoose")

// to give (from frontend)
// . jobDescription
// . resume pdf (text will be extracted)
// . selfDescription

// to get (from backend with Ai)
// . matchScore (with job description)
// . technicalQuestions
// . behaviouralQuestions
// . skillGaps
// . preparationPlan

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true,"technical question is required"]
    },
    intention: {
        type: String,
        required: [true,"intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Ans is required"]
    }
},{_id: false})

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true,"technical question is required"]
    },
    intention: {
        type: String,
        required: [true,"intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Ans is required"]
    }
},{_id: false})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["low","medium","high"],
        required: [true, "severity is required"]
    }
},{_id: false})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "day is required"]
    },
    focus: {
        type: String,
        required: [true, "focus is required"]
    },
    tasks: [
        {
            type: String,
            required: [true,"task is required"]
        }
    ]
},{_id: false})

const interviewReportSchema = new mongoose.Schema(
    {
        jobDescription: {
            type: String,
            required: [true,"job description is required"]
        },
        resume: {
            type: String,
            required: [true,"resume is required"]
        },
        selfDescription: {
            type: String,
            required: [true,"self description is required"]
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100
        },
        technicalQuestions: [technicalQuestionSchema],
        behaviouralQuestions: [behaviouralQuestionSchema],
        skillGaps: [skillGapSchema],
        preparationPlan: [preparationPlanSchema],
        user: {
            type: mongoose.Schema.Types.ObjectId, // user for which report is generated
            ref: "User"
        },
        title: {
            type: String,
            required: [true,"title is required"]
        }
    },{timestamps: true}
)

const interviewReport = mongoose.model("interviewReport",interviewReportSchema)
module.exports = interviewReport