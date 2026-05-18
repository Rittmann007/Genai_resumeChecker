import {generateInterviewReport,getInterviewReportByID,getAllInterviewReports, generateResumePdf} from "../api/interview.api"
import {useContext, useState,useEffect} from "react"
import {useParams} from "react-router-dom"
import {InterviewContext} from "../Interview.stateContext"
import {toast} from "react-toastify"

export function useInterview() {
    const context = useContext(InterviewContext)
    const { interviewID } = useParams()

    const {loading,setloading,report,setreport,reports,setreports} = context

    async function generateReport({jobDescription,selfDescription,resumeFile}) {
        setloading(true)
        try {
            const response = await generateInterviewReport({jobDescription,selfDescription,resumeFile})
            setreport(response.data)
            return response.data
        } catch (error) {
            toast.error("Error while generating report..")
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
            toast.error("Couldn't fetch report..")
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
            toast.error("Couldn't fetch reports..")
        } finally {
            setloading(false)
        }
    }

    async function getPdf(interviewID) {
        setloading(true)
        try {
            const response = await generateResumePdf({interviewID})
            const url = window.URL.createObjectURL(new Blob([response],{type: "application/pdf"}))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download",`resume_${interviewID}.pdf`)
            document.body.appendChild(link)
            link.click()
        } catch (error) {
            toast.error("Error while generating pdf")
        }finally{
            setloading(false)
        }
    }

    useEffect(() => {
          if(interviewID){
            getReportByID(interviewID)
          }else{
            getAllReports()
          }
        }, [interviewID])
        
        
    return {loading,report,reports,generateReport,getReportByID,getAllReports,getPdf}
}   


