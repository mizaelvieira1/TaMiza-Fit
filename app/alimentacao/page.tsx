'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import { BottomNav } from '@/components/BottomNav'
import { MealCard } from '@/components/MealCard'
import { WaterTracker } from '@/components/WaterTracker'
import { BeerCounter } from '@/components/BeerCounter'
import { ProteinBar } from '@/components/ProteinBar'
import { TAMIRES_REFEICOES } from '@/data/tamires/alimentacao'
import { MIZAEL_REFEICOES } from '@/data/mizael/alimentacao'
import type { Meal } from '@/data/tamires/alimentacao'

const DAY_TYPE_LABELS: Record<string, string> = {
  semana: 'Seg — Qui',
  sexta: 'Sexta-feira',
  fds: 'Fim de Semana',
}

function getDayType(day: number) {
  if (day === 0 || day === 6) return 'fds'
  if (day === 5) return 'sexta'
  return 'semana'
}

export default function AlimentacaoPage() {
  const router = useRouter()
  const { activeProfile, profileId } = useProfileStore()
  const [dbMeals, setDbMeals] = useState<any[]>([])
  const [mealStatus, setMealStatus] = useState<Record<string, boolean>>({})
  const [proteinConsumed, setProteinConsumed] = useState(0)
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [waterLogId, setWaterLogId] = useState<string | null>(null)
  const [beerCount, setBeerCount] = useState(0)
  const [beerLogId, setBeerLogId] = useState<string | null>(null)
  const [selectedDayType, setSelectedDayType] = useState(getDayType(new Date().getDay()))
  const [loading, setLoading] = useState(true)

  const refeicoes = activeProfile === 'tamires' ? TAMIRES_REFEICOES : MIZAEL_REFEICOES
  const localMeals: Meal[] = refeicoes[selectedDayType] || refeicoes['semana'] || []
  const proteinGoal = activeProfile === 'tamires' ? 128 : 150
  const waterGoal = 10
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  useEffect(() => {
    if (!activeProfile) { router.replace('/'); return }
    if (!profileId) return

    const today = new Date().toISOString().split('T')[0]

    // Load DB meals
    supabase.from('meals').select('id, meal_name, protein_g, day_type, order_index').eq('profile_id', profileId).eq('day_type', selectedDayType).order('order_index')
      .then(async ({ data: meals }) => {
        setDbMeals(meals || [])

        const { data: logs } = await supabase.from('meal_logs').select('meal_id, completed').eq('profile_id', profileId).eq('logged_date', today)
        const status: Record<string, boolean> = {}
        let protein = 0
        meals?.forEach(m => {
          const log = logs?.find(l => l.meal_id === m.id)
          status[m.id] = log?.completed || false
          if (log?.completed) protein += m.protein_g || 0
        })
        setMealStatus(status)
        setProteinConsumed(protein)
        setLoading(false)
      })

    // Load water
    supabase.from('water_logs').select('*').eq('profile_id', profileId).eq('logged_date', today).single()
      .then(({ data }) => {
        if (data) { setWaterGlasses(data.glasses); setWaterLogId(data.id) }
      })

    // Load beer (Mizael only)
    if (activeProfile === 'mizael') {
      supabase.from('beer_logs').select('*').eq('profile_id', profileId).eq('logged_date', today).single()
        .then(({ data }) => {
          if (data) { setBeerCount(data.count); setBeerLogId(data.id) }
        })
    }
  }, [activeProfile, profileId, selectedDayType])

  function handleMealToggle(mealId: string, done: boolean) {
    setMealStatus(prev => ({ ...prev, [mealId]: done }))
    const meal = dbMeals.find(m => m.id === mealId)
    if (meal) {
      setProteinConsumed(prev => done ? prev + meal.protein_g : prev - meal.protein_g)
    }
  }

  if (!activeProfile) return null

  const dayTypes = activeProfile === 'tamires' ? ['semana', 'sexta', 'fds'] : ['semana', 'fds']

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">Alimentação</h1>
      </div>

      {/* Day type selector */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1">
        {dayTypes.map(dt => (
          <button
            key={dt}
            onClick={() => setSelectedDayType(dt)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedDayType === dt ? color : '#1A1A1A',
              color: selectedDayType === dt ? (activeProfile === 'tamires' ? '#fff' : '#000') : '#888',
              border: `1px solid ${selectedDayType === dt ? color : '#2A2A2A'}`,
            }}
          >
            {DAY_TYPE_LABELS[dt]}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        <ProteinBar consumed={proteinConsumed} goal={proteinGoal} />

        {/* Meals from DB or local */}
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin" /></div>
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
              />
            )
          })
        ) : (
          localMeals.map((meal, i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
              <p className="text-sm font-semibold text-white mb-1">{meal.name}</p>
              <p className="text-xs text-[#888]">{meal.timeLabel} • {meal.proteinG}g prot</p>
              <ul className="mt-2 space-y-1">
                {meal.items.map((item, j) => (
                  <li key={j} className="text-xs text-[#aaa] flex gap-2"><span className="text-[#555]">•</span>{item}</li>
                ))}
              </ul>
              {meal.tip && <p className="text-xs mt-2 font-medium" style={{ color }}>💡 {meal.tip}</p>}
            </div>
          ))
        )}

        <WaterTracker glasses={waterGlasses} goal={waterGoal} logId={waterLogId} onUpdate={setWaterGlasses} />

        {activeProfile === 'mizael' && (
          <BeerCounter count={beerCount} logId={beerLogId} onUpdate={setBeerCount} />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
