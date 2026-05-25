'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import {
  getLocalDate, dateToStr, addDays, isSameDay,
  getDayType, DAY_NAMES, MONTH_NAMES,
} from '@/lib/dateUtils'
import { BottomNav } from '@/components/BottomNav'
import { MealCard } from '@/components/MealCard'
import { WaterTracker } from '@/components/WaterTracker'
import { BeerCounter } from '@/components/BeerCounter'
import { ProteinBar } from '@/components/ProteinBar'
import { TAMIRES_REFEICOES } from '@/data/tamires/alimentacao'
import { MIZAEL_REFEICOES } from '@/data/mizael/alimentacao'
import type { Meal } from '@/data/tamires/alimentacao'

export default function AlimentacaoPage() {
  const router = useRouter()
  const { activeProfile, profileId } = useProfileStore()

  // Data selecionada — começa em hoje
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())

  const [dbMeals, setDbMeals] = useState<any[]>([])
  const [mealStatus, setMealStatus] = useState<Record<string, boolean>>({})
  const [proteinConsumed, setProteinConsumed] = useState(0)
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [waterLogId, setWaterLogId] = useState<string | null>(null)
  const [beerCount, setBeerCount] = useState(0)
  const [beerLogId, setBeerLogId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const isToday = isSameDay(selectedDate, today)
  const isFuture = selectedDate > today && !isToday
  const rawDayType = getDayType(selectedDate.getDay())
  // Mizael não tem plano especial de sexta → usa semana
  const dayType = (activeProfile === 'mizael' && rawDayType === 'sexta') ? 'semana' : rawDayType
  const dateStr = dateToStr(selectedDate)

  const refeicoes = activeProfile === 'tamires' ? TAMIRES_REFEICOES : MIZAEL_REFEICOES
  const localMeals: Meal[] = refeicoes[dayType] || refeicoes['semana'] || []
  const proteinGoal = activeProfile === 'tamires' ? 128 : 150
  const waterGoal = 10
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  // Navegar dias
  function prevDay() {
    setSelectedDate(d => addDays(d, -1))
  }
  function nextDay() {
    if (!isToday) setSelectedDate(d => addDays(d, 1))
  }

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (!profileId) return

    setLoading(true)
    setWaterGlasses(0)
    setWaterLogId(null)
    setBeerCount(0)
    setBeerLogId(null)

    // Refeições do banco para esse tipo de dia
    supabase
      .from('meals')
      .select('id, meal_name, protein_g, day_type, order_index')
      .eq('profile_id', profileId)
      .eq('day_type', dayType)
      .order('order_index')
      .then(async ({ data: meals }) => {
        const uniqueMeals = (meals || []).filter((m: any, idx: number, arr: any[]) =>
          arr.findIndex(x => x.meal_name === m.meal_name) === idx)
        setDbMeals(uniqueMeals)

        // Logs de marcação para a data selecionada
        const { data: logs } = await supabase
          .from('meal_logs')
          .select('meal_id, completed')
          .eq('profile_id', profileId)
          .eq('logged_date', dateStr)

        const status: Record<string, boolean> = {}
        let protein = 0
        uniqueMeals.forEach(m => {
          const log = logs?.find(l => l.meal_id === m.id)
          status[m.id] = log?.completed || false
          if (log?.completed) protein += m.protein_g || 0
        })
        setMealStatus(status)
        setProteinConsumed(protein)
        setLoading(false)
      })

    // Água para a data selecionada
    supabase
      .from('water_logs')
      .select('*')
      .eq('profile_id', profileId)
      .eq('logged_date', dateStr)
      .order('glasses', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) { setWaterGlasses(data[0].glasses); setWaterLogId(data[0].id) }
      })

    // Cervejas para a data selecionada (Mizael)
    if (activeProfile === 'mizael') {
      supabase
        .from('beer_logs')
        .select('*')
        .eq('profile_id', profileId)
        .eq('logged_date', dateStr)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const best = data.reduce((a: any, b: any) => b.count > a.count ? b : a, data[0])
            setBeerCount(best.count)
            setBeerLogId(best.id)
          }
        })
    }
  }, [activeProfile, profileId, dateStr])

  function handleMealToggle(mealId: string, done: boolean) {
    setMealStatus(prev => ({ ...prev, [mealId]: done }))
    const meal = dbMeals.find(m => m.id === mealId)
    if (meal) {
      setProteinConsumed(prev => done ? prev + meal.protein_g : prev - meal.protein_g)
    }
  }

  if (!activeProfile) return null

  // Rótulo do tipo de dia
  const DAY_TYPE_LABEL: Record<string, string> = {
    semana: 'Dia de semana',
    sexta: 'Sexta-feira',
    fds: 'Fim de semana',
  }

  return (
    <div className="min-h-screen pb-28 pt-safe">
      {/* Cabeçalho fixo com navegação de data */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-4">Alimentação</h1>

        {/* Navegador de data */}
        <div className="flex items-center justify-between bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] px-3 py-3">
          <button
            onClick={prevDay}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#2A2A2A] active:scale-90 transition-transform"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>

          <div className="text-center flex-1">
            <p className="text-base font-bold text-white leading-tight">
              {DAY_NAMES[selectedDate.getDay()]}, {selectedDate.getDate()} de {MONTH_NAMES[selectedDate.getMonth()]}
            </p>
            <p className="text-xs mt-0.5" style={{ color: isToday ? color : '#888' }}>
              {isToday ? '● hoje' : DAY_TYPE_LABEL[dayType]}
            </p>
          </div>

          <button
            onClick={nextDay}
            disabled={isToday}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#2A2A2A] active:scale-90 transition-transform disabled:opacity-25"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <ProteinBar consumed={proteinConsumed} goal={proteinGoal} />

        {/* Refeições */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin" />
          </div>
        ) : dbMeals.length > 0 ? (
          dbMeals.map((meal, i) => {
            const localMeal = localMeals[i] || { name: meal.meal_name, timeLabel: '', proteinG: meal.protein_g, items: [], tip: '' }
            return (
              <MealCard
                key={meal.id}
                meal={{ ...localMeal, name: meal.meal_name, proteinG: meal.protein_g }}
                mealId={meal.id}
                completed={mealStatus[meal.id] || false}
                onToggle={handleMealToggle}
                loggedDate={dateStr}
              />
            )
          })
        ) : (
          localMeals.map((meal, i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
              <p className="text-sm font-semibold text-white mb-1">{meal.name}</p>
              <p className="text-xs text-[#888]">{meal.timeLabel} · {meal.proteinG}g prot</p>
              <ul className="mt-2 space-y-1">
                {meal.items.map((item, j) => (
                  <li key={j} className="text-xs text-[#aaa] flex gap-2">
                    <span className="text-[#555]">•</span>{item}
                  </li>
                ))}
              </ul>
              {meal.tip && <p className="text-xs mt-2 font-medium" style={{ color }}>💡 {meal.tip}</p>}
            </div>
          ))
        )}

        <WaterTracker
          glasses={waterGlasses}
          goal={waterGoal}
          logId={waterLogId}
          loggedDate={dateStr}
          onUpdate={setWaterGlasses}
          onUpdateLogId={setWaterLogId}
        />

        {activeProfile === 'mizael' && (
          <BeerCounter
            count={beerCount}
            logId={beerLogId}
            loggedDate={dateStr}
            onUpdate={setBeerCount}
            onUpdateLogId={setBeerLogId}
          />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
