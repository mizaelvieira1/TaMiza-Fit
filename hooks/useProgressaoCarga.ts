import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useProgressaoCarga(exerciseId: string, profileId: string) {
  const [shouldIncrease, setShouldIncrease] = useState(false)
  const [currentWeight, setCurrentWeight] = useState<number | null>(null)

  useEffect(() => {
    if (!exerciseId || !profileId) return

    async function check() {
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('profile_id', profileId)
        .eq('completed', true)
        .order('finished_at', { ascending: false })
        .limit(2)

      if (!sessions || sessions.length < 2) return

      const sessionIds = sessions.map(s => s.id)

      const { data: logs } = await supabase
        .from('set_logs')
        .select('weight_kg, session_id')
        .eq('exercise_id', exerciseId)
        .in('session_id', sessionIds)
        .eq('completed', true)

      if (!logs || logs.length === 0) return

      const session1Logs = logs.filter(l => l.session_id === sessionIds[0])
      const session2Logs = logs.filter(l => l.session_id === sessionIds[1])

      if (session1Logs.length === 0 || session2Logs.length === 0) return

      const allWeights = [...session1Logs, ...session2Logs].map(l => l.weight_kg)
      const firstWeight = allWeights[0]
      const allSame = allWeights.every(w => w === firstWeight)

      if (allSame && firstWeight > 0) {
        setShouldIncrease(true)
        setCurrentWeight(firstWeight)
      }
    }

    check()
  }, [exerciseId, profileId])

  return { shouldIncrease, currentWeight }
}
