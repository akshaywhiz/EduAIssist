'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function LoginButton() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token)
    }
  }, [searchParams, login])

  const handleGoogleLogin = () => {
    setLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000'
    window.location.href = `${backendUrl}/auth/google`
  }

  const handleMicrosoftLogin = () => {
    setLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000'
    window.location.href = `${backendUrl}/auth/microsoft`
  }

  const handleTestLogin = async (userType: 'admin' | 'teacher') => {
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000'
      const response = await fetch(`${backendUrl}/auth/test-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }),
      })
      
      const result = await response.json()
      
      if (result.access_token) {
        await login(result.access_token)
      }
    } catch (error) {
      console.error('Test login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnauthorizedTest = async () => {
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000'
      const response = await fetch(`${backendUrl}/auth/test-unauthorized-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'unauthorized@example.com' }),
      })
      
      if (!response.ok) {
        // This should trigger the unauthorized flow
        window.location.href = '/unauthorized'
        return
      }
      
      const result = await response.json()
      if (result.access_token) {
        await login(result.access_token)
      }
    } catch (error) {
      console.error('Unauthorized test failed:', error)
      // Redirect to unauthorized page on error
      window.location.href = '/unauthorized'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>

      <button
        onClick={handleMicrosoftLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#f25022" d="M11.4 11.4H.6V.6h10.8z" />
            <path fill="#00a4ef" d="M23.4 11.4H12.6V.6h10.8z" />
            <path fill="#7fba00" d="M11.4 23.4H.6V12.6h10.8z" />
            <path fill="#ffb900" d="M23.4 23.4H12.6V12.6h10.8z" />
          </svg>
        )}
        <span className="text-gray-700 font-medium">Continue with Microsoft</span>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleTestLogin('admin')}
          disabled={loading}
          className="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-700 text-sm font-medium">Admin Demo</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleTestLogin('teacher')}
          disabled={loading}
          className="flex items-center justify-center px-4 py-3 border border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-700 text-sm font-medium">Teacher Demo</span>
            </>
          )}
        </button>
      </div>

      {/* Test unauthorized user flow */}
      <div className="mt-4">
        <button
          onClick={handleUnauthorizedTest}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm font-medium">Test Unauthorized User</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
