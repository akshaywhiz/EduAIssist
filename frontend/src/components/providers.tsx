'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Recover from occasional dev chunk timeouts by reloading once */}
        <ChunkErrorRecovery />
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function ChunkErrorRecovery() {
  useEffect(() => {
    const handler = (ev: any) => {
      const msg = String(ev?.message || ev?.reason || '')
      const shouldReload = /ChunkLoadError|Loading chunk/i.test(msg)
      if (shouldReload && typeof window !== 'undefined') {
        const key = 'chunk_reload_once'
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1')
          // force a hard reload to fetch the latest manifest
          window.location.reload()
        }
      }
    }
    window.addEventListener('error', handler)
    window.addEventListener('unhandledrejection', handler as any)
    return () => {
      window.removeEventListener('error', handler)
      window.removeEventListener('unhandledrejection', handler as any)
    }
  }, [])
  return null
}
