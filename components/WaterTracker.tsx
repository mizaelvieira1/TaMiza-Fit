'use client'
import { useState } from 'react'
import { Droplets } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { getLocalDate } from '@/lib/dateUtils'

const ML_PER_GLASS = 250

interface WaterTrackerProps {
  glasses: number
  goal: number
  logId: string | null
  onUpdate: (glasses: number) => void
  onUpdateLogId: (id: string) => void
  /** Data a registrar (YYYY-MM-DD). Padrão: hoje */
  loggedDate?: string
}

export function WaterTracker({ glasses, goal, logId, onUpdate, onUpdateLogId, loggedDate }: WaterTrackerProps) {
  const { profileId } = useProfileStore()
  const [loading, setLoading] = useState(false)
  const targetDate = loggedDate ?? getLocalDate()

  const totalMl = glasses * ML_PER_GLASS
  const goalMl  = goal   * ML_PER_GLASS

  async function addGlass() {
    if (glasses >= goal || loading || !profileId) return
    setLoading(true)
    const newCount = glasses + 1

    if (logId) {
      await supabase
        .from('water_logs')
        .update({ glasses: newCount, updated_at: new Date().toISOString() })
        .eq('id', logId)
    } else {
      // Primeiro copo do dia: INSERT e captura o ID retornado
      const { data } = await supabase
        .from('water_logs')
        .insert({ profile_id: profileId, logged_date: targetDate, glasses: newCount })
        .select()
        .single()
      if (data?.id) onUpdateLogId(data.id)
    }
    onUpdate(newCount)
    setLoading(false)
  }

  const pct = Math.round((glasses / goal) * 100)

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-blue-400" />
          <span className="text-sm font-medium text-white">Água</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-white">{glasses}/{goal}</span>
          <span className="text-xs text-[#888]"> copos</span>
          <span className="text-xs text-blue-400 ml-2 font-medium">{totalMl} ml</span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 bg-[#2A2A2A] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Gotas */}
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

      {/* Botão */}
      <button
        onClick={addGlass}
        disabled={glasses >= goal || loading}
        className="w-full py-2 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 disabled:opacity-40 active:scale-95 transition-transform"
      >
        {glasses >= goal ? `✓ Meta atingida! ${goalMl} ml` : `+ Adicionar copo (+${ML_PER_GLASS} ml)`}
      </button>
    </div>
  )
}
