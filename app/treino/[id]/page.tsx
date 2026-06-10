'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ChevronRight, Dumbbell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { ExerciseCard } from '@/components/ExerciseCard'

export default function TreinoDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { activeProfile, profileId } = useProfileStore()
  const [workout, setWorkout] = useState<any>(null)
  const [exercises, setExercises] = useState<any[]>([])
  const [lastWeights, setLastWeights] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (!id || !profileId) return

    async function load() {
      const { data: w } = await supabase.from('workouts').select('*').eq('id', id).single()
      setWorkout(w)

      const { data: exs } = await supabase.from('exercises').select('*').eq('workout_id', id).order('order_index')
      setExercises(exs || [])

      // Último peso usado por exercício (sem filtro de completed na sessão)
      if (exs && exs.length > 0) {
        const { data: recentSessions } = await supabase
          .from('workout_sessions')
          .select('id')
          .eq('profile_id', profileId)
          .eq('workout_id', id)
          .order('started_at', { ascending: false })
          .limit(5)

        if (recentSessions && recentSessions.length > 0) {
          const { data: logs } = await supabase
            .from('set_logs')
            .select('exercise_id, weight_kg')
            .in('session_id', recentSessions.map(s => s.id))
            .eq('completed', true)
            .order('logged_at', { ascending: false })

          const weights: Record<string, number> = {}
          logs?.forEach(l => { if (!weights[l.exercise_id]) weights[l.exercise_id] = l.weight_kg })
          setLastWeights(weights)
        }
      }

      setLoading(false)
    }

    load()
  }, [id, profileId, activeProfile])

  if (!activeProfile) return null
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
    </div>
  )
  if (!workout) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <p className="text-[#888] text-center">Treino não encontrado.<br />Execute o seed primeiro em /api/seed</p>
    </div>
  )

  return (
    <div className="min-h-screen pb-10 pt-safe">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-[#1A1A1A]">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{workout.name}</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-[#888]">
              <Clock size={11} /> {workout.duration_min} min
            </span>
            <span className="flex items-center gap-1 text-xs text-[#888]">
              <Dumbbell size={11} /> {exercises.length} exercícios
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <p className="text-sm font-medium mb-4" style={{ color }}>{workout.focus}</p>
        <div className="space-y-2">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exerciseId={ex.id}
              name={ex.name}
              sets={ex.sets}
              reps={ex.reps}
              restSeconds={ex.rest_seconds}
              notes={ex.notes}
              initialWeightKg={lastWeights[ex.id] || ex.initial_weight_kg}
            />
          ))}
        </div>
      </div>

      <div className="px-4">
        <Link
          href={`/treino/${id}/sessao`}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold active:scale-95 transition-transform"
          style={{ backgroundColor: color, color: activeProfile === 'tamires' ? '#fff' : '#000' }}
        >
          Iniciar Treino <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  )
}
