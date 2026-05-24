import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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

      const dates = Array.from(new Set(
        sessions.map(s => s.finished_at.split('T')[0])
      )).sort((a, b) => b.localeCompare(a))

      let current = 0
      let max = 0
      let temp = 1

      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

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
