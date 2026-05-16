import React from 'react'
import { useInterview } from '../Hooks/useInterview'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../auth/pages/Navbar'

function ReportsHistory() {
  const { reports, loading } = useInterview()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-[#1f1f1f] text-white flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='inline-block animate-spin'>
              <div className='w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full'></div>
            </div>
            <p className='mt-4 text-gray-400'>Loading interview results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <div className='w-full min-h-screen bg-[#1f1f1f] text-white flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center p-8'>
          <div className='max-w-xl text-center'>
            <h2 className='text-2xl font-bold text-red-500 mb-2'>No reports yet</h2>
            <p className='text-gray-400'>Generate an interview report from the Home page to see it here.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-[#1f1f1f] text-white flex flex-col'>
      <Navbar />
      <div className='flex-1 p-8'>
        <div className='max-w-5xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-red-500'>Recent Reports</h1>
          <p className='text-sm text-gray-400'>{reports.length} report{reports.length > 1 ? 's' : ''}</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {reports.map((r) => (
            <div key={r._id} className='bg-[#2a2a2a] rounded-lg p-4 border border-gray-700'>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-lg font-semibold text-white truncate'>{r.title}</h2>
                  <p className='text-xs text-gray-400 mt-1'>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>

                <div className='text-right'>
                  <div className='text-2xl font-bold text-red-600'>{r.matchScore}%</div>
                  <div className='text-xs text-gray-400'>Match Score</div>
                </div>
              </div>

              <div className='mt-3'>
                <button
                  onClick={() => navigate(`/interview/${r._id}`)}
                  className='px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm'
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default ReportsHistory
