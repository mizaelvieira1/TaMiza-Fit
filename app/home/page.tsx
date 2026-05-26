'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Dumbbell, Clock, ChevronRight, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isLocalMode } from '@/lib/isLocalMode'
import { useProfileStore } from '@/store/profileStore'
import { BottomNav } from '@/components/BottomNav'
import { ProteinBar } from '@/components/ProteinBar'
import { WaterTracker } from '@/components/WaterTracker'
import { TAMIRES_TREINOS } from '@/data/tamires/treinos'
import { MIZAEL_TREINOS } from '@/data/mizael/treinos'
import { TAMIRES_REFEICOES, TAMIRES_FRASES } from '@/data/tamires/alimentacao'
import { MIZAEL_REFEICOES } from '@/data/mizael/alimentacao'
import { useStreakDias } from '@/hooks/useStreakDias'
import { getLocalDate } from '@/lib/dateUtils'

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getDayType(day: number) {
  if (day === 0 || day === 6) return 'fds'
  if (day === 5) return 'sexta'
  return 'semana'
}

export default function HomePage() {
  const router = useRouter()
  const { activeProfile, profileId, clearProfile } = useProfileStore()
  const { streak } = useStreakDias(isLocalMode(profileId) ? null : profileId)

  const [waterGlasses, setWaterGlasses] = useState(0)
  const [waterLogId, setWaterLogId] = useState<string | null>(null)
  const [proteinConsumed, setProteinConsumed] = useState(0)
  const [dbMealStatus, setDbMealStatus] = useState<Record<string, boolean>>({})
  const [localMealStatus, setLocalMealStatus] = useState<Record<number, boolean>>({})
  const [dbMeals, setDbMeals] = useState<any[]>([])
  const [todayDbWorkoutId, setTodayDbWorkoutId] = useState<string | null>(null)
  const [workoutCompleted, setWorkoutCompleted] = useState(false)

  const today = new Date()
  const dayOfWeek = today.getDay()
  const treinos = activeProfile === 'tamires' ? TAMIRES_TREINOS : MIZAEL_TREINOS
  const refeicoes = activeProfile === 'tamires' ? TAMIRES_REFEICOES : MIZAEL_REFEICOES
  const dayType = getDayType(dayOfWeek)
  const localMeals = refeicoes[dayType] || refeicoes['semana'] || []
  const proteinGoal = activeProfile === 'tamires' ? 128 : 150
  const waterGoal = 10
  const todayWorkout = treinos.find(t => t.dayOfWeek === dayOfWeek) || treinos.find(t => t.type === 'descanso')
  const local = isLocalMode(profileId)

  const frase = activeProfile === 'tamires'
    ? TAMIRES_FRASES[Math.floor(today.getTime() / 86400000) % TAMIRES_FRASES.length]
    : null

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (local || !profileId) return

    const todayStr = getLocalDate()  // Data local (não UTC) — evita troca de dia às 21h BRT

    // Treino de hoje — pega o ID para o link "Iniciar"
    supabase.from('workouts').select('id').eq('profile_id', profileId).eq('day_of_week', dayOfWeek).limit(1)
      .then(({ data: workouts }) => {
        if (workouts && workouts.length > 0) setTodayDbWorkoutId(workouts[0].id)
      })

    // Verifica se QUALQUER treino foi concluído hoje (independente do workout_id)
    // Busca nas últimas 36h e filtra pela data local no cliente — evita problema de timezone
    const since = new Date(Date.now() - 36 * 3600000).toISOString()
    supabase.from('workout_sessions')
      .select('started_at')
      .eq('profile_id', profileId)
      .eq('completed', true)
      .gte('started_at', since)
      .then(({ data: sessions }) => {
        const now = new Date()
        const doneToday = (sessions || []).some(s => {
          const d = new Date(s.started_at)
          return d.getFullYear() === now.getFullYear() &&
                 d.getMonth()    === now.getMonth()    &&
                 d.getDate()     === now.getDate()
        })
        if (doneToday) setWorkoutCompleted(true)
      })

    supabase.from('water_logs').select('*').eq('profile_id', profileId).eq('logged_date', todayStr)
      .order('glasses', { ascending: false }).limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) { setWaterGlasses(data[0].glasses); setWaterLogId(data[0].id) }
      })

    supabase.from('meals').select('id, meal_name, protein_g').eq('profile_id', profileId).eq('day_type', dayType)
      .then(async ({ data: meals }) => {
        if (!meals) return
        setDbMeals(meals)
        const { data: logs } = await supabase.from('meal_logs').select('meal_id, completed').eq('profile_id', profileId).eq('logged_date', todayStr)
        const status: Record<string, boolean> = {}
        let protein = 0
        meals.forEach(m => {
          const log = logs?.find(l => l.meal_id === m.id)
          status[m.id] = log?.completed || false
          if (log?.completed) protein += m.protein_g || 0
        })
        setDbMealStatus(status)
        setProteinConsumed(protein)
      })
  }, [activeProfile, profileId, local])

  function toggleLocalMeal(idx: number) {
    const meal = localMeals[idx]
    const nowDone = !localMealStatus[idx]
    setLocalMealStatus(prev => ({ ...prev, [idx]: nowDone }))
    setProteinConsumed(prev => nowDone ? prev + (meal.proteinG || 0) : prev - (meal.proteinG || 0))
  }

  if (!activeProfile) return null

  const name = activeProfile === 'tamires' ? 'Tamires' : 'Mizael'
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const mealsToShow = local ? localMeals : dbMeals

  return (
    <div className="min-h-screen pb-28 pt-safe">
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-6 pb-4">
        <div>
          <p className="text-[#888] text-sm">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-white">{name} 👋</h1>
          <p className="text-xs text-[#888] mt-0.5">
            {DAY_NAMES[dayOfWeek]}, {today.getDate()} de {MONTH_NAMES[today.getMonth()]}
          </p>
        </div>
        <button onClick={() => { clearProfile(); router.push('/') }} className="p-2 rounded-xl bg-[#1A1A1A]">
          <LogOut size={18} className="text-[#888]" />
        </button>
      </div>

      <div className="px-4 space-y-3">
        {/* Frase motivacional — Tamires */}
        {frase && (
          <div className="rounded-2xl p-4" style={{ background: '#E91E8C11', border: '1px solid #E91E8C33' }}>
            <p className="text-sm font-medium italic" style={{ color: '#FF6EB4' }}>"{frase}"</p>
          </div>
        )}

        {/* Treino de hoje */}
        {todayWorkout && (
          todayWorkout.type === 'descanso' ? (
            <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
              <p className="text-lg font-bold text-[#888]">💤 Dia de Descanso</p>
              <p className="text-xs text-[#555] mt-1">Recuperação é parte do treino.</p>
            </div>
          ) : (
            <Link
              href={workoutCompleted ? '/treino' : (todayDbWorkoutId ? `/treino/${todayDbWorkoutId}` : '/treino')}
              className="block bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A] active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-[#888] mb-1">Treino de Hoje</p>
                  <p className="text-base font-bold text-white leading-tight">{todayWorkout.name}</p>
                  <p className="text-xs mt-1" style={{ color }}>{todayWorkout.focus}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-[#888]">
                      <Clock size={12} /> {todayWorkout.durationMin} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#888]">
                      <Dumbbell size={12} /> {todayWorkout.exercises.length} exercícios
                    </span>
                  </div>
                </div>
                {workoutCompleted ? (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0 bg-[#27AE60]/20 text-[#27AE60]">
                    <Check size={14} /> Feito
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0" style={{ backgroundColor: color, color: activeProfile === 'tamires' ? '#fff' : '#000' }}>
                    Iniciar <ChevronRight size={14} />
                  </div>
                )}
              </div>
            </Link>
          )
        )}

        {/* Streak */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A] flex items-center gap-3">
          <div className="text-2xl">🔥</div>
          <div>
            <p className="text-base font-bold text-white">{streak} {streak === 1 ? 'dia' : 'dias'} consecutivos</p>
            <p className="text-xs text-[#888]">Continue assim!</p>
          </div>
        </div>

        {/* Proteína */}
        <ProteinBar consumed={proteinConsumed} goal={proteinGoal} />

        {/* Água */}
        {local ? (
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-white">💧 Água</span>
              <span className="text-xs text-[#888]">{waterGlasses}/{waterGoal} copos</span>
            </div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterGlasses(g => i < g ? i : i + 1)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${i < waterGlasses ? 'bg-blue-500' : 'bg-[#2A2A2A]'}`}
                >
                  💧
                </button>
              ))}
            </div>
          </div>
        ) : (
          <WaterTracker glasses={waterGlasses} goal={waterGoal} logId={waterLogId} onUpdate={setWaterGlasses} onUpdateLogId={setWaterLogId} />
        )}

        {/* Refeições do dia */}
        {mealsToShow.length > 0 && (
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-white">Refeições de Hoje</p>
              <Link href="/alimentacao" className="text-xs underline" style={{ color }}>ver tudo</Link>
            </div>
            <div className="space-y-2">
              {(local ? localMeals : dbMeals).slice(0, 5).map((meal, i) => {
                const done = local ? (localMealStatus[i] || false) : (dbMealStatus[(meal as any).id] || false)
                return (
                  <button
                    key={local ? i : (meal as any).id}
                    onClick={() => local ? toggleLocalMeal(i) : undefined}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <div
                      className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: done ? '#27AE60' : '#444', backgroundColor: done ? '#27AE60' : 'transparent' }}
                    >
                      {done && <Check size={10} color="#fff" strokeWidth={3} />}
                    </div>
                    <span className={`text-xs ${done ? 'text-[#888] line-through' : 'text-white'}`}>
                      {local ? (meal as any).name : (meal as any).meal_name}
                    </span>
                    {local && (meal as any).proteinG > 0 && (
                      <span className="text-xs text-[#555] ml-auto">{(meal as any).proteinG}g</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Notice if local mode */}
        {local && (
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#E67E22]/30">
            <p className="text-xs text-[#E67E22] font-medium mb-1">Modo Demo</p>
            <p className="text-xs text-[#888]">Configure o Supabase no <code className="text-[#aaa]">.env.local</code> e execute <code className="text-[#aaa]">/api/seed</code> para salvar dados no banco.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
