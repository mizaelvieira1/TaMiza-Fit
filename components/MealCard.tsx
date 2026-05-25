'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfileStore } from '@/store/profileStore'
import type { Meal } from '@/data/tamires/alimentacao'
import { getLocalDate } from '@/lib/dateUtils'

interface MealCardProps {
  meal: Meal
  mealId: string
  completed: boolean
  onToggle: (mealId: string, completed: boolean) => void
}

export function MealCard({ meal, mealId, completed, onToggle }: MealCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { profileId, activeProfile } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'

  async function toggle() {
    if (!profileId) return
    const today = getLocalDate()
    const newCompleted = !completed

    const { data: existing } = await supabase
      .from('meal_logs')
      .select('id')
      .eq('profile_id', profileId)
      .eq('meal_id', mealId)
      .eq('logged_date', today)
      .single()

    if (existing) {
      await supabase.from('meal_logs').update({ completed: newCompleted }).eq('id', existing.id)
    } else {
      await supabase.from('meal_logs').insert({ profile_id: profileId, meal_id: mealId, logged_date: today, completed: newCompleted })
    }
    onToggle(mealId, newCompleted)
  }

  return (
    <div className={`bg-[#1A1A1A] rounded-2xl border transition-all ${completed ? 'border-[#27AE60]/40' : 'border-[#2A2A2A]'}`}>
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={toggle}
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{ borderColor: completed ? '#27AE60' : '#444', backgroundColor: completed ? '#27AE60' : 'transparent' }}
        >
          {completed && <Check size={12} color="#fff" strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0" onClick={() => setExpanded(e => !e)}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-white">{meal.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888]">{meal.timeLabel}</span>
              {meal.proteinG > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#2A2A2A]" style={{ color }}>
                  {meal.proteinG}g prot
                </span>
              )}
              {expanded ? <ChevronUp size={14} className="text-[#888]" /> : <ChevronDown size={14} className="text-[#888]" />}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <ul className="space-y-1.5 mb-3">
            {meal.items.map((item, i) => (
              <li key={i} className="text-xs text-[#aaa] flex gap-2">
                <span className="text-[#555] mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {meal.tip && (
            <div className="bg-[#2A2A2A] rounded-xl p-3">
              <p className="text-xs font-medium" style={{ color }}>💡 {meal.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
