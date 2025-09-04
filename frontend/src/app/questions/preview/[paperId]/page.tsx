'use client'

import { QuestionPaperPreview } from '@/components/teacher/question-paper-preview'

export default function PreviewPage({ params }: { params: { paperId: string } }) {
  const paperId = params.paperId

  return (
    <div className="min-h-screen bg-gray-50">
      <QuestionPaperPreview examId={paperId} />
    </div>
  )
}


