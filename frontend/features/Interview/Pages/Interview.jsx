import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Interview() {
  const { interviewID } = useParams()
  const [activeTab, setActiveTab] = useState('technical')
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dummy data - replace with API call
  const dummyData = {
    matchScore: 85,
    technicalQuestions: [
      {
        question: "Can you explain the concept of Virtual DOM in React and why it's beneficial for performance?",
        intention: "To assess the candidate's understanding of React's core mechanisms and performance optimization strategies beyond just using the library.",
        answer: "The Virtual DOM is a lightweight copy of the actual DOM, represented as a JavaScript object. When a component's state changes, React first updates the Virtual DOM, then compares it with the previous Virtual DOM state (a process called 'diffing'). Only the differences are then 'reconciled' and updated in the real DOM. This is beneficial because direct manipulation of the real DOM is expensive and slow. By minimizing direct DOM operations, React significantly improves rendering performance."
      },
      {
        question: "Describe a scenario where you would use `useMemo` or `useCallback` in a React component. What problem do they solve?",
        intention: "To evaluate the candidate's knowledge of React hooks for performance optimization and their ability to apply them correctly.",
        answer: "`useMemo` is used to memoize a computed value, preventing re-calculation on every render if its dependencies haven't changed. `useCallback` is used to memoize a function, preventing its re-creation on every render. They solve performance problems by preventing unnecessary re-renders of child components when props (values or functions) passed down haven't actually changed."
      }
    ],
    behaviouralQuestions: [
      {
        question: "Tell me about a time you collaborated with a designer or backend engineer on a feature. How did you ensure a seamless user experience?",
        intention: "To assess collaboration skills and the ability to bridge communication gaps between different teams to deliver integrated features.",
        answer: "I would use the STAR method. Describe a specific project where I worked closely with a designer and a backend engineer. I would highlight proactive communication, clear documentation, sharing early prototypes, and iterative feedback loops to ensure alignment."
      },
      {
        question: "Describe a challenging technical problem you've encountered and how you approached solving it.",
        intention: "To evaluate problem-solving skills, resilience, and the ability to learn from difficulties.",
        answer: "I would use the STAR method. Describe a specific, complex bug or performance bottleneck. Detail the steps taken and emphasize the iterative process and the specific technical knowledge gained."
      }
    ],
    skillGaps: [
      { skill: "Testing Frameworks (e.g., Jest, React Testing Library)", severity: "medium" },
      { skill: "Build Tools (e.g., Webpack, Vite)", severity: "low" },
      { skill: "CI/CD Pipelines", severity: "low" }
    ],
    preparationPlan: [
      {
        day: 1,
        focus: "React.js Fundamentals & Advanced Concepts",
        tasks: [
          "Review React lifecycle methods, hooks (useState, useEffect, useContext, useRef, useReducer), and their common use cases.",
          "Practice building a small application demonstrating data flow, component composition, and state management.",
          "Deep dive into Virtual DOM, Reconciliation, and Fiber architecture."
        ]
      },
      {
        day: 2,
        focus: "Redux & State Management",
        tasks: [
          "Revisit Redux core principles: Store, Actions, Reducers, Middleware.",
          "Implement asynchronous operations with Redux Thunk and/or Redux Saga in a small project.",
          "Understand Redux Toolkit as a modern approach to Redux development."
        ]
      },
      {
        day: 3,
        focus: "JavaScript Proficiency & ES6+",
        tasks: [
          "Review core JavaScript concepts: closures, prototypes, event loop, 'this' keyword.",
          "Practice ES6+ features: arrow functions, destructuring, spread/rest operators, Promises, async/await.",
          "Solve 2-3 medium-difficulty LeetCode or HackerRank problems."
        ]
      }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInterviewData(dummyData)
      setLoading(false)
    }, 500)
  }, [interviewID])

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

  if (!interviewData) {
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
            {interviewData.technicalQuestions.map((q, idx) => (
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
            {interviewData.behaviouralQuestions.map((q, idx) => (
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
            {interviewData.preparationPlan.map((plan, idx) => (
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
          <div className='space-y-4'>
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
                {interviewData.matchScore}%
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-red-600 h-2 rounded-full transition-all'
                  style={{ width: `${interviewData.matchScore}%` }}
                ></div>
              </div>
              <p className='text-xs text-gray-400 mt-3'>Resume-Job Match</p>
            </div>
          </div>

          {/* Skill Gaps */}
          <div>
            <h3 className='text-sm uppercase font-semibold text-gray-400 mb-4'>Skill Gaps</h3>
            <div className='space-y-3'>
              {interviewData.skillGaps.map((gap, idx) => (
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