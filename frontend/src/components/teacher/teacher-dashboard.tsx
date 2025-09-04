'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { 
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  DocumentArrowUpIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { classesAPI, materialsAPI, subjectsAPI } from '@/lib/api'
import { api } from '@/lib/api'
import { questionsAPI } from '@/lib/api'
import { useQuery, useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { QuestionGenerator } from '@/components/teacher/question-generator'
import { examsAPI } from '@/lib/api'

const navigation = [
  { name: 'Dashboard', href: '#', icon: ChartBarIcon, current: true },
  { name: 'Question Papers', href: '#questions', icon: DocumentTextIcon, current: false },
  { name: 'Evaluations', href: '#evaluations', icon: ClipboardDocumentCheckIcon, current: false },
  { name: 'Study Materials', href: '#upload-study', icon: DocumentArrowUpIcon, current: false },
  { name: 'Answer Sheets', href: '#upload-answers', icon: ClipboardDocumentCheckIcon, current: false },
]

export function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">EduAIssist</h1>
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Teacher
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.href.replace('#', '') || 'dashboard')}
                className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === (item.href.replace('#', '') || 'dashboard')
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'questions' && <QuestionPapersContent />}
            {activeTab === 'evaluations' && <EvaluationsContent />}
            {activeTab === 'upload-study' && <UploadStudyMaterialsContent />}
            {activeTab === 'upload-answers' && <UploadAnswerSheetsContent />}
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardContent() {
  const { data: classesCount } = useQuery(['classes-count'], async () => {
    const res = await classesAPI.count()
    return res.data.total as number
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Question Papers</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Evaluations</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classesCount ?? '—'}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentArrowUpIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Uploads</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-gray-600">Math quiz evaluated for Class 10-A</p>
              <span className="text-xs text-gray-400">1h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-sm text-gray-600">Generated Physics question paper</p>
              <span className="text-xs text-gray-400">3h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
              <p className="text-sm text-gray-600">Uploaded Chapter 5 materials</p>
              <span className="text-xs text-gray-400">5h ago</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">Generate Question Paper</button>
            <button className="w-full btn-secondary">Upload Study Material</button>
            <button className="w-full btn-secondary">Review Evaluations</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionPapersContent() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const { data: exams, refetch } = useQuery(['exams', q, page], async () => (await examsAPI.list({ q, page, limit: 10 })).data)
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [viewQuestions, setViewQuestions] = useState<any[]>([])
  const [loadingView, setLoadingView] = useState(false)
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Question Papers</h1>
        <button className="btn-primary">Generate New Paper</button>
      </div>

      <QuestionGenerator examId="demo-exam-id" />

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-base font-semibold text-gray-900">Generated Papers</h2>
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by title" className="w-full md:w-80 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div className="px-6 py-4 overflow-x-auto">
          <table className="min-w-full table-fixed border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">S. No.</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Title</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Marks</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2" />
              </tr>
            </thead>
            <tbody className="bg-white">
              {exams?.items?.map((e: any, idx: number) => (
                <tr key={e.id} className={selectedExamId === e.id ? 'bg-indigo-50' : ''}>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{e.title}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{e.className ?? e.classId}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{e.subjectName ?? e.subjectId}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{e.totalMarks}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-right text-sm">
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        window.open(`/questions/preview/${e.id}`, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {(!exams || exams.items.length === 0) && (
                <tr>
                  <td className="border-b border-gray-100 px-3 py-6 text-sm text-gray-500" colSpan={5}>No question papers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Page {page} of {exams?.pages || 1}</p>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
            <button className="btn-secondary" disabled={page >= (exams?.pages || 1)} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {selectedExamId && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Questions</h2>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={async () => {
                const blob = (await questionsAPI.pdf(selectedExamId as string)).data as Blob
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'question-paper.pdf'
                a.click()
                URL.revokeObjectURL(url)
              }}>Download PDF</button>
              <button className="btn-secondary" onClick={() => setSelectedExamId(null)}>Close</button>
            </div>
          </div>
          <div className="px-6 pb-4">
            {loadingView ? (
              <p className="text-sm text-gray-500">Loading questions…</p>
            ) : (
              (viewQuestions || []).length === 0 ? (
                <p className="text-sm text-gray-500">No questions found.</p>
              ) : (
                <ol className="space-y-2 list-decimal pl-6">
                  {(viewQuestions || []).map((q: any) => (
                    <li key={q.id} className="text-sm text-gray-800">
                      <span className="font-medium">({q.marks} marks)</span> {q.questionText}
                    </li>
                  ))}
                </ol>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function EvaluationsContent() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Evaluations</h1>
        <button className="btn-primary">Start New Evaluation</button>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Assisted Evaluation</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-800">
            Upload handwritten answer sheets and let AI evaluate them. You can review and override 
            AI scores to ensure accuracy and provide personalized feedback.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">Math Quiz - Class 10-A</h4>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Pending Review
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">25 students • AI Evaluation: 92% complete</p>
            <button className="text-sm btn-primary">Review Evaluations</button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">Physics Test - Class 11-B</h4>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Completed
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">30 students • Evaluation completed</p>
            <button className="text-sm btn-secondary">View Reports</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadStudyMaterialsContent() {
  const { user } = useAuth()
  const { data: classes } = useQuery(['classes'], async () => (await classesAPI.getAll()).data)
  const { data: subjects } = useQuery(['subjects'], async () => (await subjectsAPI.getAll()).data)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [listClassId, setListClassId] = useState('')
  const [listSubjectId, setListSubjectId] = useState('')
  const [appliedClass, setAppliedClass] = useState<string | undefined>(undefined)
  const [appliedSubject, setAppliedSubject] = useState<string | undefined>(undefined)
  const { data: studyList, refetch } = useQuery(['study-list', page, query, appliedClass, appliedSubject], async () => (
    await materialsAPI.listStudy({ page, q: query, class: appliedClass, subject: appliedSubject, limit: 10 })
  ).data)
  const [progress, setProgress] = useState<number>(0)
  const uploadMutation = useMutation(async (payload: { file: File; classId: string; subjectId: string }) => {
    const form = new FormData()
    form.append('file', payload.file)
    form.append('teacherId', (user as any)?.id || '')
    const className = (classes || []).find((c: any) => c.id === payload.classId)?.name || payload.classId
    const subjectName = (subjects || []).find((s: any) => s.id === payload.subjectId)?.name || payload.subjectId
    form.append('class', className)
    form.append('subject', subjectName)
    //form.append('vectorDbCollectionId', `col_${Date.now()}`)
    return (await materialsAPI.uploadStudy(form, (e) => {
      if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
    })).data
  })

  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Subjects should be independent of class selection
  const allSubjects = useMemo(() => subjects || [], [subjects])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !selectedClass || !selectedSubject) {
      toast.error('Please select class, subject, and file')
      return
    }
    const t = toast.loading('Uploading...')
    uploadMutation.mutate({ file, classId: selectedClass, subjectId: selectedSubject }, {
      onSuccess: () => {
        toast.success('Uploaded study material', { id: t })
        setFile(null)
        setSelectedClass('')
        setSelectedSubject('')
        setModalOpen(false)
        // Refresh list to show the new row immediately
        refetch()
      },
      onError: () => { toast.error('Upload failed', { id: t }) },
    })
  }

  const onDrop = (accepted: File[]) => {
    if (accepted?.[0]) {
      setFile(accepted[0])
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false, maxSize: 10 * 1024 * 1024 })

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Upload Study Materials</h1>
      {/**
       * Upload section commented per requirement. The upload flow is still available via the modal.
       *
       * <div className="rounded-2xl border border-gray-200 bg-white shadow-sm"> ... </div>
       */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button onClick={() => setModalOpen(true)} className="btn-primary w-full md:w-auto">Upload New</button>
          <div className="w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by file name"
              className="w-full md:w-80 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 gap-3 md:flex md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Select
              value={listClassId}
              onChange={(v) => { setListClassId(v); setPage(1); }}
              placeholder="Filter Class"
              options={(classes || []).map((c: any) => ({ value: c.id, label: c.name }))}
            />
            <Select
              value={listSubjectId}
              onChange={(v) => { setListSubjectId(v); /* do not apply until button click */ }}
              placeholder="Filter Subject"
              options={(subjects || []).map((s: any) => ({ value: s.id, label: s.name }))}
            />
            <button
              onClick={() => {
                const className = (classes || []).find((c: any) => c.id === listClassId)?.name
                const subjectName = (subjects || []).find((s: any) => s.id === listSubjectId)?.name
                setAppliedClass(className || undefined)
                setAppliedSubject(subjectName || undefined)
                setPage(1)
                refetch()
              }}
              className="btn-secondary"
            >
              Apply
            </button>
            <button
              onClick={() => { setListClassId(''); setListSubjectId(''); setAppliedClass(undefined); setAppliedSubject(undefined); setQuery(''); setPage(1); refetch(); }}
              className="btn-secondary"
            >
              Reset Filter
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 overflow-x-auto hidden md:block">
          <table className="min-w-full table-fixed border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">S. No.</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">File name</th>
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2" />
                <th className="border-b border-gray-200 bg-gray-50 px-3 py-2" />
              </tr>
            </thead>
            <tbody className="bg-white">
              {studyList?.items?.map((m: any, idx: number) => (
                <tr key={m.id}>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{m.class ?? '-'}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{m.subject ?? '-'}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{m.originalName ?? '-'}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-right text-sm">
                    <a
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 bg-indigo-50 hover:bg-indigo-100 mr-2"
                      href={m.pdfCloudUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <EyeIcon className="h-4 w-4" /> View
                    </a>
                    <a
                      href={m.pdfCloudUrl}
                      download
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" /> Download
                    </a>
                  </td>
                </tr>
              ))}
              {(!studyList || studyList.items.length === 0) && (
                <tr>
                  <td className="border-b border-gray-100 px-3 py-6 text-sm text-gray-500" colSpan={5}>No study materials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="px-4 pb-4 md:hidden space-y-3">
          {studyList?.items?.map((m: any, idx: number) => (
            <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">#{(page - 1) * 10 + idx + 1}</span>
                <div className="flex gap-2">
                  <a className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 bg-indigo-50" href={m.pdfCloudUrl} target="_blank" rel="noreferrer">
                    <EyeIcon className="h-4 w-4" /> View
                  </a>
                  <a className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200" href={m.pdfCloudUrl} download>
                    <ArrowDownTrayIcon className="h-4 w-4" /> Download
                  </a>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Class</p>
                  <p className="font-medium text-gray-900">{m.class ?? '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Subject</p>
                  <p className="font-medium text-gray-900">{m.subject ?? '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">File</p>
                  <p className="font-medium text-gray-900 break-words">{m.originalName ?? '-'}</p>
                </div>
              </div>
            </div>
          ))}
          {(!studyList || studyList.items.length === 0) && (
            <p className="px-2 py-6 text-center text-sm text-gray-500">No study materials found.</p>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Page {page} of {studyList?.pages || 1}</p>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
            <button className="btn-secondary" disabled={page >= (studyList?.pages || 1)} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload New Study Material">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <Select
                value={selectedClass}
                onChange={setSelectedClass}
                placeholder="Select Class"
                options={(classes || []).map((c: any) => ({ value: c.id, label: c.name }))}
              />
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Select
                value={selectedSubject}
                onChange={setSelectedSubject}
                placeholder="Select Subject"
                options={(allSubjects || []).map((s: any) => ({ value: s.id, label: s.name }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
            {file && (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                  {file.name}
                </span>
                <button type="button" className="text-xs text-red-600 hover:text-red-700" onClick={() => setFile(null)}>
                  Remove
                </button>
              </div>
            )}
            {uploadMutation.isLoading && (
              <div className="mt-3 h-2 w-full rounded bg-gray-100">
                <div className="h-2 rounded bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => { setSelectedClass(''); setSelectedSubject(''); setFile(null); }} className="btn-secondary">Reset</button>
            <button type="submit" className="btn-primary">Upload</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function UploadAnswerSheetsContent() {
  const uploadMutation = useMutation(async (payload: { file: File }) => {
    const form = new FormData()
    form.append('file', payload.file)
    return (await materialsAPI.uploadAnswers(form)).data
  })

  const [file, setFile] = useState<File | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      toast.error('Please choose a file')
      return
    }
    const t = toast.loading('Uploading...')
    uploadMutation.mutate({ file }, {
      onSuccess: () => {
        toast.success('Uploaded answer sheets', { id: t })
        setFile(null)
      },
      onError: () => { toast.error('Upload failed', { id: t }) },
    })
  }

  const onDrop = (accepted: File[]) => {
    if (accepted?.[0]) setFile(accepted[0])
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }, multiple: false, maxSize: 10 * 1024 * 1024 })

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Upload Answer Sheets</h1>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Files</h2>
          <p className="text-sm text-gray-500">Upload scanned answer sheets for AI-assisted evaluation.</p>
        </div>
        <form onSubmit={submit} className="px-6 py-6 grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
            <div {...getRootProps()} className={`flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'} px-4 text-center transition-colors`}>
              <input {...getInputProps()} />
              <div>
                <p className="text-sm text-gray-600">{isDragActive ? 'Drop the file here…' : 'Drag & drop file here, or click to browse'}</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                {file && (
                  <p className="mt-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow ring-1 ring-gray-200">{file.name}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="submit" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={uploadMutation.isLoading}>
              {uploadMutation.isLoading ? 'Uploading…' : 'Upload'}
            </button>
        </div>
        </form>
      </div>
    </div>
  )
}
