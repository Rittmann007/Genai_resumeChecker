import {generateInterviewReport,getInterviewReportByID,getAllInterviewReports} from "../api/interview.api"
import {useContext} from "react"
import {InterviewContext} from "../Interview.stateContext"

export function useInterview() {
    const context = useContext(InterviewContext)

    const {loading,setloading,report,setreport,reports,setreports} = context

    async function generateReport({jobDescription,selfDescription,resumeFile}) {
        setloading(true)
        try {
            const response = await generateInterviewReport({jobDescription,selfDescription,resumeFile})
            setreport(response.data)
            return response.data
        } catch (error) {
            
        }finally {
            setloading(false)
        }
    }

    async function getReportByID(interviewID) {
        setloading(true)
        try {
            const response = await getInterviewReportByID(interviewID)
            setreport(response.data)
            return response.data
        } catch (error) {
            
        } finally {
            setloading(false)
        }
    }

    async function getAllReports() {
        setloading(true)
        try {
            const response = await getAllInterviewReports()
            setreports(response.data)
            return response.data
        } catch (error) {
            
        } finally {
            setloading(false)
        }
    }
        
    return {loading,report,reports,generateReport,getReportByID,getAllReports}
}   


