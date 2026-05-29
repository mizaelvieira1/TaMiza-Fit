'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { BottomNav } from '@/components/BottomNav'
import { GraficoEvolucao } from '@/components/GraficoEvolucao'
import { ExamProgress } from '@/components/ExamProgress'
import { useStreakDias } from '@/hooks/useStreakDias'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { WeightInput } from '@/components/WeightInput'
import { getLocalDate, dateToStr } from '@/lib/dateUtils'

export default function EvolucaoPage() {
  const router = useRouter()
  const { activeProfile, profileId } = useProfileStore()
  const { streak, maxStreak } = useStreakDias(profileId)

  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [cargaData, setCargaData] = useState<{ date: string; value: number }[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [weeklyProtein, setWeeklyProtein] = useState<{ day: string; value: number }[]>([])
  const [frequencyGrid, setFrequencyGrid] = useState<{ date: string; status: 'done' | 'rest' | 'missed' | 'empty' }[]>([])
  const [loading, setLoading] = useState(true)
  // Peso
  const [weightHistory, setWeightHistory] = useState<{ date: string; value: number }[]>([])
  const [todayWeight, setTodayWeight] = useState<number | null>(null)
  const [todayWeightId, setTodayWeightId] = useState<string | null>(null)

  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const proteinGoal = activeProfile === 'tamires' ? 128 : 150

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (!profileId) return

    async function load() {
      // Peso — histórico dos últimos 30 registros
      const { data: wLogs } = await supabase
        .from('weight_logs')
        .select('id, logged_date, weight_kg')
        .eq('profile_id', profileId)
        .order('logged_date', { ascending: true })
        .limit(30)

      if (wLogs) {
        const history = wLogs.map(w => ({
          date: w.logged_date.slice(5), // MM-DD
          value: parseFloat(w.weight_kg),
        }))
        setWeightHistory(history)

        const today = getLocalDate()
        const todayLog = wLogs.find(w => w.logged_date === today)
        if (todayLog) {
          setTodayWeight(parseFloat(todayLog.weight_kg))
          setTodayWeightId(todayLog.id)
        }
      }

      // Load exercises for selector
      const { data: exs } = await supabase
        .from('exercises')
        .select('id, name, workout_id')
        .in('workout_id', (await supabase.from('workouts').select('id').eq('profile_id', profileId)).data?.map(w => w.id) || [])
        .order('name')

      const uniqueExs = exs?.filter((ex, i, arr) => arr.findIndex(e => e.name === ex.name) === i) || []
      setExercises(uniqueExs)
      if (uniqueExs.length > 0) setSelectedExercise(uniqueExs[0].id)

      // Load exams (Mizael only)
      if (activeProfile === 'mizael') {
        const { data: examData } = await supabase
          .from('exam_results')
          .select('*')
          .eq('profile_id', profileId)
          .order('logged_date', { ascending: false })

        // Get latest per exam_name
        const latestExams: Record<string, any> = {}
        examData?.forEach(e => {
          if (!latestExams[e.exam_name]) latestExams[e.exam_name] = e
        })
        setExams(Object.values(latestExams))
      }

      // Weekly protein from meal logs
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      const proteinByDay: { day: string; value: number }[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000)
        const dateStr = d.toISOString().split('T')[0]
        const { data: logs } = await supabase
          .from('meal_logs')
          .select('meal_id, completed')
          .eq('profile_id', profileId)
          .eq('logged_date', dateStr)
          .eq('completed', true)

        const { data: meals } = await supabase
          .from('meals')
          .select('id, protein_g')
          .eq('profile_id', profileId)

        let total = 0
        logs?.forEach(l => {
          const m = meals?.find(m => m.id === l.meal_id)
          if (m) total += m.protein_g || 0
        })
        proteinByDay.push({ day: days[d.getDay()], value: total })
      }
      setWeeklyProtein(proteinByDay)

      // Frequency grid — last 28 days, alinhado aos cabeçalhos D S T Q Q S S
      const grid: { date: string; status: 'done' | 'rest' | 'missed' | 'empty' }[] = []

      // 1. Sessões dos últimos 29 dias
      const { data: recentSessions } = await supabase
        .from('workout_sessions')
        .select('id, started_at')
        .eq('profile_id', profileId)
        .gte('started_at', new Date(Date.now() - 29 * 86400000).toISOString())

      // 2. set_logs dessas sessões — um dia está "feito" se tem série registrada
      //    (mais confiável que completed=true, que só é setado na tela final)
      const recentSessionIds = recentSessions?.map(s => s.id) || []
      const datesWithWork = new Set<string>()
      if (recentSessionIds.length > 0) {
        const { data: recentSetLogs } = await supabase
          .from('set_logs')
          .select('logged_at')
          .in('session_id', recentSessionIds)
          .eq('completed', true)
        recentSetLogs?.forEach(l => {
          datesWithWork.add(dateToStr(new Date(l.logged_at)))
        })
      }

      // Padding para alinhar coluna com o dia da semana correto
      const firstDay = new Date(Date.now() - 27 * 86400000)
      const paddingCount = firstDay.getDay() // 0=Dom … 6=Sáb
      for (let p = 0; p < paddingCount; p++) {
        grid.push({ date: '', status: 'empty' })
      }

      for (let i = 27; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000)
        const localDate = dateToStr(d)
        const isRestDay = d.getDay() === 0  // domingo = descanso

        // Domingo sempre descanso; nos outros dias, conta se tem série registrada
        const status = isRestDay ? 'rest' : datesWithWork.has(localDate) ? 'done' : 'missed'
        grid.push({ date: localDate, status })
      }
      setFrequencyGrid(grid)

      setLoading(false)
    }

    load()
  }, [activeProfile, profileId])

  useEffect(() => {
    if (!selectedExercise || !profileId) return

    async function loadCarga() {
      const { data: logs } = await supabase
        .from('set_logs')
        .select('weight_kg, logged_at, session_id')
        .eq('exercise_id', selectedExercise)
        .eq('completed', true)
        .order('logged_at', { ascending: true })

      // Group by session — take max weight per session
      const bySession: Record<string, { date: string; maxWeight: number }> = {}
      logs?.forEach(l => {
        if (!bySession[l.session_id]) {
          bySession[l.session_id] = { date: l.logged_at.split('T')[0], maxWeight: l.weight_kg }
        } else {
          bySession[l.session_id].maxWeight = Math.max(bySession[l.session_id].maxWeight, l.weight_kg)
        }
      })

      const data = Object.values(bySession).map(s => ({
        date: s.date.slice(5), // MM-DD
        value: s.maxWeight,
      }))
      setCargaData(data)
    }

    loadCarga()
  }, [selectedExercise, profileId])

  if (!activeProfile) return null

  return (
    <div className="min-h-screen pb-28 pt-safe">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">Evolução</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Peso */}
        <WeightInput
          history={weightHistory}
          todayWeight={todayWeight}
          todayLogId={todayWeightId}
          goalWeight={activeProfile === 'mizael' ? 76 : undefined}
          onSaved={(kg, id) => {
            setTodayWeight(kg)
            setTodayWeightId(id)
            // Atualiza histórico localmente
            const today = getLocalDate().slice(5)
            setWeightHistory(prev => {
              const without = prev.filter(p => p.date !== today)
              return [...without, { date: today, value: kg }].sort((a, b) => a.date.localeCompare(b.date))
            })
          }}
        />

        {/* Streak */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A] flex gap-4">
          <div className="flex-1 text-center">
            <p className="text-3xl font-bold text-white">{streak}</p>
            <p className="text-xs text-[#888] mt-1">🔥 Sequência atual</p>
          </div>
          <div className="w-px bg-[#2A2A2A]" />
          <div className="flex-1 text-center">
            <p className="text-3xl font-bold text-white">{maxStreak}</p>
            <p className="text-xs text-[#888] mt-1">🏆 Melhor sequência</p>
          </div>
        </div>

        {/* Frequency grid */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
          <p className="text-sm font-medium text-white mb-3">Frequência — 28 dias</p>
          <div className="grid grid-cols-7 gap-1">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <p key={i} className="text-center text-[10px] text-[#888] pb-1">{d}</p>
            ))}
            {frequencyGrid.map((day, i) => (
              <div
                key={i}
                className="aspect-square rounded-md"
                style={day.status === 'empty' ? { backgroundColor: 'transparent' } : {
                  backgroundColor:
                    day.status === 'done'   ? '#27AE60' :
                    day.status === 'rest'   ? '#2A2A2A' :
                    '#2D1515',
                  border: `1px solid ${
                    day.status === 'done'   ? '#27AE60' :
                    day.status === 'rest'   ? '#333' :
                    '#E74C3C66'
                  }`,
                }}
                title={day.date}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#27AE60]" /><span className="text-xs text-[#888]">Treino ✓</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#2A2A2A]" /><span className="text-xs text-[#888]">Domingo</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2D1515', border: '1px solid #E74C3C66' }} /><span className="text-xs text-[#888]">Faltou</span></div>
          </div>
        </div>

        {/* Carga por exercício */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
          <p className="text-sm font-medium text-white mb-3">Evolução de Carga</p>
          {exercises.length > 0 ? (
            <>
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                className="w-full bg-[#2A2A2A] text-white text-sm rounded-xl px-3 py-2 mb-3 outline-none border border-[#3A3A3A]"
              >
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <GraficoEvolucao data={cargaData} label="Carga (kg)" unit="kg" color={color} />
            </>
          ) : (
            <p className="text-xs text-[#888] text-center py-4">Complete treinos para ver a evolução de carga.</p>
          )}
        </div>

        {/* Proteína semanal */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
          <p className="text-sm font-medium text-white mb-3">Proteína Semanal</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyProtein} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8 }}
                formatter={(v) => [`${v}g`, 'Proteína']}
              />
              <ReferenceLine y={proteinGoal} stroke="#27AE60" strokeDasharray="4 4" />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#888] text-center mt-1">Linha verde = meta {proteinGoal}g/dia</p>
        </div>

        {/* Exams — Mizael only */}
        {activeProfile === 'mizael' && exams.length > 0 && (
          <ExamProgress exams={exams} onUpdate={() => {
            supabase.from('exam_results').select('*').eq('profile_id', profileId).order('logged_date', { ascending: false })
              .then(({ data }) => {
                const latest: Record<string, any> = {}
                data?.forEach(e => { if (!latest[e.exam_name]) latest[e.exam_name] = e })
                setExams(Object.values(latest))
              })
          }} />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
