'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Check, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { useSessionStore } from '@/store/sessionStore'
import { TimerDescanso } from '@/components/TimerDescanso'

export default function SessaoPage() {
  const router = useRouter()
  const { id } = useParams()
  const { activeProfile, profileId } = useProfileStore()
  const {
    sessionId, currentExerciseIndex, currentSetIndex,
    setSessionId, setCurrentExercise, setCurrentSet,
    startTimer, stopTimer, resetSession,
  } = useSessionStore()

  const [workout, setWorkout]               = useState<any>(null)
  const [exercises, setExercises]           = useState<any[]>([])
  const [completed, setCompleted]           = useState<Record<string, boolean>>({})
  const [weights, setWeights]               = useState<Record<string, number>>({})
  const [sessionStarted, setSessionStarted] = useState(false)
  const [finished, setFinished]             = useState(false)
  const [loading, setLoading]               = useState(true)
  const [showChecklist, setShowChecklist]   = useState(false)
  const [duration, setDuration]             = useState(0)
  const [mood, setMood]                     = useState<string | null>(null)
  const [finishedSessionId, setFinishedSessionId] = useState<string | null>(null)
  const [isResting, setIsResting]           = useState(false)
  const [restDuration, setRestDuration]     = useState(60)
  const startTimeRef = useRef<number>(Date.now())

  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const currentExercise = exercises[currentExerciseIndex]
  const totalSets = currentExercise?.sets || 1

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (!id || !profileId) return

    async function load() {
      const { data: w } = await supabase.from('workouts').select('*').eq('id', id).single()
      setWorkout(w)
      const { data: exs } = await supabase.from('exercises').select('*').eq('workout_id', id).order('order_index')
      const list = exs || []
      setExercises(list)

      // Pré-preenche cargas com a última sessão concluída
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('profile_id', profileId)
        .eq('workout_id', id)
        .eq('completed', true)
        .order('finished_at', { ascending: false })
        .limit(1)

      if (sessions && sessions.length > 0) {
        const { data: logs } = await supabase
          .from('set_logs')
          .select('exercise_id, weight_kg')
          .eq('session_id', sessions[0].id)
          .eq('completed', true)
        const w: Record<string, number> = {}
        logs?.forEach(l => { if (!w[l.exercise_id]) w[l.exercise_id] = l.weight_kg })
        setWeights(w)
      } else {
        const defaultW: Record<string, number> = {}
        list.forEach((ex: any) => { defaultW[ex.id] = ex.initial_weight_kg })
        setWeights(defaultW)
      }
      setLoading(false)
    }
    load()
  }, [id, profileId, activeProfile])

  async function startSession() {
    if (!profileId) return
    const { data: s } = await supabase
      .from('workout_sessions')
      .insert({ profile_id: profileId, workout_id: id, started_at: new Date().toISOString() })
      .select()
      .single()
    if (s) { setSessionId(s.id); setSessionStarted(true); startTimeRef.current = Date.now() }
  }

  async function completeSet() {
    if (!sessionId || !currentExercise || isResting) return

    // Marca série como concluída
    const key = `${currentExercise.id}_${currentSetIndex}`
    setCompleted(prev => ({ ...prev, [key]: true }))

    // Registra no banco (fire and forget — não bloqueia a UI)
    supabase.from('set_logs').insert({
      session_id:  sessionId,
      exercise_id: currentExercise.id,
      set_number:  currentSetIndex + 1,
      weight_kg:   weights[currentExercise.id] || 0,
      reps_done:   0,
      completed:   true,
      logged_at:   new Date().toISOString(),
    })

    const isLastSet = currentSetIndex + 1 >= totalSets

    if (!isLastSet) {
      // Avança o contador de séries imediatamente
      setCurrentSet(currentSetIndex + 1)
    } else {
      // Última série do exercício — avança para o próximo
      const nextIdx = currentExerciseIndex + 1
      if (nextIdx < exercises.length) {
        setCurrentExercise(nextIdx)
        setCurrentSet(0)
      } else {
        // Treino completo!
        finishWorkout()
        return
      }
    }

    // Inicia o timer de descanso (se houver)
    if (currentExercise.rest_seconds > 0) {
      const dur = currentExercise.rest_seconds
      setRestDuration(dur)
      setIsResting(true)
      startTimer(dur)
    }
  }

  // Chamado quando o timer termina (natural ou "Pular")
  function handleTimerDone() {
    stopTimer()
    setIsResting(false)
  }

  // Pula para qualquer exercício da lista
  function jumpToExercise(idx: number) {
    if (idx < 0 || idx >= exercises.length) return
    stopTimer()
    setIsResting(false)
    setCurrentExercise(idx)
    setCurrentSet(0)
  }

  async function finishWorkout() {
    if (!sessionId) return
    const dur = Math.round((Date.now() - startTimeRef.current) / 60000)
    setDuration(dur)
    setFinishedSessionId(sessionId)
    await supabase
      .from('workout_sessions')
      .update({ finished_at: new Date().toISOString(), completed: true, duration_min: dur })
      .eq('id', sessionId)
    setFinished(true)
    resetSession()
  }

  async function saveMood(selectedMood: string) {
    setMood(selectedMood)
    if (!finishedSessionId) return
    await supabase.from('workout_sessions').update({ mood: selectedMood }).eq('id', finishedSessionId)
  }

  if (!activeProfile) return null
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
    </div>
  )

  const MOODS = [
    { key: 'exausto', emoji: '😴', label: 'Exausto'   },
    { key: 'ok',      emoji: '😐', label: 'Ok'        },
    { key: 'bem',     emoji: '🙂', label: 'Bem'       },
    { key: 'otimo',   emoji: '💪', label: 'Ótimo'     },
    { key: 'fogo',    emoji: '⚡', label: 'Em chamas' },
  ]

  // ── Tela de conclusão ──────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">Treino Concluído!</h2>
        <p className="text-[#888] mb-1">{workout?.name}</p>
        <p className="text-sm text-[#888] mb-6">Duração: {duration} minutos</p>

        <div className="w-full bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A] mb-6">
          <p className="text-sm font-medium text-white mb-3">Como foi o treino?</p>
          <div className="flex justify-around">
            {MOODS.map(m => (
              <button
                key={m.key}
                onClick={() => saveMood(m.key)}
                className="flex flex-col items-center gap-1 transition-all active:scale-90"
              >
                <span
                  className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl transition-all"
                  style={{
                    backgroundColor: mood === m.key ? color + '33' : '#2A2A2A',
                    border: `2px solid ${mood === m.key ? color : 'transparent'}`,
                    filter: mood && mood !== m.key ? 'grayscale(1) opacity(0.4)' : 'none',
                  }}
                >
                  {m.emoji}
                </span>
                <span className="text-[10px] text-[#888]">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => { resetSession(); router.push('/treino') }}
            className="w-full py-4 rounded-2xl text-base font-bold"
            style={{ backgroundColor: color, color: activeProfile === 'tamires' ? '#fff' : '#000' }}
          >
            Voltar aos Treinos
          </button>
          <button
            onClick={() => { resetSession(); router.push('/home') }}
            className="w-full py-4 rounded-2xl text-base font-medium bg-[#1A1A1A] text-white border border-[#2A2A2A]"
          >
            Ir para o Início
          </button>
        </div>
      </div>
    )
  }

  // ── Tela pré-treino ────────────────────────────────────────────────────────
  if (!sessionStarted) {
    return (
      <div className="min-h-screen flex flex-col pt-safe">
        <div className="flex items-center gap-3 px-5 pt-6 pb-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-[#1A1A1A]">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">{workout?.name}</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">💪</div>
          <p className="text-white font-semibold text-lg mb-2">Pronto para começar?</p>
          <p className="text-[#888] text-sm mb-8">{exercises.length} exercícios • {workout?.duration_min} min</p>
          <button
            onClick={startSession}
            className="w-full py-4 rounded-2xl text-base font-bold active:scale-95 transition-transform"
            style={{ backgroundColor: color, color: activeProfile === 'tamires' ? '#fff' : '#000' }}
          >
            Iniciar Treino
          </button>
        </div>
      </div>
    )
  }

  // ── Sessão em andamento ────────────────────────────────────────────────────
  const exercisesDone = exercises.filter((_, i) => i < currentExerciseIndex).length
  const progressPct = Math.round((exercisesDone / exercises.length) * 100)

  return (
    <div className="min-h-screen pb-8 pt-safe flex flex-col">
      {/* Header com barra de progresso */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-[#1A1A1A]">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-[#888]">{workout?.name}</p>
          <div className="h-1.5 bg-[#2A2A2A] rounded-full mt-1 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: color }} />
          </div>
        </div>
        <span className="text-xs text-[#888]">{exercisesDone}/{exercises.length}</span>
      </div>

      <div className="px-4 flex-1">
        {currentExercise && (
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A] mb-4">
            {/* Navegação entre exercícios */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#888]">
                Exercício {currentExerciseIndex + 1} de {exercises.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => jumpToExercise(currentExerciseIndex - 1)}
                  disabled={currentExerciseIndex === 0}
                  className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center disabled:opacity-25 active:scale-90 transition-transform"
                  title="Exercício anterior"
                >
                  <ChevronLeft size={14} className="text-white" />
                </button>
                <button
                  onClick={() => jumpToExercise(currentExerciseIndex + 1)}
                  disabled={currentExerciseIndex >= exercises.length - 1}
                  className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center disabled:opacity-25 active:scale-90 transition-transform"
                  title="Próximo exercício"
                >
                  <ChevronRight size={14} className="text-white" />
                </button>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">{currentExercise.name}</h2>
            {currentExercise.notes && (
              <p className="text-xs text-[#888] mb-3">{currentExercise.notes}</p>
            )}

            {/* Stats da série atual */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color }}>
                  {currentSetIndex + 1}
                  <span className="text-[#888] text-sm font-normal"> / {totalSets}</span>
                </p>
                <p className="text-xs text-[#888]">Série</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{currentExercise.reps}</p>
                <p className="text-xs text-[#888]">Reps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{currentExercise.rest_seconds}s</p>
                <p className="text-xs text-[#888]">Descanso</p>
              </div>
            </div>

            {/* Input de carga */}
            <div className="mb-4">
              <p className="text-xs text-[#888] mb-1">Carga (kg)</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWeights(w => ({ ...w, [currentExercise.id]: Math.max(0, (w[currentExercise.id] || 0) - 0.5) }))}
                  className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white text-xl font-bold flex items-center justify-center active:scale-90"
                >−</button>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={weights[currentExercise.id] || 0}
                  onChange={e => setWeights(w => ({ ...w, [currentExercise.id]: parseFloat(e.target.value) || 0 }))}
                  className="flex-1 bg-[#2A2A2A] rounded-xl text-center text-2xl font-bold text-white py-2.5 outline-none border border-[#3A3A3A] focus:border-white"
                />
                <button
                  onClick={() => setWeights(w => ({ ...w, [currentExercise.id]: (w[currentExercise.id] || 0) + 0.5 }))}
                  className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white text-xl font-bold flex items-center justify-center active:scale-90"
                >+</button>
              </div>
            </div>

            {/* Botão principal */}
            <button
              onClick={completeSet}
              disabled={isResting}
              className="w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-all disabled:cursor-not-allowed"
              style={{
                backgroundColor: isResting ? '#2A2A2A' : color,
                color: isResting ? '#666' : (activeProfile === 'tamires' ? '#fff' : '#000'),
              }}
            >
              {isResting
                ? '⏳ Aguarde o descanso…'
                : <><Check size={18} strokeWidth={3} /> Série Concluída</>
              }
            </button>
          </div>
        )}

        {/* Timer de descanso */}
        <TimerDescanso maxSeconds={restDuration} onComplete={handleTimerDone} />

        {/* Checklist de todos os exercícios — clicável para navegar */}
        <button
          onClick={() => setShowChecklist(s => !s)}
          className="flex items-center gap-2 text-sm text-[#888] mt-4 mb-2"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${showChecklist ? 'rotate-180' : ''}`}
          />
          Todos os exercícios
        </button>

        {showChecklist && (
          <div className="space-y-1.5 pb-4">
            {exercises.map((ex, i) => {
              const isDone    = i < currentExerciseIndex
              const isCurrent = i === currentExerciseIndex
              return (
                <button
                  key={ex.id}
                  onClick={() => jumpToExercise(i)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl w-full text-left transition-colors ${
                    isCurrent ? 'bg-[#2A2A2A]' : 'active:bg-[#1E1E1E]'
                  }`}
                >
                  {/* Indicador de estado */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      borderColor: isDone ? '#27AE60' : isCurrent ? color : '#444',
                      backgroundColor: isDone ? '#27AE60' : 'transparent',
                    }}
                  >
                    {isDone && <Check size={10} color="#fff" strokeWidth={3} />}
                    {isCurrent && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
                  </div>

                  <span className={`text-xs flex-1 ${
                    isDone ? 'text-[#666] line-through' : isCurrent ? 'text-white font-semibold' : 'text-[#aaa]'
                  }`}>
                    {ex.name}
                  </span>

                  {/* Seta de navegação para exercícios não concluídos */}
                  {!isDone && !isCurrent && (
                    <ChevronRight size={12} className="text-[#555] flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
