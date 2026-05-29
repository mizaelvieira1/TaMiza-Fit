import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/** Converte timestamp ISO para data LOCAL (evita troca de dia no UTC) */
function toLocalDateStr(isoStr: string): string {
  const d = new Date(isoStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useStreakDias(profileId: string | null) {
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  useEffect(() => {
    if (!profileId) return

    async function calc() {
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('finished_at')
        .eq('profile_id', profileId)
        .eq('completed', true)
        .order('finished_at', { ascending: false })

      if (!sessions || sessions.length === 0) return

      // Usa data LOCAL para evitar troca de dia às 21h BRT (UTC-3)
      const dates = Array.from(new Set(
        sessions.map(s => toLocalDateStr(s.finished_at))
      )).sort((a, b) => b.localeCompare(a))

      let current = 0
      let max = 0
      let temp = 1

      const now  = new Date()
      const yest = new Date(); yest.setDate(yest.getDate() - 1)
      const today     = toLocalDateStr(now.toISOString())
      const yesterday = toLocalDateStr(yest.toISOString())

      if (dates[0] === today || dates[0] === yesterday) {
        current = 1
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1])
          const curr = new Date(dates[i])
          const diff = (prev.getTime() - curr.getTime()) / 86400000
          if (diff === 1) {
            current++
          } else {
            break
          }
        }
      }

      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1])
        const curr = new Date(dates[i])
        const diff = (prev.getTime() - curr.getTime()) / 86400000
        if (diff === 1) {
          temp++
        } else {
          max = Math.max(max, temp)
          temp = 1
        }
      }
      max = Math.max(max, temp)

      setStreak(current)
      setMaxStreak(max)
    }

    calc()
  }, [profileId])

  return { streak, maxStreak }
}
