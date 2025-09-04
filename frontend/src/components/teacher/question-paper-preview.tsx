'use client'

import { useState } from 'react'
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

  const { data: questions, isLoading, refetch } = useQuery(
    ['questions-by-exam', examId],
    () => questionsAPI.byExam(examId),
    { refetchInterval: false }
  )

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
      const response = await questionsAPI.pdf(examId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title || 'Question Paper'}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download PDF')
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title || 'Question Paper'}
        </h1>
        <div className="flex justify-center gap-8 text-sm text-gray-600">
          {maxMarks && <span>Total Marks: {maxMarks}</span>}
          {duration && <span>Duration: {duration} minutes</span>}
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Read each question carefully before answering</li>
          <li>• All questions are compulsory</li>
          <li>• Write your answers clearly and legibly</li>
          <li>• Show all necessary working for calculation questions</li>
        </ul>
      </div>

      {/* MCQ Section */}
      {mcqQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
            Section A - Multiple Choice Questions ({mcqQuestions[0]?.marks || 1} mark each)
          </h2>
          <div className="space-y-4">
            {mcqQuestions.map((question, index) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-gray-900">
                    Q{index + 1}. ({question.marks} mark)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegenerate(question.id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => handleEdit(question)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-green-200 pb-2">
            Section B - Short Answer Questions ({shortQuestions[0]?.marks || 5} marks each)
          </h2>
          <div className="space-y-4">
            {shortQuestions.map((question, index) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-gray-900">
                    Q{mcqQuestions.length + index + 1}. ({question.marks} marks)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegenerate(question.id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => handleEdit(question)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-200 pb-2">
            Section C - Long Answer Questions ({longQuestions[0]?.marks || 10} marks each)
          </h2>
          <div className="space-y-4">
            {longQuestions.map((question, index) => (
              <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-gray-900">
                    Q{mcqQuestions.length + shortQuestions.length + index + 1}. ({question.marks} marks)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegenerate(question.id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => handleEdit(question)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
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

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total Questions: {questionsArray.length} | 
            Total Marks: {questionsArray.reduce((sum, q) => sum + q.marks, 0)}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

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
