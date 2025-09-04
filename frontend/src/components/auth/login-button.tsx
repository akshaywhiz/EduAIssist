'use client'

import React, { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function LoginButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = () => {
    setLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000'
    window.location.href = `${backendUrl}/auth/google`
  }


  return (
    <div className="space-y-8 animate-fade-in-scale">
      {/* Google Login Button with Enhanced Animation */}
      <div className="animate-slide-in-up">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="login-button w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.02] hover:-translate-y-1"
        >
          {loading ? (
            <div className="animate-spin">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 animate-gentle-pulse" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
            Continue with Google
          </span>
        </button>
      </div>

      {/* Welcome Message with Enhanced Animation */}
      <div className="text-center animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="inline-block">
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            Welcome to EduAIssist! Sign in with your Google account to access your personalized learning dashboard.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="flex justify-center">
        <div className="flex space-x-2 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
