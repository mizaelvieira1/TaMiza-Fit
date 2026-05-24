'use client'
import { useProfileStore } from '@/store/profileStore'

interface ProteinBarProps {
  consumed: number
  goal: number
}

export function ProteinBar({ consumed, goal }: ProteinBarProps) {
  const { activeProfile } = useProfileStore()
  const color = activeProfile === 'tamires' ? '#E91E8C' : '#FFFFFF'
  const pct = Math.min(100, Math.round((consumed / goal) * 100))

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white">Proteína</span>
        <span className="text-sm text-[#888]">
          <span className="font-bold text-white">{consumed}g</span> / {goal}g
        </span>
      </div>
      <div className="h-2.5 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-[#888] mt-1">{pct}% da meta diária</p>
    </div>
  )
}
