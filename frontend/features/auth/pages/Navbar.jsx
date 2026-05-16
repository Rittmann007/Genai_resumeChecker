import React from 'react'
import useAuth from '../Hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const {handlelogout} = useAuth()
  const navigate = useNavigate()
  
  return (
    <nav className='w-full bg-[#252525] border-b border-gray-700 px-8 py-4'>
      <div className='max-w-6xl mx-auto flex items-center justify-between'>
        <h1 className='text-xl font-bold text-red-600 cursor-pointer' onClick={() => navigate('/')}>
          ✓ GenAI Resume Checker
        </h1>
        <div className='flex items-center gap-4'>
          <button 
            onClick={() => navigate('/interview/history')}
            className='px-4 py-2 text-gray-300 hover:text-white transition'
          >
            History
          </button>
          <button 
            onClick={handlelogout}
            className='px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar