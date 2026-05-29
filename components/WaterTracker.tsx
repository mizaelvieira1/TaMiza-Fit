'use client'
import { useState, useEffect } from 'react'
import { Droplets, Pencil, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { getLocalDate } from '@/lib/dateUtils'

const DEFAULT_ML = 250
const ML_KEY = 'water_ml_per_glass'

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
  const [mlPerGlass, setMlPerGlass] = useState(DEFAULT_ML)
  const [editing, setEditing] = useState(false)
  const [mlInput, setMlInput] = useState(String(DEFAULT_ML))
  const targetDate = loggedDate ?? getLocalDate()

  useEffect(() => {
    const saved = localStorage.getItem(ML_KEY)
    if (saved) {
      const val = parseInt(saved)
      if (!isNaN(val) && val > 0) {
        setMlPerGlass(val)
        setMlInput(String(val))
      }
    }
  }, [])

  function saveMl() {
    const val = parseInt(mlInput)
    if (!isNaN(val) && val > 0) {
      setMlPerGlass(val)
      localStorage.setItem(ML_KEY, String(val))
    } else {
      setMlInput(String(mlPerGlass))
    }
    setEditing(false)
  }

  async function updateGlasses(newCount: number) {
    if (newCount < 0 || newCount > goal || loading) return

    // Modo local (sem banco): só atualiza estado
    if (!profileId) { onUpdate(newCount); return }

    setLoading(true)
    if (logId) {
      await supabase
        .from('water_logs')
        .update({ glasses: newCount, updated_at: new Date().toISOString() })
        .eq('id', logId)
    } else {
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

  const totalMl = glasses * mlPerGlass
  const goalMl  = goal * mlPerGlass
  const pct     = Math.min(Math.round((glasses / goal) * 100), 100)

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">

      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-blue-400" />
          <span className="text-sm font-medium text-white">Água</span>
        </div>

        {/* ml por copo editável */}
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={mlInput}
              onChange={e => setMlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveMl()}
              className="w-16 text-sm text-center bg-[#2A2A2A] text-white rounded-lg px-2 py-1 border border-blue-500/50 outline-none"
              autoFocus
            />
            <span className="text-xs text-[#888]">ml</span>
            <button onClick={saveMl} className="text-blue-400 active:scale-90 transition-transform">
              <Check size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-[#888] active:text-white transition-colors"
          >
            <span>{mlPerGlass} ml/copo</span>
            <Pencil size={11} />
          </button>
        )}
      </div>

      {/* Total em ml em destaque */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-2xl font-bold text-white tabular-nums">
          {totalMl}
          <span className="text-sm font-normal text-[#888] ml-1">ml</span>
        </span>
        <span className="text-xs text-[#888]">meta: {goalMl} ml</span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 bg-[#2A2A2A] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Gotas visuais */}
      <div className="flex gap-1 flex-wrap mb-4">
        {Array.from({ length: goal }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-all ${
              i < glasses ? 'bg-blue-500' : 'bg-[#2A2A2A]'
            }`}
          >
            💧
          </div>
        ))}
      </div>

      {/* Controles +/− */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateGlasses(glasses - 1)}
          disabled={glasses <= 0 || loading}
          className="w-12 h-12 rounded-xl text-xl font-bold bg-[#2A2A2A] text-white disabled:opacity-30 active:scale-95 transition-transform flex items-center justify-center"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <p className="text-xl font-bold text-white tabular-nums">{glasses} <span className="text-sm font-normal text-[#888]">/ {goal} copos</span></p>
          {glasses >= goal && (
            <p className="text-xs text-blue-400 font-medium mt-0.5">✓ Meta atingida! 🎉</p>
          )}
        </div>
        <button
          onClick={() => updateGlasses(glasses + 1)}
          disabled={glasses >= goal || loading}
          className="w-12 h-12 rounded-xl text-xl font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 disabled:opacity-30 active:scale-95 transition-transform flex items-center justify-center"
        >
          +
        </button>
      </div>

    </div>
  )
}
