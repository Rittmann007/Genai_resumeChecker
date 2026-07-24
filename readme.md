# GenAI Resume Checker

AI-powered resume checker and generator. Upload a resume and job description, get an AI-generated interview report, and download a tailored resume PDF.

**Live site:** [genai-resume-checker.vercel.app](https://genai-resume-checker.vercel.app/)

> **Note:** The frontend and backend are on different domains (Vercel + Render), so login/register relies on a cross-site cookie. If you can't stay logged in, allow third-party cookies for this site in your browser settings.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express 5, MongoDB (Mongoose)
**AI:** Google Gemini (`@google/genai`)
**PDF Generation:** Puppeteer-core + `@sparticuz/chromium`
**Email:** Gmail API (OAuth2) for OTP verification
**Auth:** JWT (httpOnly cookie / Bearer token)

## Project Structure

```
├── frontend/     # React + Vite app
└── backend/      # Express API server
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_GENAI_API_KEY=your_gemini_api_key

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
GOOGLE_USER=your_gmail_address
```

Run:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set your backend URL in the frontend's API config/env before running.

## Notes

- OTP verification emails are sent via the Gmail API (not SMTP), since most free hosting platforms block outbound SMTP ports.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` need an OAuth2 app with the `gmail.send` scope authorized for `GOOGLE_USER`.
- Resume PDF generation uses `puppeteer-core` with `@sparticuz/chromium` (pinned to `131.0.1`) to run headless Chromium on constrained hosting environments.