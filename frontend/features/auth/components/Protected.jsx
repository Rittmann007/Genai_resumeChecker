import React from 'react'
import useAuth from '../Hooks/useAuth'
import { Navigate } from 'react-router-dom'


function Protected({children}) {
    const {loading,user} = useAuth()

    if (loading) {
        return (<div className='w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin'>
            <div className='w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full'></div>
          </div>
          <p className='mt-4 text-gray-400'>Loading...</p>
        </div>
      </div>)
    }
    if (!user || !user.verified) {
        return <Navigate to={"/login"}/>
    }
  return children
}

export default Protected