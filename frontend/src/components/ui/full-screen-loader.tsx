'use client'

import { AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface FullScreenLoaderProps {
	message?: string
	className?: string
}

export default function FullScreenLoader({ message = 'Preparing your AI classroom…', className }: FullScreenLoaderProps) {
	return (
		<div className={clsx('min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-gray-100', className)}>
			{/* decorative gradient orbs */}
			<div className="pointer-events-none absolute inset-0 opacity-40">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-300 blur-3xl" />
				<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200 to-purple-300 blur-3xl" />
			</div>

			{/* center loader */}
			<div className="relative z-10 flex min-h-screen items-center justify-center px-6">
				<div className="flex flex-col items-center">
					{/* ring */}
					<div className="relative h-24 w-24">
						<div className="absolute inset-0 rounded-full border-4 border-blue-100" />
						<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '1.2s' }} />
						{/* orbiting sparkles */}
						<SparklesIcon className="absolute -top-2 left-1/2 -ml-3 h-6 w-6 text-indigo-500 animate-spin" style={{ animationDuration: '2.2s' }} />
						<SparklesIcon className="absolute -bottom-2 left-1/2 -ml-3 h-6 w-6 text-cyan-500 animate-spin" style={{ animationDuration: '3s' }} />
						{/* center icon */}
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-blue-100">
								<AcademicCapIcon className="h-8 w-8 text-blue-600" />
							</div>
						</div>
					</div>

					{/* title */}
					<h1 className="mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent">
						EduAIssist
					</h1>
					<p className="mt-2 text-sm text-gray-600">{message}</p>

					{/* progress shimmer */}
					<div className="mt-5 h-2 w-64 overflow-hidden rounded-full bg-gray-200">
						<div className="h-full w-1/3 animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400" />
					</div>
				</div>
			</div>

			<style jsx global>{`
				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(300%); }
				}
			`}</style>
		</div>
	)
}


