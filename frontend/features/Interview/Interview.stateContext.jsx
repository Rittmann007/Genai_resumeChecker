import {createContext,useState} from "react"

const InterviewContext = createContext()

function InterviewProvider({children}) {
    const [loading, setloading] = useState(true)
    const [report, setreport] = useState(null)
    const [reports, setreports] = useState([])

    return (
        <InterviewContext.Provider value={{loading,setloading,report,setreport,reports,setreports}}>
            {children}
        </InterviewContext.Provider>
    )
}

export {
    InterviewContext,
    InterviewProvider
}