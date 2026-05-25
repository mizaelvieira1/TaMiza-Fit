'use client'
import { useEffect, useRef } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface TimerDescansoProps {
  onComplete: () => void
  /** Duração total do descanso (para barra de progresso). */
  maxSeconds?: number
}

export function TimerDescanso({ onComplete, maxSeconds = 60 }: TimerDescansoProps) {
  const { timerActive, timerSeconds, decrementTimer, stopTimer } = useSessionStore()
  const intervalRef   = useRef<NodeJS.Timeout | null>(null)
  const prevActiveRef = useRef(false)
  const completedRef  = useRef(false)   // evita chamar onComplete duas vezes

  // Tick do timer
  useEffect(() => {
    if (timerActive) {
      completedRef.current = false
      intervalRef.current = setInterval(() => decrementTimer(), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerActive, decrementTimer])

  // Detecta fim natural do timer (transição timerActive: true → false com segundos = 0)
  useEffect(() => {
    const wasActive = prevActiveRef.current
    prevActiveRef.current = timerActive

    if (wasActive && !timerActive && timerSeconds === 0 && !completedRef.current) {
      completedRef.current = true
      playBeep()
      onComplete()
    }
  }, [timerActive, timerSeconds])

  function playBeep() {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch {}
  }

  if (!timerActive && timerSeconds === 0) return null

  const pct = maxSeconds > 0 ? (timerSeconds / maxSeconds) * 100 : 0

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A] mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white">⏳ Descansando</span>
        <button
          onClick={() => { completedRef.current = true; stopTimer(); onComplete() }}
          className="text-xs text-[#888] underline active:text-white"
        >
          Pular
        </button>
      </div>
      <div className="text-4xl font-bold text-center my-3 tabular-nums" style={{ color: '#E67E22' }}>
        {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
      </div>
      <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: '#E67E22' }}
        />
      </div>
    </div>
  )
}
