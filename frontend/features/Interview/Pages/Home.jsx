import React, { useState } from "react";
import { useInterview } from "../Hooks/useInterview";
import { useNavigate } from "react-router-dom";

function Home() {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setresumeFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setresumeFile(file);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription || !selfDescription) {
      alert("Please fill in all fields");
      return;
    }
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    } else {
      alert("Error: No report ID returned from server");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="space-y-2 text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">✓</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold">GenAI Resume Checker</h1>
          <p className="text-gray-400 text-lg mt-2">
            Analyze your resume against job requirements
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-lg space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload */}
            <div className="space-y-3">
              <label
                htmlFor="resume"
                className="block text-sm font-semibold text-gray-200"
              >
                📄 Upload Your Resume
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-lg px-4 py-3 bg-[#1f1f1f] border-2 border-dashed border-gray-600 hover:border-red-600 transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
              </div>
              {resumeFile && (
                <p className="text-sm text-green-400 flex items-center gap-2">
                  ✓ {resumeFile.name}
                </p>
              )}
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-semibold text-gray-200"
              >
                💼 Job Description
              </label>
              <textarea
                name="jobDescription"
                id="jobDescription"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="5"
                className="w-full rounded-lg px-4 py-3 bg-[#1f1f1f] border-2 border-gray-600 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition resize-none"
              />
            </div>

            {/* Self Description */}
            <div className="space-y-3">
              <label
                htmlFor="selfDescription"
                className="block text-sm font-semibold text-gray-200"
              >
                👤 Your Experience Summary
              </label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Describe your relevant experience and skills..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                rows="5"
                className="w-full rounded-lg px-4 py-3 bg-[#1f1f1f] border-2 border-gray-600 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-3 font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white transition duration-200 text-lg mt-8"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 pt-8 border-t border-gray-600">
            <p className="text-sm text-gray-400 text-center">
              💡 Our AI will analyze how well your resume matches the job
              description and provide detailed feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
