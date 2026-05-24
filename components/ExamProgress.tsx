'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Edit3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'

interface Exam {
  id: string
  exam_name: string
  value: number
  unit: string
  goal: number
  logged_date: string
}

interface ExamProgressProps {
  exams: Exam[]
  onUpdate: () => void
}

function getExamProgress(value: number, goal: number, examName: string): number {
  const higherIsBetter = examName.includes('HDL') || examName.includes('Vitamina')
  if (higherIsBetter) {
    return Math.min(100, Math.round((value / goal) * 100))
  }
  if (value <= goal) return 100
  const worst = value * 1.5
  return Math.max(0, Math.round(((worst - value) / (worst - goal)) * 100))
}

export function ExamProgress({ exams, onUpdate }: ExamProgressProps) {
  const { profileId } = useProfileStore()
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [newValue, setNewValue] = useState('')
  const [saving, setSaving] = useState(false)

  async function saveExam() {
    if (!editingExam || !profileId || !newValue) return
    setSaving(true)
    await supabase.from('exam_results').insert({
      profile_id: profileId,
      exam_name: editingExam.exam_name,
      value: parseFloat(newValue),
      unit: editingExam.unit,
      goal: editingExam.goal,
      logged_date: new Date().toISOString().split('T')[0],
    })
    setSaving(false)
    setEditingExam(null)
    setNewValue('')
    onUpdate()
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
      <h3 className="text-base font-bold text-white mb-4">Metas dos Exames</h3>
      <div className="space-y-4">
        {exams.map((exam) => {
          const pct = getExamProgress(exam.value, exam.goal, exam.exam_name)
          const higherIsBetter = exam.exam_name.includes('HDL') || exam.exam_name.includes('Vitamina')
          const isGood = higherIsBetter ? exam.value >= exam.goal : exam.value <= exam.goal
          const barColor = isGood ? '#27AE60' : pct > 60 ? '#E67E22' : '#E74C3C'

          return (
            <div key={exam.id}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{exam.exam_name}</span>
                  <button
                    onClick={() => { setEditingExam(exam); setNewValue(String(exam.value)) }}
                    className="text-[#888] hover:text-white transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: isGood ? '#27AE60' : '#E74C3C' }}>
                    {exam.value}{exam.unit}
                  </span>
                  <span className="text-xs text-[#888] ml-1">
                    meta: {higherIsBetter ? '>' : '<'}{exam.goal}{exam.unit}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {editingExam && (
        <div className="fixed inset-0 bg-black/80 flex items-end z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-5 w-full border border-[#2A2A2A]">
            <h4 className="text-white font-bold mb-1">Atualizar {editingExam.exam_name}</h4>
            <p className="text-xs text-[#888] mb-4">Valor atual: {editingExam.value}{editingExam.unit}</p>
            <input
              type="number"
              step="0.01"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Novo valor"
              className="w-full bg-[#2A2A2A] rounded-xl px-4 py-3 text-white text-lg font-bold mb-4 outline-none border border-[#3A3A3A] focus:border-white"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setEditingExam(null); setNewValue('') }}
                className="flex-1 py-3 rounded-xl bg-[#2A2A2A] text-white font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={saveExam}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
