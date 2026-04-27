import React from 'react'
import useAuth from '../Hooks/useAuth'
import { Navigate } from 'react-router-dom'


function Protected({children}) {
    const {loading,user} = useAuth()

    if (loading) {
        return (<h1>Loading ...</h1>)
    }
    if (!user) {
        return <Navigate to={"/login"}/>
    }
  return children
}

export default Protected