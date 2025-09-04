'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldExclamationIcon, ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    // Clear any existing auth tokens
    logout()
  }, [logout])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-red-200 to-pink-200 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-tl from-orange-200 to-yellow-200 opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-red-100 to-orange-100 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-red-300 opacity-60 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Main card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-red-100 backdrop-blur-sm">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 opacity-50" />
            <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-gradient-to-tr from-orange-100 to-yellow-100 opacity-50" />
            
            <div className="relative text-center">
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100">
                <ShieldExclamationIcon className="h-10 w-10 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                Access Restricted
              </h1>

              {/* Message */}
              <p className="mb-6 text-gray-600 leading-relaxed">
                Sorry, your account is not authorized to access EduAIssist. 
                This platform is only available to registered teachers and administrators.
              </p>

              {/* Additional info */}
              <div className="mb-8 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 p-4 border border-red-100">
                <div className="flex items-center gap-3">
                  <AcademicCapIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Need Access?</p>
                    <p className="text-xs text-gray-600">
                      Contact your school administrator to request access to the platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 text-white font-medium shadow-lg transition-all duration-200 hover:from-red-700 hover:to-orange-700 hover:shadow-xl active:scale-95"
                >
                  <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Return to Login
                </button>
                
                <button
                  onClick={() => window.open('mailto:admin@eduaissist.com?subject=Access Request', '_blank')}
                  className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                >
                  Contact Administrator
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 EduAIssist. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
