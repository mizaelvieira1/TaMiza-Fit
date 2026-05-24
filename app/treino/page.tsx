'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, Dumbbell, ChevronRight, Check, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isLocalMode } from '@/lib/isLocalMode'
import { useProfileStore } from '@/store/profileStore'
import { BottomNav } from '@/components/BottomNav'
import { TAMIRES_TREINOS } from '@/data/tamires/treinos'
import { MIZAEL_TREINOS } from '@/data/mizael/treinos'

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const TYPE_COLORS: Record<string, string> = {
  musculacao: '#6C63FF',
  cardio: '#27AE60',
  hiit: '#E67E22',
  descanso: '#444',
}
const TYPE_LABELS: Record<string, string> = {
  musculacao: 'Musculação',
  cardio: 'Cardio',
  hiit: 'HIIT',
  descanso: 'Descanso',
}

export default function TreinoPage() {
  const router = useRouter()
  const { activeProfile, profileId } = useProfileStore()
  const [dbWorkouts, setDbWorkouts] = useState<any[]>([])
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set())
  const [weeksSince, setWeeksSince] = useState(0)
  const [loading, setLoading] = useState(true)

  const treinos = activeProfile === 'tamires' ? TAMIRES_TREINOS : MIZAEL_TREINOS
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const today = new Date().getDay()

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (!profileId || isLocalMode(profileId)) { setLoading(false); return }

    async function load() {
      const todayStr = new Date().toISOString().split('T')[0]

      // Load DB workouts to get IDs
      const { data: workouts } = await supabase
        .from('workouts')
        .select('id, name, day_of_week')
        .eq('profile_id', profileId)

      setDbWorkouts(workouts || [])

      // Load completed sessions this week
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('workout_id, started_at')
        .eq('profile_id', profileId)
        .eq('completed', true)
        .gte('started_at', weekAgo)

      const dates = new Set((sessions || []).map(s => {
        const d = new Date(s.started_at)
        return `${d.getDay()}`
      }))
      setCompletedDates(dates)

      // Check weeks since first log
      const { data: firstLog } = await supabase
        .from('workout_sessions')
        .select('started_at')
        .eq('profile_id', profileId)
        .order('started_at', { ascending: true })
        .limit(1)
        .single()

      if (firstLog) {
        const weeks = Math.floor((Date.now() - new Date(firstLog.started_at).getTime()) / (7 * 86400000))
        setWeeksSince(weeks)
      }

      setLoading(false)
    }

    load()
  }, [activeProfile, profileId])

  if (!activeProfile) return null

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">Treinos</h1>
        <p className="text-xs text-[#888] mt-1">Semana de treino personalizada</p>
      </div>

      {weeksSince >= 6 && (
        <div className="mx-4 mb-3 bg-[#6C63FF]/10 border border-[#6C63FF]/30 rounded-2xl p-4 flex items-center gap-3">
          <RefreshCw size={18} style={{ color: '#6C63FF' }} />
          <div>
            <p className="text-sm font-medium text-white">Programa com {weeksSince} semanas!</p>
            <p className="text-xs text-[#888]">Que tal renovar para continuar evoluindo?</p>
          </div>
        </div>
      )}

      <div className="px-4 space-y-3">
        {treinos.map((treino, i) => {
          const isToday = treino.dayOfWeek === today
          const isDone = completedDates.has(String(treino.dayOfWeek))
          const isRest = treino.type === 'descanso'
          const dbWorkout = dbWorkouts.find(w => w.day_of_week === treino.dayOfWeek)

          return (
            <div
              key={i}
              className={`bg-[#1A1A1A] rounded-2xl p-4 border transition-all ${
                isToday ? 'border-2' : 'border-[#2A2A2A]'
              }`}
              style={{ borderColor: isToday ? color : undefined }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: TYPE_COLORS[treino.type] + '22', color: TYPE_COLORS[treino.type] }}
                  >
                    {DAY_NAMES[treino.dayOfWeek]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white leading-tight">{treino.name}</p>
                      {isToday && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + '22', color }}>
                          Hoje
                        </span>
                      )}
                    </div>
                    {!isRest && (
                      <>
                        <p className="text-xs mt-0.5" style={{ color: TYPE_COLORS[treino.type] }}>{treino.focus}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-[#888]">
                            <Clock size={11} /> {treino.durationMin} min
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#888]">
                            <Dumbbell size={11} /> {treino.exercises.length} exercícios
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {!isRest && (
                  isDone ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#27AE60]/20 text-[#27AE60] text-xs font-medium">
                      <Check size={12} /> Feito
                    </div>
                  ) : (
                    <Link
                      href={dbWorkout ? `/treino/${dbWorkout.id}` : '#'}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      style={{ backgroundColor: color, color: activeProfile === 'tamires' ? '#fff' : '#000' }}
                    >
                      {isToday ? 'Iniciar' : 'Ver'} <ChevronRight size={12} />
                    </Link>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
