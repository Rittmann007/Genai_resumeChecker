import axios from "axios"

async function generateInterviewReport({jobDescription,selfDescription,resumeFile}) {
    const formdata = new FormData()
    formdata.append("jobDescription",jobDescription)// for sending files
    formdata.append("selfDescription",selfDescription)
    formdata.append("resume",resumeFile)

    const response = await axios.post("http://localhost:3000/api/v1/interview/",formdata,
        {headers:{
            "Content-Type": "multipart/form-data"},
            withCredentials:true
        }
    )

    return response.data
}

async function getInterviewReportByID(interviewID) {
    const response = await axios.get(`http://localhost:3000/api/v1/interview/report/${interviewID}`,
        {withCredentials:true}
    )

    return response.data
}

async function getAllInterviewReports() {
    const response = await axios.get("http://localhost:3000/api/v1/interview/allreports",
        {withCredentials:true}
    )

    return response.data
}

export {
    generateInterviewReport,
    getInterviewReportByID,
    getAllInterviewReports
}