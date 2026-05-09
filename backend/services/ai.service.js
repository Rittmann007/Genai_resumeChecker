const { GoogleGenAI } = require("@google/genai");

const Ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Define schema in Gemini's native format — avoids zod conversion issues
const geminiSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description: "Score between 0-100 indicating how well the candidate matches the job",
    },
    title: {
      type: "string",
      description: "Title of the job"
    },
    technicalQuestions: {
      type: "array",
      description: "Technical questions for the interview",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The technical question" },
          intention: { type: "string", description: "Why the interviewer asks this" },
          answer: { type: "string", description: "approach to answer this question effectively" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behaviouralQuestions: {
      type: "array",
      description: "Behavioural questions for the interview",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The behavioural question" },
          intention: { type: "string", description: "Why the interviewer asks this" },
          answer: { type: "string", description: "approach to answer this question effectively" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      description: "Skills the candidate is lacking",
      items: {
        type: "object",
        properties: {
          skill: { type: "string", description: "The missing skill" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "How critical this gap is",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description: "7-day preparation plan",
      items: {
        type: "object",
        properties: {
          day: { type: "number", description: "Day number starting from 1" },
          focus: { type: "string", description: "Main focus topic for this day" },
          tasks: {
            type: "array",
            items: { type: "string" },
            description: "List of tasks for this day",
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({ jobdescription, resume, selfdescription }) {
  const prompt = `You are an expert interview coach. Analyze the candidate's profile and generate a comprehensive interview report.

Resume:
${resume}

Self Description:
${selfdescription}

Job Description:
${jobdescription}

Generate the following:
1. matchScore (0-100): How well does this candidate match the job requirements?
2. technicalQuestions (3-5): Questions testing technical skills, each with question, intention, and answer fields
3. behaviouralQuestions (3-5): Questions assessing soft skills, each with question, intention, and answer fields
4. skillGaps: Missing skills with skill name and severity (low/medium/high)
5. preparationPlan: 7 days, each with day number, focus topic, and array of tasks`;

  const response = await Ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
    },
  });

  const parsed = JSON.parse(response.text);

  // Validate arrays exist and are actually arrays
  const safeArray = (val) => (Array.isArray(val) ? val : []);

  return {
    matchScore: typeof parsed.matchScore === "number" ? parsed.matchScore : 0,
    technicalQuestions: safeArray(parsed.technicalQuestions),
    behaviouralQuestions: safeArray(parsed.behaviouralQuestions),
    skillGaps: safeArray(parsed.skillGaps),
    preparationPlan: safeArray(parsed.preparationPlan),
  };
}

module.exports = generateInterviewReport;