import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function toLocalDateStr(isoStr: string): string {
  const d = new Date(isoStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Retorna true se dois dias de treino são "consecutivos" para fins de streak.
 * Domingos (descanso) entre eles não quebram a sequência.
 * Exemplo: Sábado → Domingo (descanso) → Segunda = consecutivo ✓
 */
function isConsecutiveTraining(more_recent: string, older: string): boolean {
  const d1 = new Date(more_recent)
  const d2 = new Date(older)
  const diff = Math.round((d1.getTime() - d2.getTime()) / 86400000)
  if (diff <= 0) return false

  // Conta domingos entre d2 (exclusive) e d1 (exclusive)
  let sundays = 0
  const cursor = new Date(d2)
  cursor.setDate(cursor.getDate() + 1)
  while (cursor < d1) {
    if (cursor.getDay() === 0) sundays++
    cursor.setDate(cursor.getDate() + 1)
  }

  // Consecutivo se o único gap forem domingos
  return diff === 1 + sundays
}

export function useStreakDias(profileId: string | null) {
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  useEffect(() => {
    if (!profileId) return

    async function calc() {
      // 1. Sessões dos últimos 90 dias (janela suficiente para max streak)
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('profile_id', profileId)
        .gte('started_at', new Date(Date.now() - 90 * 86400000).toISOString())

      if (!sessions || sessions.length === 0) return

      // 2. set_logs dessas sessões
      const { data: setLogs } = await supabase
        .from('set_logs')
        .select('logged_at')
        .in('session_id', sessions.map(s => s.id))
        .eq('completed', true)

      if (!setLogs || setLogs.length === 0) return

      // 3. Datas distintas com série registrada (ignora domingos)
      const datesSet = new Set<string>()
      setLogs.forEach(l => {
        const d = new Date(l.logged_at)
        if (d.getDay() !== 0) datesSet.add(toLocalDateStr(l.logged_at))
      })

      const dates = Array.from(datesSet).sort((a, b) => b.localeCompare(a))
      if (dates.length === 0) return

      // 4. Streak atual (precisa ter treino hoje ou ontem para contar)
      const now  = new Date()
      const yest = new Date(); yest.setDate(yest.getDate() - 1)
      const today     = toLocalDateStr(now.toString())
      const yesterday = toLocalDateStr(yest.toString())

      let current = 0
      if (dates[0] === today || dates[0] === yesterday) {
        current = 1
        for (let i = 1; i < dates.length; i++) {
          if (isConsecutiveTraining(dates[i - 1], dates[i])) {
            current++
          } else {
            break
          }
        }
      }

      // 5. Máximo streak histórico
      let max = 1
      let temp = 1
      for (let i = 1; i < dates.length; i++) {
        if (isConsecutiveTraining(dates[i - 1], dates[i])) {
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
