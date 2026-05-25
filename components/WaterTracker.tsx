'use client'
import { useState } from 'react'
import { Droplets } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { getLocalDate } from '@/lib/dateUtils'

interface WaterTrackerProps {
  glasses: number
  goal: number
  logId: string | null
  onUpdate: (glasses: number) => void
  /** Data a registrar (YYYY-MM-DD). Padrão: hoje */
  loggedDate?: string
}

export function WaterTracker({ glasses, goal, logId, onUpdate, loggedDate }: WaterTrackerProps) {
  const { profileId } = useProfileStore()
  const [loading, setLoading] = useState(false)
  const targetDate = loggedDate ?? getLocalDate()

  async function addGlass() {
    if (glasses >= goal || loading || !profileId) return
    setLoading(true)
    const newCount = glasses + 1

    if (logId) {
      await supabase.from('water_logs').update({ glasses: newCount, updated_at: new Date().toISOString() }).eq('id', logId)
    } else {
      await supabase.from('water_logs').insert({ profile_id: profileId, logged_date: targetDate, glasses: newCount })
    }
    onUpdate(newCount)
    setLoading(false)
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-blue-400" />
          <span className="text-sm font-medium text-white">Água</span>
        </div>
        <span className="text-sm text-[#888]">
          <span className="font-bold text-white">{glasses}</span>/{goal} copos
        </span>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Array.from({ length: goal }).map((_, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${
              i < glasses ? 'bg-blue-500' : 'bg-[#2A2A2A]'
            }`}
          >
            💧
          </div>
        ))}
      </div>
      <button
        onClick={addGlass}
        disabled={glasses >= goal || loading}
        className="w-full py-2 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 disabled:opacity-40 active:scale-95 transition-transform"
      >
        + Adicionar copo
      </button>
    </div>
  )
}
