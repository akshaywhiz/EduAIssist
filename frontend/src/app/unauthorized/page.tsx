'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'
import { Logo } from '@/components/ui/logo'

// Custom SVG illustration for unauthorized access
function UnauthorizedIllustration() {
  return (
    <svg
      className="w-24 h-24 sm:w-28 sm:h-28 mx-auto"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="90" fill="url(#bg-gradient)" opacity="0.1" />
      
      {/* Lock body */}
      <rect
        x="65"
        y="90"
        width="70"
        height="80"
        rx="8"
        fill="url(#lock-gradient)"
        stroke="url(#lock-stroke)"
        strokeWidth="2"
      />
      
      {/* Lock shackle */}
      <path
        d="M75 90 L75 70 Q75 45 100 45 Q125 45 125 70 L125 90"
        stroke="url(#lock-stroke)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Warning triangle */}
      <path
        d="M100 100 L110 125 L90 125 Z"
        fill="#ef4444"
      />
      
      {/* Exclamation mark */}
      <circle cx="100" cy="110" r="2" fill="white" />
      <rect x="98" y="115" width="4" height="8" rx="2" fill="white" />
      
      {/* Floating shield elements */}
      <circle cx="60" cy="40" r="8" fill="url(#accent-gradient)" opacity="0.6" className="animate-float" />
      <circle cx="140" cy="50" r="6" fill="url(#accent-gradient)" opacity="0.4" className="animate-float" style={{ animationDelay: '1s' }} />
      <circle cx="160" cy="120" r="5" fill="url(#accent-gradient)" opacity="0.5" className="animate-float" style={{ animationDelay: '2s' }} />
      <circle cx="40" cy="140" r="7" fill="url(#accent-gradient)" opacity="0.3" className="animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="lock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="lock-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function UnauthorizedPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    // Clear any existing auth tokens silently without toasts or redirects
    logout(false, false)
  }, [logout])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50 to-gray-100 flex flex-col">
      {/* Decorative orbs matching portal theme */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-300 blur-3xl animate-gentle-pulse" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 blur-3xl animate-gentle-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-200 to-purple-300 blur-3xl animate-gentle-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Educational themed floating elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Book */}
        <div className="absolute top-24 left-8 sm:top-20 sm:left-20 animate-float" style={{ animationDelay: '0.5s' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" className="text-blue-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        {/* Graduation cap */}
        <div className="absolute top-36 right-8 sm:top-32 sm:right-32 animate-float" style={{ animationDelay: '1.2s' }}>
          <svg width="28" height="28" fill="none" stroke="currentColor" className="text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        </div>
        
        {/* Pencil */}
        <div className="absolute bottom-32 left-8 sm:bottom-40 sm:left-16 animate-float" style={{ animationDelay: '2s' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" className="text-purple-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        
        {/* Calculator */}
        <div className="absolute bottom-24 right-8 sm:bottom-20 sm:right-20 animate-float" style={{ animationDelay: '1.8s' }}>
          <svg width="26" height="26" fill="none" stroke="currentColor" className="text-cyan-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008V18H8.25v-.75zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007V18h-.007v-.75zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008V18h-.008v-.75zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
          </svg>
        </div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 px-4 pt-8 sm:pt-12 pb-4">
        <div className="flex justify-center animate-slide-in-up">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white/90 shadow-lg ring-1 ring-blue-100 backdrop-blur-sm">
              <Logo size="md" className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h2 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl sm:text-3xl font-bold tracking-tight text-transparent">
              EduAIssist
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          {/* Custom unauthorized illustration */}
          <div className="animate-fade-in-scale mb-6" style={{ animationDelay: '0.2s' }}>
            <UnauthorizedIllustration />
          </div>

          {/* Title */}
          <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-3xl sm:text-4xl font-bold tracking-tight text-transparent animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            Access Restricted
          </h1>

          {/* Message */}
          <p className="mb-8 text-gray-600 leading-relaxed text-base sm:text-lg animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            Your account has been deactivated or you are not authorized to access 
            <span className="font-medium text-gray-800"> EduAIssist</span>. 
            Please contact your administrator for assistance.
          </p>

          {/* Additional info */}
          <div className="mb-8 rounded-xl bg-white/90 backdrop-blur-sm p-5 border border-blue-100 shadow-sm ring-1 ring-blue-50 animate-fade-in-scale" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0">
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 mb-1">Account Deactivated?</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  If your account has been deactivated, contact your administrator to reactivate it. 
                  If you believe this is an error, please reach out for assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => router.push('/')}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-medium shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Return to Login
            </button>
            
            <button
              onClick={() => window.open('mailto:admin@eduaissist.com?subject=Access Request - EduAIssist Platform', '_blank')}
              className="w-full rounded-xl border border-gray-200 bg-white/90 px-6 py-3 text-gray-700 font-medium transition-all duration-300 hover:bg-white hover:border-gray-300 hover:shadow-md transform hover:scale-[1.01] backdrop-blur-sm"
            >
              Contact Administrator
            </button>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="relative z-10 px-4 pb-8 sm:pb-12 pt-4">
        <div className="text-center animate-fade-in-scale" style={{ animationDelay: '0.7s' }}>
          <p className="text-xs sm:text-sm text-gray-500">
            © 2024 EduAIssist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
