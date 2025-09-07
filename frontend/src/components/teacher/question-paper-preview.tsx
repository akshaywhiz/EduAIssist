'use client'

import { useState, useEffect } from 'react'
import { questionsAPI } from '@/lib/api'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'

interface Question {
  id: string
  questionText: string
  type: 'multiple_choice' | 'short_answer' | 'long_answer'
  marks: number
  options?: string[]
  correctAnswer?: string
  order: number
}

interface QuestionPaperPreviewProps {
  examId: string
  title?: string
  maxMarks?: number
  duration?: number
}

export function QuestionPaperPreview({ examId, title, maxMarks, duration }: QuestionPaperPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSection, setActiveSection] = useState<string>('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const { data: questions, isLoading, refetch } = useQuery(
    ['questions-by-exam', examId],
    () => questionsAPI.byExam(examId),
    { refetchInterval: false }
  )

  // Update current time every minute for accurate display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollTop(scrollTop > 300) // Show button after scrolling 300px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to section functionality
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
      setIsMobileMenuOpen(false) // Close mobile menu after selection
    }
  }

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Format date and time
  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    return date.toLocaleDateString('en-GB', options)
  }

  const handleRegenerate = async (questionId: string) => {
    try {
      await questionsAPI.regenerate(questionId)
      toast.success('Question regenerated successfully')
      refetch()
    } catch (error) {
      toast.error('Failed to regenerate question')
    }
  }

  const handleUpdate = async (questionId: string, updates: Partial<Question>) => {
    try {
      await questionsAPI.update(questionId, updates)
      toast.success('Question updated successfully')
      setEditingQuestion(null)
      refetch()
    } catch (error) {
      toast.error('Failed to update question')
    }
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editingQuestion) {
      handleUpdate(editingQuestion.id, editingQuestion)
    }
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
    setIsEditing(false)
  }

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-download' })
      const response = await questionsAPI.pdf(examId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Question_Paper'}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded successfully!', { id: 'pdf-download' })
    } catch (error) {
      toast.error('Failed to download PDF', { id: 'pdf-download' })
    }
  }

  const handlePreviewPDF = async () => {
    try {
      toast.loading('Generating PDF preview...', { id: 'pdf-preview' })
      const response = await questionsAPI.pdfPreview(examId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      window.URL.revokeObjectURL(url)
      toast.success('PDF preview opened!', { id: 'pdf-preview' })
    } catch (error) {
      toast.error('Failed to open PDF preview', { id: 'pdf-preview' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading questions...</div>
      </div>
    )
  }

  // Extract the actual questions array from the response
  const questionsArray: Question[] = questions?.data || questions || []

  if (!questionsArray || questionsArray.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No questions generated yet.</p>
      </div>
    )
  }

  // Group questions by type
  const mcqQuestions = questionsArray.filter((q: Question) => q.type === 'multiple_choice').sort((a: Question, b: Question) => a.order - b.order)
  const shortQuestions = questionsArray.filter((q: Question) => q.type === 'short_answer').sort((a: Question, b: Question) => a.order - b.order)
  const longQuestions = questionsArray.filter((q: Question) => q.type === 'long_answer').sort((a: Question, b: Question) => a.order - b.order)

  // Create navigation sections
  const navigationSections = [
    ...(mcqQuestions.length > 0 ? [{ id: 'section-mcq', label: 'Section A - MCQs', count: mcqQuestions.length }] : []),
    ...(shortQuestions.length > 0 ? [{ id: 'section-short', label: 'Section B - Short Questions', count: shortQuestions.length }] : []),
    ...(longQuestions.length > 0 ? [{ id: 'section-long', label: 'Section C - Long Questions', count: longQuestions.length }] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Title and Info */}
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                EduAIssist
              </h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                {maxMarks && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Total: {maxMarks} marks</span>}
                {duration && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{duration} mins</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Mobile Navigation Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* PDF Action Buttons */}
              <button
                onClick={handlePreviewPDF}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">Preview</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm absolute left-0 right-0 top-16 z-40">
            <div className="px-4 py-3 space-y-2">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.label} ({section.count})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="pt-20 pb-6">
        <div className="flex min-h-screen relative">
          {/* Quick Navigation Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="fixed left-6 top-20 w-72 bg-white rounded-lg shadow-sm border p-4 max-h-[calc(100vh-6rem)] overflow-y-auto z-40">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Navigation</h3>
              <nav className="space-y-1">
                {navigationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border-l-4 border-blue-500 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate font-medium">{section.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 font-semibold ${
                        activeSection === section.id
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {section.count}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
              
              {/* Stats Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-900 mb-3">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-xs font-medium text-blue-900">Total Questions:</span>
                    <span className="text-sm font-bold text-blue-700">{questionsArray.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <span className="text-xs font-medium text-green-900">Total Marks:</span>
                    <span className="text-sm font-bold text-green-700">{questionsArray.reduce((sum, q) => sum + q.marks, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-5xl mx-auto px-4 lg:px-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              {/* Enhanced Header */}
              <div className="text-center mb-8 border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {title || 'Question Paper'}
                </h2>
                <div className="text-sm text-gray-600 mb-4">
                  Generated on: {formatDateTime(currentTime)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {maxMarks && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-900">Total Marks</span>
                      <div className="text-lg font-bold text-blue-700">{maxMarks}</div>
                    </div>
                  )}
                  {duration && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <span className="font-semibold text-green-900">Duration</span>
                      <div className="text-lg font-bold text-green-700">{duration} mins</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Read each question carefully before answering</li>
                  <li>• All questions are compulsory</li>
                  <li>• Write your answers clearly and legibly</li>
                  <li>• Show all necessary working for calculation questions</li>
                </ul>
              </div>

              {/* MCQ Section */}
              {mcqQuestions.length > 0 && (
                <div id="section-mcq" className="mb-8 scroll-mt-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mr-3">A</span>
                    Multiple Choice Questions ({mcqQuestions[0]?.marks || 1} mark each)
                  </h2>
                  <div className="space-y-4">
                    {mcqQuestions.map((question, index) => (
                      <div key={question.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium text-gray-900">
                            Q{index + 1}. ({question.marks} mark)
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRegenerate(question.id)}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Regenerate
                            </button>
                            <button
                              onClick={() => handleEdit(question)}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 mb-3">{question.questionText}</p>
                        {question.options && question.options.length > 0 && (
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <span className="w-6 text-sm font-medium text-gray-600">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span className="text-gray-700">{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Short Answer Section */}
              {shortQuestions.length > 0 && (
                <div id="section-short" className="mb-8 scroll-mt-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-green-200 pb-2 flex items-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-3">B</span>
                    Short Answer Questions ({shortQuestions[0]?.marks || 5} marks each)
                  </h2>
                  <div className="space-y-4">
                    {shortQuestions.map((question, index) => (
                      <div key={question.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium text-gray-900">
                            Q{mcqQuestions.length + index + 1}. ({question.marks} marks)
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRegenerate(question.id)}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Regenerate
                            </button>
                            <button
                              onClick={() => handleEdit(question)}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 mb-3">{question.questionText}</p>
                        <div className="h-16 border-t border-gray-200 pt-2">
                          <span className="text-sm text-gray-500">Answer space</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Answer Section */}
              {longQuestions.length > 0 && (
                <div id="section-long" className="mb-8 scroll-mt-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-200 pb-2 flex items-center">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold mr-3">C</span>
                    Long Answer Questions ({longQuestions[0]?.marks || 10} marks each)
                  </h2>
                  <div className="space-y-4">
                    {longQuestions.map((question, index) => (
                      <div key={question.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium text-gray-900">
                            Q{mcqQuestions.length + shortQuestions.length + index + 1}. ({question.marks} marks)
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRegenerate(question.id)}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Regenerate
                            </button>
                            <button
                              onClick={() => handleEdit(question)}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 mb-3">{question.questionText}</p>
                        <div className="h-32 border-t border-gray-200 pt-2">
                          <span className="text-sm text-gray-500">Answer space</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}

      {/* Edit Modal */}
      {isEditing && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Question</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  value={editingQuestion.questionText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  value={editingQuestion.marks}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, marks: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              {editingQuestion.type === 'multiple_choice' && editingQuestion.options && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                  </label>
                  {editingQuestion.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options!]
                        newOptions[index] = e.target.value
                        setEditingQuestion({ ...editingQuestion, options: newOptions })
                      }}
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
