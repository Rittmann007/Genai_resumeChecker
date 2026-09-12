import React, { useState, useRef, useEffect } from 'react'
import { useInterview } from '../Hooks/useInterview'
import Navbar from '../../auth/pages/Navbar'

// Turns **bold** text and bullet lines (starting with * or -) into
// presentable JSX without pulling in a markdown dependency.
function renderRichText(text) {
  if (!text) return null

  const renderInline = (line, keyPrefix) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={`${keyPrefix}-${i}`} className='text-white font-semibold'>
          {part.slice(2, -2)}
        </strong>
      ) : (
        <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
      )
    )
  }

  const blocks = text.trim().split(/\n\s*\n/)

  return blocks.map((block, bIdx) => {
    const lines = block.split('\n').filter((l) => l.trim() !== '')
    const isList = lines.length > 0 && lines.every((l) => /^\s*[*-]\s+/.test(l))

    if (isList) {
      return (
        <ul key={bIdx} className='space-y-1.5 my-2'>
          {lines.map((line, lIdx) => (
            <li key={lIdx} className='flex gap-2 text-sm text-gray-300'>
              <span className='text-red-500 mt-1'>•</span>
              <span>{renderInline(line.replace(/^\s*[*-]\s+/, ''), `${bIdx}-${lIdx}`)}</span>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <p key={bIdx} className='text-sm text-gray-300 leading-relaxed my-2'>
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {renderInline(line, `${bIdx}-${lIdx}`)}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    )
  })
}

// The RAG service returns { message, response: [{ type: "text", text }] }
// — pull out and join whatever text parts it sent back.
function extractAssistantText(result) {
  if (!result?.response?.length) return "Sorry, I couldn't generate a response."
  return result.response
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n\n')
}

function Interview() {
  const {report,loading,getPdf,getChatResponse,Chatloading} = useInterview()
  const [activeTab, setActiveTab] = useState('technical')
  const [rightPanelTab, setRightPanelTab] = useState('analytics')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I've read through your resume, the job description, and your answers for this report. Ask me anything about it — or about the company, if you name it.",
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (rightPanelTab === 'chatbot') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, rightPanelTab])

  const handleSendMessage = async () => {
    const query = chatInput.trim()
    if (!query || Chatloading) return

    setMessages((prev) => [...prev, { role: 'user', text: query }])
    setChatInput('')

    const result = await getChatResponse(report._id, query)

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: result ? extractAssistantText(result) : "Something went wrong — try asking again.",
      },
    ])
  }

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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

  if (!report) {
    return (
      <div className='w-full min-h-screen bg-[#1f1f1f] text-white flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-gray-400'>No data available</p>
        </div>
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
    <div className='w-full h-screen bg-[#1f1f1f] text-white flex flex-col overflow-hidden'>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Navbar />
      <div className='flex flex-1 min-h-0'>
        {/* Left Sidebar - Navigation */}
        <div className='w-80 bg-[#252525] border-r border-gray-700 p-6 overflow-y-auto min-h-0 scrollbar-hide'>
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

            <div className='border-t border-gray-600 pt-4 mt-4'>
              <button
                onClick={() => getPdf(report._id)}
                className='w-full px-4 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white transition'
              >
                📥 Download AI Resume
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 overflow-y-auto p-8 min-h-0 scrollbar-hide'>
          <div className='max-w-4xl'>
            {getCurrentContent()}
          </div>
        </div>

        {/* Right Sidebar - Analytics / Interview Bot */}
        <div className='w-80 bg-[#252525] border-l border-gray-700 flex flex-col overflow-hidden min-h-0'>
          {/* Toggle */}
          <div className='p-4 border-b border-gray-700'>
            <div className='flex bg-[#2a2a2a] rounded-lg p-1'>
              <button
                onClick={() => setRightPanelTab('analytics')}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition ${
                  rightPanelTab === 'analytics'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setRightPanelTab('chatbot')}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition ${
                  rightPanelTab === 'chatbot'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                🤖 Interview Bot
              </button>
            </div>
          </div>

          {rightPanelTab === 'analytics' ? (
            <div className='flex-1 p-6 overflow-y-auto scrollbar-hide'>
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
          ) : (
            <div className='flex-1 flex flex-col min-h-0'>
              {/* Messages */}
              <div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide'>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-red-600 text-white text-sm'
                          : 'bg-[#2a2a2a] border border-gray-700'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className='text-sm'>{msg.text}</p>
                      ) : (
                        renderRichText(msg.text)
                      )}
                    </div>
                  </div>
                ))}

                {Chatloading && (
                  <div className='flex justify-start'>
                    <div className='bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 flex gap-1.5'>
                      <span className='w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]'></span>
                      <span className='w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]'></span>
                      <span className='w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce'></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className='p-4 border-t border-gray-700'>
                <div className='flex items-end gap-2'>
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder='Ask about this report...'
                    rows={1}
                    disabled={Chatloading}
                    className='flex-1 resize-none bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 disabled:opacity-50'
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={Chatloading || !chatInput.trim()}
                    className='bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition'
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Interview