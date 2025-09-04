'use client'

import { useAuth } from '@/lib/auth-context'
import { LoginButton } from '@/components/auth/login-button'
import { AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { TeacherDashboard } from '@/components/teacher/teacher-dashboard'
import FullScreenLoader from '@/components/ui/full-screen-loader'
import { EducationalScribbles } from '@/components/ui/educational-scribbles'
import { Logo } from '@/components/ui/logo'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50 to-gray-100">
        {/* decorative orbs for brand consistency */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-300 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200 to-purple-300 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        {/* Educational Scribbles */}
        <EducationalScribbles />

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:py-20">
          {/* Brand side */}
          <div className="animate-slide-in-up">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur animate-fade-in-scale" style={{ animationDelay: '100ms' }}>
              <SparklesIcon className="h-5 w-5 text-indigo-600" />
              <span className="text-gray-700">AI for modern classrooms</span>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-blue-100 animate-gentle-pulse">
                <Logo size="md" />
              </div>
              <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                EduAIssist
              </h1>
            </div>
            <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
              Generate question papers, evaluate handwritten answers with AI, and manage classes & exams — all in one beautiful workspace.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> AI Question Generation</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> AI-assisted Evaluation</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Class & Exam Management</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> Report Cards & Analytics</li>
            </ul>
          </div>

          {/* Sign-in card */}
          <div className="relative animate-slide-in-up" style={{ animationDelay: '500ms' }}>
            <div className="relative mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-blue-100 transform hover:scale-[1.02] transition-transform duration-300">
              <h2 className="text-center text-xl font-semibold text-gray-900 animate-fade-in-scale" style={{ animationDelay: '600ms' }}>Sign in to continue</h2>
              <p className="mt-1 text-center text-sm text-gray-500 animate-fade-in-scale" style={{ animationDelay: '700ms' }}>Use your Google account to access your personalized learning dashboard</p>
              <div className="mt-8">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'teacher':
      return <TeacherDashboard />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to EduAIssist
            </h1>
            <p className="text-gray-600">
              Your account is being set up. Please contact an administrator.
            </p>
          </div>
        </div>
      )
  }
}
