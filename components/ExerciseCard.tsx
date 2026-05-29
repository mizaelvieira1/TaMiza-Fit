'use client'
import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { useProgressaoCarga } from '@/hooks/useProgressaoCarga'
import { useExerciseGif } from '@/hooks/useExerciseGif'

interface ExerciseCardProps {
  exerciseId: string
  name: string
  sets: number
  reps: string
  restSeconds?: number
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
  restSeconds,
  notes,
  initialWeightKg,
  completed = false,
  active = false,
  onClick,
}: ExerciseCardProps) {
  const { activeProfile, profileId } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const { shouldIncrease } = useProgressaoCarga(exerciseId, profileId || '')
  const [expanded, setExpanded] = useState(false)

  // Carrega o GIF apenas quando expandido (lazy), mas só quando não há onClick externo
  const gifData = useExerciseGif(!onClick && expanded ? name : '')

  function handleClick() {
    if (onClick) {
      onClick()
    } else {
      setExpanded(s => !s)
    }
  }

  return (
    <div
      className={`w-full bg-[#1A1A1A] rounded-2xl border transition-all ${
        active ? 'border-2' : completed ? 'border-[#27AE60]/40' : 'border-[#2A2A2A]'
      }`}
      style={{ borderColor: active ? color : undefined }}
    >
      {/* Linha principal — clicável */}
      <button
        onClick={handleClick}
        className="w-full text-left p-4 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ backgroundColor: completed ? '#27AE60' : active ? color : '#2A2A2A' }}
          >
            {completed ? (
              <Check size={14} color="#fff" strokeWidth={3} />
            ) : (
              <ChevronRight
                size={14}
                color={active ? '#000' : '#888'}
                style={{
                  transform: !onClick && expanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
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
        {notes && !expanded && (
          <p className="text-xs text-[#555] mt-2 ml-11">{notes}</p>
        )}
      </button>

      {/* Detalhe expandido (apenas quando sem onClick externo) */}
      {!onClick && expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          {/* GIF / vídeo */}
          {gifData.url ? (
            <div className="rounded-xl overflow-hidden mt-3 bg-[#111]" style={{ maxHeight: 200 }}>
              {gifData.isVideo ? (
                <video
                  src={gifData.url}
                  autoPlay loop muted playsInline
                  className="w-full object-contain"
                  style={{ maxHeight: 200 }}
                />
              ) : (
                <img
                  src={gifData.url}
                  alt={name}
                  className="w-full object-contain"
                  style={{ maxHeight: 200 }}
                />
              )}
            </div>
          ) : (
            <div className="mt-3 h-10 flex items-center justify-center">
              <p className="text-xs text-[#444]">Sem demonstração disponível</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center bg-[#2A2A2A] rounded-xl py-2 px-1">
              <p className="text-base font-bold text-white">{sets}</p>
              <p className="text-[10px] text-[#888]">Séries</p>
            </div>
            <div className="text-center bg-[#2A2A2A] rounded-xl py-2 px-1">
              <p className="text-base font-bold text-white">{reps}</p>
              <p className="text-[10px] text-[#888]">Reps</p>
            </div>
            <div className="text-center bg-[#2A2A2A] rounded-xl py-2 px-1">
              <p className="text-base font-bold text-white">
                {restSeconds ? `${restSeconds}s` : '—'}
              </p>
              <p className="text-[10px] text-[#888]">Descanso</p>
            </div>
          </div>

          {notes && <p className="text-xs text-[#666] mt-3">{notes}</p>}
          {initialWeightKg > 0 && (
            <p className="text-xs text-[#444] mt-1">Carga inicial: {initialWeightKg}kg</p>
          )}
        </div>
      )}
    </div>
  )
}
