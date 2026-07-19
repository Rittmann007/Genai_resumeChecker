import axios from "axios"

async function generateInterviewReport({jobDescription,selfDescription,resumeFile}) {
    try {
        const formdata = new FormData()
    formdata.append("jobDescription",jobDescription)// for sending files
    formdata.append("selfDescription",selfDescription)
    formdata.append("resume",resumeFile)

    const response = await axios.post("https://genai-resumechecker-backend.onrender.com/api/v1/interview/",formdata,
        {headers:{
            "Content-Type": "multipart/form-data"},
            withCredentials:true
        }
    )

    return response.data
    } catch (error) {
        throw error
    }
    
}

async function getInterviewReportByID(interviewID) {
    try {
        const response = await axios.get(`https://genai-resumechecker-backend.onrender.com/api/v1/interview/report/${interviewID}`,
        {withCredentials:true}
    )

    return response.data
    } catch (error) {
        throw error
    }
    
}

async function getAllInterviewReports() {
    try {
        const response = await axios.get("https://genai-resumechecker-backend.onrender.com/api/v1/interview/allreports",
        {withCredentials:true}
    )

    return response.data
    } catch (error) {
        throw error
    }
    
}

async function generateResumePdf({interviewID}) {
    try {
        const response = await axios.post(`https://genai-resumechecker-backend.onrender.com/api/v1/interview/resume/Pdf/${interviewID}`,
        null,
        {responseType: "blob",
            withCredentials: true
        }
    )

    return response.data
    } catch (error) {
        throw error
    }
    
}

export {
    generateInterviewReport,
    getInterviewReportByID,
    getAllInterviewReports,
    generateResumePdf
}