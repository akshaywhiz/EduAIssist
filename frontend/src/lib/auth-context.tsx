'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from './api'
import { User } from '@/types/user'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const loginInProgress = useRef(false)

  const login = async (token: string) => {
    // Prevent duplicate login attempts
    if (loginInProgress.current) {
      return
    }
    
    loginInProgress.current = true
    
    try {
      // Dismiss any existing toasts to prevent duplicates
      toast.dismiss()
      
      Cookies.set('token', token, { expires: 7 })
      const response = await api.get('/auth/profile')
      setUser(response.data)
      toast.success('Login successful!')
    } catch (error: any) {
      console.error('Login error:', error)
      // Check if user is unauthorized
      if (error.response?.status === 401 || error.message?.includes('unauthorized')) {
        toast.error('Access denied. You are not authorized to use this platform.')
        logout()
        // Redirect to unauthorized page
        window.location.href = '/unauthorized'
      } else {
        toast.error('Login failed')
        logout()
      }
    } finally {
      loginInProgress.current = false
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    router.push('/')
    toast.success('Logged out successfully')
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token')
      if (token) {
        try {
          const response = await api.get('/auth/profile')
          setUser(response.data)
        } catch (error) {
          console.error('Auth check failed:', error)
          Cookies.remove('token')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
