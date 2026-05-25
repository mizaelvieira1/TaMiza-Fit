'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { getLocalDate } from '@/lib/dateUtils'

interface BeerCounterProps {
  count: number
  logId: string | null
  onUpdate: (count: number) => void
  onUpdateLogId: (id: string) => void
}

export function BeerCounter({ count, logId, onUpdate, onUpdateLogId }: BeerCounterProps) {
  const { profileId } = useProfileStore()
  const [loading, setLoading] = useState(false)
  const max = 2

  const day = new Date().getDay()
  const isWeekend = day === 0 || day === 6
  if (!isWeekend) return null

  async function addBeer() {
    if (count >= max || loading || !profileId) return
    setLoading(true)
    const newCount = count + 1
    const today = getLocalDate()

    if (logId) {
      await supabase.from('beer_logs').update({ count: newCount }).eq('id', logId)
    } else {
      // Primeiro registro do dia: INSERT e captura o ID retornado
      const { data } = await supabase
        .from('beer_logs')
        .insert({ profile_id: profileId, logged_date: today, count: newCount })
        .select()
        .single()
      if (data?.id) onUpdateLogId(data.id)
    }
    onUpdate(newCount)
    setLoading(false)
  }

  async function removeBeer() {
    if (count <= 0 || loading || !profileId) return
    setLoading(true)
    const newCount = count - 1
    if (logId) {
      await supabase.from('beer_logs').update({ count: newCount }).eq('id', logId)
      onUpdate(newCount)
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-white">Cerveja</span>
        <span className="text-xs text-[#888]">max. {max}/dia</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className="text-3xl transition-all"
            style={{ filter: i < count ? 'none' : 'grayscale(1) opacity(0.3)' }}
          >
            🍺
          </span>
        ))}
      </div>

      {count >= max && (
        <div className="bg-[#E67E22]/10 border border-[#E67E22]/30 rounded-xl p-3 mb-3">
          <p className="text-xs text-[#E67E22] font-medium">
            Limite atingido! Seu fígado agradece. Beba bastante água.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={removeBeer}
          disabled={count <= 0 || loading}
          className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#2A2A2A] text-white disabled:opacity-30 active:scale-95 transition-transform"
        >
          −
        </button>
        <button
          onClick={addBeer}
          disabled={count >= max || loading}
          className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30 disabled:opacity-30 active:scale-95 transition-transform"
        >
          + Cerveja
        </button>
      </div>
    </div>
  )
}
