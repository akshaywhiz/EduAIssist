'use client'

import { useMemo, useState } from 'react'
import { classesAPI, materialsAPI, questionsAPI, subjectsAPI } from '@/lib/api'
import { useQuery } from 'react-query'
import { Modal } from '@/components/ui/modal'
import toast from 'react-hot-toast'

export function QuestionGenerator({ examId }: { examId: string }) {
  const [maxMarks, setMaxMarks] = useState(100)
  const [mcqWeightage, setMcqWeightage] = useState(40)
  const [shortWeightage, setShortWeightage] = useState(40)
  const [longWeightage, setLongWeightage] = useState(20)
  
  // Marks per question for each type
  const [mcqMarksPerQuestion, setMcqMarksPerQuestion] = useState(1)
  const [shortMarksPerQuestion, setShortMarksPerQuestion] = useState(5)
  const [longMarksPerQuestion, setLongMarksPerQuestion] = useState(10)
  
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(60)
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [generated, setGenerated] = useState<any[]>([])

  const { data: classes } = useQuery(['qg-classes'], async () => (await classesAPI.getAll()).data)
  const { data: subjects } = useQuery(['qg-subjects'], async () => (await subjectsAPI.getAll()).data)
  const { data: materials } = useQuery(['qg-materials'], async () => (await materialsAPI.listStudy({ page: 1, limit: 50 })).data)

  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [materialId, setMaterialId] = useState('')

  const className = useMemo(() => (classes || []).find((c: any) => c.id === classId)?.name || '', [classes, classId])
  const subjectName = useMemo(() => (subjects || []).find((s: any) => s.id === subjectId)?.name || '', [subjects, subjectId])
  const selectedMaterial = useMemo(() => (materials?.items || []).find((m: any) => m.id === materialId) || null, [materials, materialId])
  const materialName = selectedMaterial?.originalName || ''

  // Calculate number of questions for each type
  const questionCounts = useMemo(() => {
    const mcqCount = Math.round((maxMarks * mcqWeightage / 100) / mcqMarksPerQuestion)
    const shortCount = Math.round((maxMarks * shortWeightage / 100) / shortMarksPerQuestion)
    const longCount = Math.round((maxMarks * longWeightage / 100) / longMarksPerQuestion)
    
    return { mcqCount, shortCount, longCount }
  }, [maxMarks, mcqWeightage, shortWeightage, longWeightage, mcqMarksPerQuestion, shortMarksPerQuestion, longMarksPerQuestion])

  // Calculate total marks to verify distribution
  const totalCalculatedMarks = useMemo(() => {
    return (questionCounts.mcqCount * mcqMarksPerQuestion) + 
           (questionCounts.shortCount * shortMarksPerQuestion) + 
           (questionCounts.longCount * longMarksPerQuestion)
  }, [questionCounts, mcqMarksPerQuestion, shortMarksPerQuestion, longMarksPerQuestion])

  // Validation for form completion
  const isFormValid = useMemo(() => {
    const totalWeightage = mcqWeightage + shortWeightage + longWeightage
    const hasRequiredFields = classId && subjectId && materialId && title.trim() && maxMarks > 0 && duration > 0
    const hasValidWeightage = totalWeightage === 100
    const hasValidMarks = Math.abs(totalCalculatedMarks - maxMarks) <= 2
    const hasValidMarksPerQuestion = mcqMarksPerQuestion > 0 && shortMarksPerQuestion > 0 && longMarksPerQuestion > 0
    
    return hasRequiredFields && hasValidWeightage && hasValidMarks && hasValidMarksPerQuestion
  }, [classId, subjectId, materialId, title, maxMarks, duration, mcqWeightage, shortWeightage, longWeightage, totalCalculatedMarks, mcqMarksPerQuestion, shortMarksPerQuestion, longMarksPerQuestion])

  async function onGenerate() {
    const totalWeightage = mcqWeightage + shortWeightage + longWeightage
    if (totalWeightage !== 100) {
      toast.error('Weightages must total 100%')
      return
    }

    if (!materialId) {
      toast.error('Please select a study material/book')
      return
    }

    if (!selectedMaterial?.vectorDbCollectionId) {
      toast.error('Selected material does not have a vector database collection')
      return
    }

    // Validate that marks calculation is reasonable
    if (Math.abs(totalCalculatedMarks - maxMarks) > 2) {
      toast.error(`Marks distribution results in ${totalCalculatedMarks} marks instead of ${maxMarks}. Please adjust weightages or marks per question.`)
      return
    }

    const derivedContext = [className && `Class: ${className}`, subjectName && `Subject: ${subjectName}`, materialName && `Study material: ${materialName}`]
      .filter(Boolean)
      .join('\n')

    setLoading(true)
    try {
      // Debug logging
      console.log('[QuestionGenerator] Sending request with data:', {
        maxMarks,
        weightage: { mcq: mcqWeightage, short: shortWeightage, long: longWeightage },
        marksPerQuestion: {
          mcq: mcqMarksPerQuestion,
          short: shortMarksPerQuestion,
          long: longMarksPerQuestion
        },
        questionCounts,
        materialId,
        vectorCollectionID: selectedMaterial?.vectorDbCollectionId,
        selectedMaterial
      });

      const res = await questionsAPI.generate(examId, {
        maxMarks,
        weightage: { mcq: mcqWeightage, short: shortWeightage, long: longWeightage },
        marksPerQuestion: {
          mcq: mcqMarksPerQuestion,
          short: shortMarksPerQuestion,
          long: longMarksPerQuestion
        },
        questionCounts,
        context: derivedContext,
        classId,
        subjectId,
        title: title || `${subjectName} Question Paper`,
        duration,
        materialId,
        vectorCollectionID: selectedMaterial?.vectorDbCollectionId,
      })
      toast.success('Questions generated')
      const loadId = (res.data?.examId || res.data?.[0]?.examId || examId) as string
      // open preview page in new tab
      window.open(`/questions/preview/${loadId}`, '_blank', 'noopener,noreferrer')
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to generate questions'
      console.error('[QuestionGenerator] Error generating questions:', e);
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Question Paper</h2>
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="">Select Class</option>
            {(classes || []).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="">Select Subject</option>
            {(subjects || []).map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Study Material/Book <span className="text-red-500">*</span>
          </label>
          <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="">Select Material</option>
            {(materials?.items || []).map((m: any) => (
              <option key={m.id} value={m.id}>{m.originalName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Paper Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Physics Unit Test" className="input w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value || 0))} className="input w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks</label>
          <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value || 0))} className="input w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
      </div>

      {/* Question Type Configuration */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Question Type Configuration</h3>
        
        {/* MCQ Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MCQ Weightage (%)</label>
            <input type="number" value={mcqWeightage} onChange={(e) => setMcqWeightage(Number(e.target.value || 0))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks per MCQ</label>
            <input type="number" value={mcqMarksPerQuestion} onChange={(e) => setMcqMarksPerQuestion(Number(e.target.value || 0))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Questions: <span className="font-semibold">{questionCounts.mcqCount}</span>
            </span>
          </div>
        </div>

        {/* Short Answer Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-green-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Answer Weightage (%)</label>
            <input type="number" value={shortWeightage} onChange={(e) => setShortWeightage(Number(e.target.value || 0))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks per Short Answer</label>
            <input type="number" value={shortMarksPerQuestion} onChange={(e) => setShortMarksPerQuestion(Number(e.target.value || 0))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Questions: <span className="font-semibold">{questionCounts.shortCount}</span>
            </span>
          </div>
        </div>

        {/* Long Answer Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-purple-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long Answer Weightage (%)</label>
            <input type="number" value={longWeightage} onChange={(e) => setLongWeightage(Number(e.target.value || 0))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks per Long Answer</label>
            <input type="number" value={longMarksPerQuestion} onChange={(e) => setLongMarksPerQuestion(Number(e.target.value || 0))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Questions: <span className="font-semibold">{questionCounts.longCount}</span>
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${mcqWeightage + shortWeightage + longWeightage === 100 ? 'text-green-700' : 'text-red-700'}`}>
              Total Weightage: {mcqWeightage + shortWeightage + longWeightage}%
            </span>
            <span className={`text-sm font-medium ${Math.abs(totalCalculatedMarks - maxMarks) <= 2 ? 'text-green-700' : 'text-orange-700'}`}>
              Calculated Marks: {totalCalculatedMarks}/{maxMarks}
            </span>
          </div>
          {Math.abs(totalCalculatedMarks - maxMarks) > 2 && (
            <p className="text-sm text-orange-600 mt-2">
              ⚠️ Marks distribution may not match exactly. Consider adjusting weightages or marks per question.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button 
          onClick={onGenerate} 
          disabled={loading || !isFormValid} 
          className={`btn-primary ${!isFormValid && !loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!isFormValid ? 'Please fill all required fields and ensure weightages total 100%' : ''}
        >
          {loading ? 'Generating…' : 'Generate Question Paper'}
        </button>
      </div>
    </div>
    <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview & Review" maxWidthClass="max-w-3xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {generated.map((q: any, idx: number) => (
          <div key={q.id} className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-800"><span className="font-medium">{idx + 1}. ({q.marks} marks)</span> {q.questionText}</p>
            </div>
            {Array.isArray(q.options) && q.options.length > 0 && (
              <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
                {q.options.map((o: string, i: number) => (<li key={i}>{o}</li>))}
              </ul>
            )}
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary" onClick={async () => {
                const r = await questionsAPI.regenerate(q.id)
                setGenerated((prev) => prev.map((it) => it.id === q.id ? r.data : it))
              }}>Regenerate</button>
              <button className="btn-secondary" onClick={async () => {
                const newText = prompt('Edit question text', q.questionText)
                if (newText === null) return
                const r = await questionsAPI.update(q.id, { questionText: newText })
                setGenerated((prev) => prev.map((it) => it.id === q.id ? r.data : it))
              }}>Edit</button>
              <button className="btn-primary" onClick={() => { /* approve no-op */ }}>Approve</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="btn-primary" onClick={() => setPreviewOpen(false)}>Done</button>
      </div>
    </Modal>
    </>
  )
}


