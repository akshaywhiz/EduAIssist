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
  ArrowDownTrayIcon,
  BellAlertIcon,
  TrashIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { classesAPI, materialsAPI, subjectsAPI, examsAPI, questionsAPI } from '@/lib/api'
import { api } from '@/lib/api'
import { useQuery, useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { QuestionGenerator } from '@/components/teacher/question-generator'
import { Logo } from '@/components/ui/logo'

const navigation = [
  { name: 'Dashboard', href: '#', icon: ChartBarIcon, current: true },
  { name: 'Question Papers', href: '#questions', icon: DocumentTextIcon, current: false },
  { name: 'Study Materials', href: '#upload-study', icon: DocumentArrowUpIcon, current: false },
  { name: 'Answer Sheet Management', href: '#answer-sheets', icon: ClipboardDocumentListIcon, current: false, disabled: true, comingSoon: true },
]

export function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50 to-gray-100">
      {/* Decorative orbs for brand consistency */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-300 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-200 to-purple-300 blur-3xl" />
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl shadow-xl ring-1 ring-blue-100 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-blue-100/50">
            <div className="flex items-center gap-3">
              <Logo size="md" className="h-8 w-8" />
              <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                EduAIssist
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={async () => {
                    if (item.disabled) return; // Prevent navigation if disabled
                    const newTab = item.href.replace("#", "") || "dashboard";
                    if (newTab !== activeTab) {
                      setIsTransitioning(true);
                      await new Promise(resolve => setTimeout(resolve, 100));
                      setActiveTab(newTab);
                      setIsTransitioning(false);
                    }
                    // Close mobile menu on navigation
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={item.disabled}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-sm group transform ${
                    item.disabled 
                      ? "cursor-not-allowed opacity-60" 
                      : "hover:shadow-md hover:scale-[1.02]"
                  } ${
                    activeTab === (item.href.replace("#", "") || "dashboard") && !item.disabled
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : item.disabled
                      ? "text-gray-400 bg-gray-50/50"
                      : "text-gray-600 hover:bg-white/80 hover:shadow-lg"
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 transition-transform duration-300 ${
                      !item.disabled && "group-hover:scale-110"
                    } ${
                      activeTab === (item.href.replace("#", "") || "dashboard") && !item.disabled
                        ? "text-white"
                        : item.disabled
                        ? "text-gray-400"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`} 
                  />
                  <div className="flex-1 text-left">
                    {item.name}
                    {item.comingSoon && (
                      <div className="text-xs text-gray-400 mt-0.5">Coming Soon</div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="px-4 py-5 border-t border-blue-100/50 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-semibold text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="text-xs text-gray-500">
                  Teacher
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 hover:text-red-600 transition-colors duration-300" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl shadow-sm border-b border-blue-100/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <Logo size="sm" className="h-6 w-6" />
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              EduAIssist
            </h1>
          </div>
          <div></div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        <main className="pt-20 lg:pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'questions' && <QuestionPapersContent />}
            {activeTab === 'upload-study' && <UploadStudyMaterialsContent />}
            </div>
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

  const { data: examsCount } = useQuery(['exams-count'], async () => {
    const res = await examsAPI.count()
    return res.data.total as number
  })

  const { data: materialsCount } = useQuery(['materials-count'], async () => {
    const res = await materialsAPI.count()
    return res.data.total as number
  })

  // Fetch recent activities data
  const { data: recentExams, isLoading: examsLoading } = useQuery(['recent-exams'], async () => {
    const res = await examsAPI.list({ page: 1, limit: 3 })
    return res.data.items || []
  }, {
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })

  const { data: recentMaterials, isLoading: materialsLoading } = useQuery(['recent-materials'], async () => {
    const res = await materialsAPI.listStudy({ page: 1, limit: 3 })
    return res.data.items || []
  }, {
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })

  const isLoadingActivities = examsLoading || materialsLoading

  // Combine and format recent activities
  const recentActivities = useMemo(() => {
    const activities: Array<{
      id: string
      type: 'exam' | 'material'
      title: string
      description: string
      timestamp: Date
      color: string
    }> = []

    // Add recent exams
    if (recentExams) {
      recentExams.forEach((exam: any, index: number) => {
        const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400']
        activities.push({
          id: `exam-${exam.id}`,
          type: 'exam',
          title: exam.title,
          description: `Generated "${exam.title}" question paper${exam.className ? ` for ${exam.className}` : ''}${exam.subjectName ? ` - ${exam.subjectName}` : ''}`,
          timestamp: new Date(exam.createdAt || exam.updatedAt || Date.now()),
          color: colors[index % colors.length]
        })
      })
    }

    // Add recent materials
    if (recentMaterials) {
      recentMaterials.forEach((material: any, index: number) => {
        const colors = ['bg-indigo-400', 'bg-pink-400', 'bg-teal-400']
        activities.push({
          id: `material-${material.id}`,
          type: 'material',
          title: material.originalName || 'Study Material',
          description: `Uploaded "${material.originalName || 'study material'}"${material.class ? ` for ${material.class}` : ''}${material.subject ? ` - ${material.subject}` : ''}`,
          timestamp: new Date(material.createdAt || material.uploadedAt || Date.now()),
          color: colors[index % colors.length]
        })
      })
    }

    // Sort by timestamp (most recent first) and take top 5
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
  }, [recentExams, recentMaterials])

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-3 lg:px-4 py-2 text-xs lg:text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <ChartBarIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
          <span className="text-gray-700">Teacher Control Center</span>
            </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl lg:text-4xl font-bold tracking-tight text-transparent">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-600">
          Create question papers, manage study materials, and track your teaching progress.
        </p>
        </div>
        
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Question Papers Count */}
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Question Papers</p>
              <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{examsCount ?? "..."}</p>
            </div>
          </div>
        </div>
        
        {/* Classes Count */}
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors duration-300">
              <ChartBarIcon className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Classes</p>
              <p className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{classesCount ?? "..."}</p>
            </div>
          </div>
        </div>
        
        {/* Uploads Count */}
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
              <DocumentArrowUpIcon className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Uploads</p>
              <p className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{materialsCount ?? "..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="space-y-4">
            {isLoadingActivities ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="flex items-start space-x-3 animate-pulse">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <span className="text-xs text-gray-400">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activities</p>
                  <p className="text-xs text-gray-400">Start creating question papers or uploading materials</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <BellAlertIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notice Board</h3>
          </div>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-50/50 rounded-r-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Coming Soon</span>
            </div>
            <p className="text-sm font-semibold text-indigo-800">
              🎯 <strong>Student Evaluations</strong> - AI-powered automated grading and evaluation system for answer sheets with personalized feedback.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-3 bg-gradient-to-r from-green-50 to-green-50/50 rounded-r-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Upcoming Feature</span>
            </div>
            <p className="text-sm font-semibold text-green-800">
              📝 <strong>Answer Sheet Management</strong> - Upload and organize student answer sheets for seamless evaluation workflow.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-3 bg-gradient-to-r from-purple-50 to-purple-50/50 rounded-r-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Enhancement</span>
            </div>
            <p className="text-sm font-semibold text-purple-800">
              📊 <strong>Advanced Analytics</strong> - Detailed performance insights and progress tracking for individual students and classes.
            </p>
          </div>
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
  
  // Delete functionality states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [examToDelete, setExamToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  // Delete mutation
  const deleteMutation = useMutation(async (examId: string) => {
    return await examsAPI.delete(examId)
  })

  // Delete handlers
  function handleDeleteClick(exam: any) {
    setExamToDelete(exam)
    setDeleteModalOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!examToDelete) return
    
    try {
      setDeleting(true)
      const t = toast.loading(`Deleting ${examToDelete.title}...`)
      
      await deleteMutation.mutateAsync(examToDelete.id)
      
      toast.success(`${examToDelete.title} deleted successfully!`, { id: t })
      setDeleteModalOpen(false)
      setExamToDelete(null)
      refetch() // Refresh the list
    } catch (error: any) {
      console.error('Failed to delete exam:', error)
      toast.error('Failed to delete question paper. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  function handleDeleteCancel() {
    setDeleteModalOpen(false)
    setExamToDelete(null)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-3 lg:px-4 py-2 text-xs lg:text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <DocumentTextIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
          <span className="text-gray-700">Question Paper Generator</span>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl lg:text-4xl font-bold tracking-tight text-transparent">
          Question Papers
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-600">
          Generate AI-powered question papers and manage your exam content.
        </p>
      </div>

      <QuestionGenerator examId="demo-exam-id" />

      <div className="mt-6 rounded-xl lg:rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100">
        <div className="px-4 sm:px-6 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Generated Papers</h2>
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by title" className="w-full md:w-80 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
        </div>
        <div className="px-4 sm:px-6 py-4 overflow-x-auto">
          <table className="min-w-full table-fixed border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">S. No.</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Title</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Class</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Subject</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Total Marks</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
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
                  <td className="border-b border-gray-100 px-3 py-2 text-center text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          window.open(`/questions/preview/${e.id}`, '_blank', 'noopener,noreferrer')
                        }}
                        title="View Question Paper"
                        aria-label="View Question Paper"
                        className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(e)}
                        title="Delete Question Paper"
                        aria-label="Delete Question Paper"
                        className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!exams || exams.items.length === 0) && (
                <tr>
                  <td className="border-b border-gray-100 px-3 py-6 text-sm text-gray-500" colSpan={6}>No question papers found.</td>
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

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <TrashIcon className="w-6 h-6 text-red-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Question Paper
          </h3>
          
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete <strong>"{examToDelete?.title}"</strong>? This action cannot be undone and will also delete all associated questions.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={handleDeleteCancel}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
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
    console.log('Starting upload with payload:', payload);
    console.log('User:', user);
    
    const form = new FormData()
    form.append('file', payload.file)
    form.append('teacherId', (user as any)?.id || '')
    const className = (classes || []).find((c: any) => c.id === payload.classId)?.name || payload.classId
    const subjectName = (subjects || []).find((s: any) => s.id === payload.subjectId)?.name || payload.subjectId
    form.append('class', className)
    form.append('subject', subjectName)
    form.append('vectorDbCollectionId', `col_${Date.now()}`)
    
    console.log('FormData contents:');
    console.log('- file:', payload.file.name, payload.file.size);
    console.log('- teacherId:', (user as any)?.id || '');
    console.log('- class:', className);
    console.log('- subject:', subjectName);
    console.log('- vectorDbCollectionId:', `col_${Date.now()}`);
    
    try {
      const result = await materialsAPI.uploadStudy(form, (e) => {
        if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
      });
      console.log('Upload successful:', result);
      return result.data;
    } catch (error: any) {
      console.error('Upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  })

  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Delete functionality states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  // Delete mutation
  const deleteMutation = useMutation(async (materialId: string) => {
    return await materialsAPI.deleteStudy(materialId)
  })

  // Subjects should be independent of class selection
  const allSubjects = useMemo(() => {
    const validSubjects = (subjects || []).filter((s: any) => s && s.id && s.name);
    console.log('Raw subjects:', subjects);
    console.log('Valid subjects after filtering:', validSubjects);
    return validSubjects;
  }, [subjects])
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('State changed - selectedClass:', selectedClass, 'selectedSubject:', selectedSubject, 'file:', file);
    console.log('Button should be enabled:', !!(selectedClass && selectedSubject && file && !submitting));
    console.log('Classes available:', (classes || []).map((c: any) => ({ id: c.id, name: c.name })));
    console.log('Subjects available:', (allSubjects || []).map((s: any) => ({ id: s.id, name: s.name })));
  }, [selectedClass, selectedSubject, file, submitting, classes, allSubjects])
  
  // Computed property for button state
  const isFormValid = useMemo(() => {
    const valid = !!(selectedClass && selectedSubject && file && !submitting);
    console.log('Form validation check:', { selectedClass, selectedSubject, file: !!file, submitting, valid });
    return valid;
  }, [selectedClass, selectedSubject, file, submitting])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Submit called with:', { selectedClass, selectedSubject, file: file?.name });
    
    if (!file || !selectedClass || !selectedSubject) {
      toast.error('Please select class, subject, and file')
      return
    }
    
    setSubmitting(true)
    try {
      const t = toast.loading('Uploading study material...')
      uploadMutation.mutate({ file, classId: selectedClass, subjectId: selectedSubject }, {
        onSuccess: (data) => {
          console.log('Upload mutation success:', data);
          toast.success('Study material uploaded successfully!', { id: t })
          setFile(null)
          setSelectedClass('')
          setSelectedSubject('')
          setModalOpen(false)
          // Refresh list to show the new row immediately
          refetch()
          setSubmitting(false)
        },
        onError: (error: any) => { 
          console.error('Upload mutation error:', error);
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload study material. Please try again.';
          toast.error(errorMessage, { id: t })
          setSubmitting(false)
        },
      })
    } catch (error: any) {
      console.error('Submit function error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload study material. Please try again.';
      toast.error(errorMessage)
      setSubmitting(false)
    }
  }

  const onDrop = (accepted: File[]) => {
    if (accepted?.[0]) {
      setFile(accepted[0])
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false, maxSize: 10 * 1024 * 1024 })

  // Delete handlers
  function handleDeleteClick(material: any) {
    setMaterialToDelete(material)
    setDeleteModalOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!materialToDelete) return
    
    try {
      setDeleting(true)
      const t = toast.loading(`Deleting ${materialToDelete.originalName}...`)
      
      await deleteMutation.mutateAsync(materialToDelete.id)
      
      toast.success(`${materialToDelete.originalName} deleted successfully!`, { id: t })
      setDeleteModalOpen(false)
      setMaterialToDelete(null)
      refetch() // Refresh the list
    } catch (error: any) {
      console.error('Failed to delete material:', error)
      toast.error('Failed to delete study material. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  function handleDeleteCancel() {
    setDeleteModalOpen(false)
    setMaterialToDelete(null)
  }

  // Handle proper file download
  const handleDownload = async (material: any) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading(`Preparing download for ${material.originalName}...`)
      
      // Use a more reliable approach for cloud storage files
      // First, try to fetch through our backend proxy (if available)
      try {
        const response = await api.get(`/materials/download/${material.id}`, {
          responseType: 'blob'
        })
        
        // Create blob URL and download
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = material.originalName || 'study-material.pdf'
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        window.URL.revokeObjectURL(url)
        
        toast.success(`Downloaded ${material.originalName}`, { id: loadingToast })
      } catch (backendError) {
        // Fallback: direct download attempt
        console.log('Backend download failed, trying direct download:', backendError)
        
        const link = document.createElement('a')
        link.href = material.pdfCloudUrl
        link.download = material.originalName || 'study-material.pdf'
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success(`Download initiated for ${material.originalName}`, { id: loadingToast })
      }
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Opening file in new tab instead.')
      
      // Final fallback: open in new tab
      window.open(material.pdfCloudUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-3 lg:px-4 py-2 text-xs lg:text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <DocumentArrowUpIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
          <span className="text-gray-700">Study Material Manager</span>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl lg:text-4xl font-bold tracking-tight text-transparent">
          Study Materials
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-600">
          Upload, organize, and manage educational content for your classes.
        </p>
      </div>

      <div className="mt-8 rounded-xl lg:rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100">
        <div className="px-4 sm:px-6 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 w-full md:w-auto">
            Upload New Material
          </button>
          <div className="w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by file name"
              className="w-full md:w-80 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">S. No.</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Class</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Subject</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">File name</th>
                <th className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {studyList?.items?.map((m: any, idx: number) => (
                <tr key={m.id}>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{(page - 1) * 10 + idx + 1}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{m.class ?? '-'}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{m.subject ?? '-'}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-700">{m.originalName ?? '-'}</td>
                  <td className="border-b border-gray-100 px-3 py-2 text-center text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={m.pdfCloudUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View Study Material"
                        aria-label="View Study Material"
                        className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDownload(m)}
                        title="Download Study Material"
                        aria-label="Download Study Material"
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(m)}
                        title="Delete Study Material"
                        aria-label="Delete Study Material"
                        className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
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
                <div className="flex gap-3">
                  <a 
                    href={m.pdfCloudUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    title="View Study Material"
                    className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </a>
                  <button 
                    onClick={() => handleDownload(m)}
                    title="Download Study Material"
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(m)}
                    title="Delete Study Material"
                    className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
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
      
      <Modal open={modalOpen} onClose={() => {
        console.log('Modal closing, resetting form');
        setModalOpen(false);
        // Don't reset values here as user might want to keep selections
      }} title="Upload New Study Material">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <Select
                value={selectedClass}
                onChange={(value) => {
                  console.log('Class selected:', value);
                  setSelectedClass(value);
                }}
                placeholder="Select Class"
                options={(classes || []).map((c: any) => ({ value: c.id, label: c.name }))}
              />
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Select
                value={selectedSubject}
                onChange={(value) => {
                  console.log('Subject selected:', value, 'Type:', typeof value);
                  console.log('Available subjects:', (allSubjects || []).map((s: any) => ({ value: s.id, label: s.name })));
                  setSelectedSubject(value);
                }}
                placeholder="Select Subject"
                options={(allSubjects || []).map((s: any) => ({ value: s.id, label: s.name }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              console.log('File selected:', selectedFile);
              setFile(selectedFile);
            }} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
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
                <div className="h-2 rounded bg-gradient-to-r from-blue-600 to-indigo-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="bg-white text-gray-700 font-semibold rounded-xl px-6 py-2 shadow-lg ring-1 ring-gray-200 hover:bg-gray-50 transition-all duration-300">
              Cancel
            </button>
            <button type="button" onClick={() => { setSelectedClass(''); setSelectedSubject(''); setFile(null); }} className="bg-white text-gray-700 font-semibold rounded-xl px-6 py-2 shadow-lg ring-1 ring-gray-200 hover:bg-gray-50 transition-all duration-300">
              Reset
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-2 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-[1.02]"
              onClick={() => {
                console.log('Debug - selectedClass:', selectedClass, 'selectedSubject:', selectedSubject, 'file:', file, 'submitting:', submitting);
                console.log('Debug - validation check:', !selectedClass || !selectedSubject || !file || submitting);
                console.log('Debug - isFormValid:', isFormValid);
              }}
            >
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <TrashIcon className="w-6 h-6 text-red-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Study Material
          </h3>
          
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete <strong>"{materialToDelete?.originalName}"</strong>? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={handleDeleteCancel}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

