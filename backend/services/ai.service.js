const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { ta } = require("zod/v4/locales");

const Ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({// schema for understanding of ai model
  matchScore: z
    .number()
    .describe(
      "a score between 0 and 100 indicating how well the candidate matches the job requirements based on the analysis of the job description, resume and self-description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "the technical question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "the intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "how to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),

  behaviouralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "the behavioural question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "the intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "how to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioural questions that can be asked in the interview along with their intention and how to answer them",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("the skill that the candidate is lacking for this job"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "how severe is this skill gap for the candidate's chances of getting selected",
          ),
      }),
    )
    .describe(
      "the skills that the candidate is lacking for this job along with their severity",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "the day number of the preparation plan, starting from 1",
          ),
        focus: z
          .string()
          .describe(
            "what the candidate should focus on this day for preparation",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "the tasks that the candidate should do on this day for preparation",
          ),
      }),
    )
    .describe(
      "a day-wise preparation plan for the candidate to prepare for this interview",
    ),
});

async function generateInterviewReport({jobdescription,resume,selfdescription,})
 {  
    const prompt = `Generate an interview report for a candidate providing the following details:
                    Resume: ${resume}
                    Self Description: ${selfdescription}
                    Job Description: ${jobdescription}`

    const response = await Ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",// json type response will be give by ai
        responseSchema: zodToJsonSchema(interviewReportSchema)// in this schema format
    }
  });
  
  return JSON.parse(response.text);

 }

 module.exports = generateInterviewReport;

