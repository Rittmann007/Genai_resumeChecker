import React, { useState} from 'react'
import { useInterview } from '../Hooks/useInterview'

function Interview() {
  const {report,loading} = useInterview()
  const [activeTab, setActiveTab] = useState('technical')

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin'>
            <div className='w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full'></div>
          </div>
          <p className='mt-4 text-gray-400'>Loading interview results...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className='w-full min-h-screen bg-[#1f1f1f] text-white flex items-center justify-center'>
        <p className='text-gray-400'>No data available</p>
      </div>
    )
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-900/30 border-red-600 text-red-300'
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
      case 'low':
        return 'bg-green-900/30 border-green-600 text-green-300'
      default:
        return 'bg-gray-900/30 border-gray-600 text-gray-300'
    }
  }

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'technical':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-white mb-6'>Technical Questions</h2>
            {report.technicalQuestions.map((q, idx) => (
              <div key={idx} className='bg-[#2a2a2a] rounded-lg p-6 space-y-4'>
                <div>
                  <p className='text-sm text-gray-400 mb-2'>Question {idx + 1}</p>
                  <p className='text-lg font-semibold text-red-400'>{q.question}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 mb-2'>Intention</p>
                  <p className='text-sm text-gray-300'>{q.intention}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 mb-2'>Answer</p>
                  <p className='text-sm text-gray-300'>{q.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )
      case 'behavioral':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-white mb-6'>Behavioral Questions</h2>
            {report.behaviouralQuestions.map((q, idx) => (
              <div key={idx} className='bg-[#2a2a2a] rounded-lg p-6 space-y-4'>
                <div>
                  <p className='text-sm text-gray-400 mb-2'>Question {idx + 1}</p>
                  <p className='text-lg font-semibold text-red-400'>{q.question}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 mb-2'>Intention</p>
                  <p className='text-sm text-gray-300'>{q.intention}</p>
                </div>
                <div>
                  <p className='text-xs uppercase text-gray-500 mb-2'>Answer</p>
                  <p className='text-sm text-gray-300'>{q.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )
      case 'preparation':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-white mb-6'>7-Day Preparation Plan</h2>
            {report.preparationPlan.map((plan, idx) => (
              <div key={idx} className='bg-[#2a2a2a] rounded-lg p-6 space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold'>
                    {plan.day}
                  </div>
                  <div>
                    <p className='text-xs uppercase text-gray-500'>Day {plan.day}</p>
                    <p className='text-lg font-semibold text-red-400'>{plan.focus}</p>
                  </div>
                </div>
                <div className='space-y-2'>
                  <p className='text-xs uppercase text-gray-500'>Tasks</p>
                  <ul className='space-y-2'>
                    {plan.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className='flex gap-3 text-sm text-gray-300'>
                        <span className='text-red-500 mt-1'>•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#1f1f1f] text-white'>
      <div className='flex h-screen'>
        {/* Left Sidebar - Navigation */}
        <div className='w-80 bg-[#252525] border-r border-gray-700 p-6 overflow-y-auto'>
          <div className='space-y-6'>
            {/* Title */}
            <div className='bg-[#2a2a2a] rounded-lg p-4 border border-gray-700'>
              <p className='text-xs uppercase text-gray-500 mb-2'>Position</p>
              <h2 className='text-lg font-bold text-red-500'>{report.title}</h2>
            </div>

            <h3 className='text-sm uppercase font-semibold text-gray-400 px-4'>Menu</h3>

            <button
              onClick={() => setActiveTab('technical')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'technical'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              📋 Technical Questions
            </button>

            <button
              onClick={() => setActiveTab('behavioral')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'behavioral'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              💬 Behavioral Questions
            </button>

            <button
              onClick={() => setActiveTab('preparation')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'preparation'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              📅 Preparation Plan
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 overflow-y-auto p-8'>
          <div className='max-w-4xl'>
            {getCurrentContent()}
          </div>
        </div>

        {/* Right Sidebar - Score & Skills */}
        <div className='w-80 bg-[#252525] border-l border-gray-700 p-6 overflow-y-auto'>
          {/* Match Score */}
          <div className='mb-8'>
            <div className='text-center bg-[#2a2a2a] rounded-2xl p-8'>
              <p className='text-sm uppercase text-gray-400 mb-2'>Match Score</p>
              <div className='text-6xl font-bold text-red-600 mb-2'>
                {report.matchScore}%
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-red-600 h-2 rounded-full transition-all'
                  style={{ width: `${report.matchScore}%` }}
                ></div>
              </div>
              <p className='text-xs text-gray-400 mt-3'>Resume-Job Match</p>
            </div>
          </div>

          {/* Skill Gaps */}
          <div>
            <h3 className='text-sm uppercase font-semibold text-gray-400 mb-4'>Skill Gaps</h3>
            <div className='space-y-3'>
              {report.skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 border-2 text-sm font-medium transition ${getSeverityColor(
                    gap.severity
                  )}`}
                >
                  {gap.skill}
                  <div className='text-xs mt-1 opacity-75'>
                    Severity: {gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className='mt-8 pt-8 border-t border-gray-700'>
            <p className='text-xs text-gray-500 mb-3'>Severity Levels</p>
            <div className='space-y-2 text-xs'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                <span className='text-gray-400'>High</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-yellow-600 rounded-full'></div>
                <span className='text-gray-400'>Medium</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                <span className='text-gray-400'>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview