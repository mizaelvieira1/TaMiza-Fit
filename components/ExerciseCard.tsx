'use client'
import { Check, ChevronRight } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { useProgressaoCarga } from '@/hooks/useProgressaoCarga'

interface ExerciseCardProps {
  exerciseId: string
  name: string
  sets: number
  reps: string
  notes: string
  initialWeightKg: number
  completed?: boolean
  active?: boolean
  onClick?: () => void
}

export function ExerciseCard({
  exerciseId,
  name,
  sets,
  reps,
  notes,
  initialWeightKg,
  completed = false,
  active = false,
  onClick,
}: ExerciseCardProps) {
  const { activeProfile, profileId } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const { shouldIncrease } = useProgressaoCarga(exerciseId, profileId || '')

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-[#1A1A1A] rounded-2xl p-4 border transition-all active:scale-[0.98] ${
        active ? 'border-2' : completed ? 'border-[#27AE60]/40' : 'border-[#2A2A2A]'
      }`}
      style={{ borderColor: active ? color : undefined }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: completed ? '#27AE60' : active ? color : '#2A2A2A' }}
        >
          {completed ? (
            <Check size={14} color="#fff" strokeWidth={3} />
          ) : (
            <ChevronRight size={14} color={active ? '#000' : '#888'} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-[#888]">
            {sets} séries • {reps} reps
            {initialWeightKg > 0 && ` • ${initialWeightKg}kg`}
          </p>
        </div>
        {shouldIncrease && (
          <span className="text-xs px-2 py-1 rounded-full bg-[#27AE60]/20 text-[#27AE60] font-medium flex-shrink-0">
            +carga!
          </span>
        )}
      </div>
      {notes && (
        <p className="text-xs text-[#555] mt-2 ml-11">{notes}</p>
      )}
    </button>
  )
}
