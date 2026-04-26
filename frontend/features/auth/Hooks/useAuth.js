import {useContext} from "react"
import {Authcontext} from "../Auth.stateContext"
import {login,logout,register} from "../api/auth.api"

// custom hook for user and loading state handling
function useAuth() {
    const context = useContext(Authcontext)
    const {user,setuser,loading,setloading} = context

    async function handleregister({username,email,password}) {
        setloading(true)
        const response = await register({username,email,password})
        setuser(response.data)
        setloading(false)
    }
    async function handlelogin({username,password}) {
        setloading(true)
        const response = await login({username,password})
        setuser(response.data)
        setloading(false)
    }
    async function handlelogout() {
        setloading(true)
        const response = await logout()
        setuser(null)
        setloading(false)
    }

    return (user,loading,handleregister,handlelogin,handlelogout)
}

module.exports = useAuth