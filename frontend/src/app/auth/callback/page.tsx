'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import FullScreenLoader from '@/components/ui/full-screen-loader'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const callbackHandled = useRef(false)

  useEffect(() => {
    // Prevent duplicate callback handling
    if (callbackHandled.current) {
      return
    }

    const handleCallback = async () => {
      callbackHandled.current = true
      
      const token = searchParams.get('token')
      const error = searchParams.get('error')
      
      if (error === 'unauthorized') {
        router.push('/unauthorized')
        return
      }
      
      if (token) {
        try {
          await login(token)
          // Clear the URL parameters to prevent re-execution
          window.history.replaceState({}, '', '/')
          router.push('/')
        } catch (error: any) {
          console.error('Auth callback error:', error)
          // Check if it's an unauthorized user error
          if (error.response?.status === 401 || error.message?.includes('unauthorized')) {
            router.push('/unauthorized')
          } else {
            router.push('/?error=auth_failed')
          }
        }
      } else {
        router.push('/?error=no_token')
      }
    }

    handleCallback()
  }, [searchParams, login, router])

  return <FullScreenLoader message="Completing authentication…" />
}
