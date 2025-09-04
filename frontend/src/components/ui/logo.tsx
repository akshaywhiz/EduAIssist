'use client'

import React from 'react'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFallback?: boolean
}

export function Logo({ className = '', size = 'md', showFallback = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  const fallbackSizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9'
  }

  return (
    <div className={`relative ${className}`}>
      <img 
        src="/logo.svg" 
        alt="EduAIssist Logo" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          if (showFallback) {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.classList.remove('hidden');
            }
          }
        }}
      />
      {showFallback && (
        <AcademicCapIcon className={`${fallbackSizeClasses[size]} text-blue-600 hidden`} />
      )}
    </div>
  )
}
