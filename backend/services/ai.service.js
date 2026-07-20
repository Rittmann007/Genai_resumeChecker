const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const Ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Define schema in Gemini's native format — avoids zod conversion issues
const geminiSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "Score between 0-100 indicating how well the candidate matches the job",
    },
    title: {
      type: "string",
      description: "Title of the job",
    },
    technicalQuestions: {
      type: "array",
      description: "Technical questions for the interview",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The technical question" },
          intention: {
            type: "string",
            description: "Why the interviewer asks this",
          },
          answer: {
            type: "string",
            description: "approach to answer this question effectively",
          },
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
          intention: {
            type: "string",
            description: "Why the interviewer asks this",
          },
          answer: {
            type: "string",
            description: "approach to answer this question effectively",
          },
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
          focus: {
            type: "string",
            description: "Main focus topic for this day",
          },
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
    "title",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  jobdescription,
  resume,
  selfdescription,
}) {
  const prompt = `You are an expert interview coach. Analyze the candidate's profile and generate a comprehensive interview report.

Resume:
${resume}

Self Description:
${selfdescription}

Job Description:
${jobdescription}

Generate the following:
0. title: title of the job
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
    title: parsed.title || "Interview Report",
    technicalQuestions: safeArray(parsed.technicalQuestions),
    behaviouralQuestions: safeArray(parsed.behaviouralQuestions),
    skillGaps: safeArray(parsed.skillGaps),
    preparationPlan: safeArray(parsed.preparationPlan),
  };
}

async function convertHtmlToPdf(html) {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm",
      },
      displayHeaderFooter: false,
    });
    await page.close();
    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function generateResumePdf({ jobDescription, resume, selfDescription }) {
  const resumePdfSchema = {
    type: "object",
    properties: {
      html: {
        type: "string",
        description:
          "the html content of the resume which can be converted to pdf using puppeteer npm package",
      },
    },
    required: ["html"],
  };

  const prompt = `You are an expert resume writer and ATS optimization specialist. Your task is to generate a professional, ATS-friendly HTML resume that will be converted to PDF using Puppeteer.

## Input Details
Resume/Experience: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

## Critical Requirements

### ATS Optimization
- Use standard section headings: "Work Experience", "Education", "Skills", "Projects", "Summary"
- Use plain readable fonts (Arial, Calibri, or Georgia) — no icons, graphics, or tables for layout
- Include keywords and phrases extracted directly from the job description
- No headers/footers, no text in images, no columns (ATS cannot parse multi-column layouts)
- Use semantic HTML: <h1> for name, <h2> for sections, <ul>/<li> for bullets

### Page Length Rule (STRICTLY FOLLOW)
- Fresher (0-2 years experience): EXACTLY 1 A4 page
- Mid-level (2-5 years): 1 to 1.5 A4 pages
- Senior (5+ years): maximum 2 A4 pages
- Achieve this through font size (10-11px body), margins (15mm), and content density
- If content exceeds the limit, summarize or remove least relevant points

### HTML Structure Rules
- The HTML must be a complete document starting with <!DOCTYPE html>
- All CSS must be inside a single <style> block in <head> — no inline styles
- No JavaScript, no external resources, no Google Fonts — system fonts only
- No flexbox or grid for main layout — use block elements only (ATS parsers break on these)
- The HTML must be fully self-contained and render correctly with Puppeteer

### Puppeteer-Compatible CSS (MUST INCLUDE EXACTLY)
Include these rules in your <style> block without modification:
@page {
  size: A4;
  margin: 15mm;
}
* {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  box-sizing: border-box;
}
h2 {
  page-break-after: avoid;
}
li, p {
  page-break-inside: avoid;
}
.section {
  page-break-inside: avoid;
  margin-bottom: 12px;
}

### Typography & Sizing
- Candidate name: 20-22px, bold
- Section headings (<h2>): 13-14px, bold, uppercase, with a bottom border
- Body text: 10-11px
- Line height: 1.4
- Color: #1a1a1a text on #ffffff background only — no colored backgrounds

### Content Rules
- Tailor every bullet point to mirror keywords from the job description
- Quantify achievements wherever possible (e.g. "Improved page load speed by 30%")
- Use strong action verbs: Built, Developed, Optimized, Led, Designed, Implemented
- Remove experience irrelevant to the job description
- Keep each bullet point to 1 line, maximum 2 lines
- Summary: 2-3 lines maximum, tailored to the job description
- Skills section: comma-separated or grouped by category — no skill bars or ratings

### Section Order
1. Candidate Name + Contact Info (email, phone, LinkedIn, GitHub if available)
2. Professional Summary
3. Skills
4. Work Experience (reverse chronological)
5. Projects (if relevant)
6. Education

## Output Format
Return ONLY a valid JSON object with a single field "html" containing the complete HTML string.
Do not include any explanation, markdown, code fences, or text outside the JSON object.
The JSON must be parseable by JSON.parse() directly.

Correct format:
  {"html": "<!DOCTYPE html><html><head>...</head><body>...</body></html>"}`;

  const response = await Ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumePdfSchema,
    },
  });

  const rawText = response.text || "";
  if (!rawText) throw new Error("Gemini returned empty response");
  const jsonContent = JSON.parse(rawText);
  if (!jsonContent.html) throw new Error("Gemini HTML missing");

  if (jsonContent.html) {
    const pdfBuffer = await convertHtmlToPdf(jsonContent.html);
    return pdfBuffer;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
