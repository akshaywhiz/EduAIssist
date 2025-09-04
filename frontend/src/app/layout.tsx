import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'EduAIssist - AI-Powered Education Platform',
  description: 'Generate question papers, evaluate answers, and manage educational content with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
