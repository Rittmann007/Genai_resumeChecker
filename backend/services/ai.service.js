const {GoogleGenAI} = require("@google/genai")
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")
const { ta } = require("zod/v4/locales")

const Ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    technicalQuestions: z.array(z.object(
        {
            question: z.string().description("the technical question that can be asked in the interview"),
            intention: z.string().description("the intention of the interviewer behind asking this question"),
            answer: z.string().description("how to answer this question, what points to cover, what approach to take etc.")
        }
    )).description("Technical questions that can be asked in the interview along with their intention and how to answer them"),

    behaviouralQuestions: z.array(z.object(
        {
            question: z.string().description("the behavioural question that can be asked in the interview"),
            intention: z.string().description("the intention of the interviewer behind asking this question"),
            answer: z.string().description("how to answer this question, what points to cover, what approach to take etc.")
        }
    )).description("Behavioural questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(z.object(
        {
            skill: z.string().description("the skill that the candidate is lacking for this job"),
            severity: z.enum(["low","medium","high"]).description("how severe is this skill gap for the candidate's chances of getting selected")
        }
    )).description("the skills that the candidate is lacking for this job along with their severity"),

    preparationPlan: z.array(z.object(
        {
            day: z.number().description("the day number of the preparation plan, starting from 1"),
            focus: z.string().description("what the candidate should focus on this day for preparation"),
            tasks: z.array(z.string()).description("the tasks that the candidate should do on this day for preparation")
        }
    )).description("a day-wise preparation plan for the candidate to prepare for this interview")
})

async function generateInterviewReport({jobDescription,resume,selfDescription}) {
    
}

async function invokeGeminiAi() {
    const response = await Ai.models.generateContent(
        {
            model: "gemini-2.5-flash",
            contents: "this this this"
        }
    )
}