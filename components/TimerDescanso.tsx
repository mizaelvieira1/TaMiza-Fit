'use client'
import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface TimerDescansoProps {
  onComplete: () => void
  /** Duração total do descanso (para barra de progresso). */
  maxSeconds?: number
}

export function TimerDescanso({ onComplete, maxSeconds = 60 }: TimerDescansoProps) {
  const { timerActive, timerEndTime, stopTimer } = useSessionStore()
  const [displaySeconds, setDisplaySeconds] = useState(0)
  const intervalRef  = useRef<NodeJS.Timeout | null>(null)
  const completedRef = useRef(false)

  function getRemaining(): number {
    if (!timerEndTime) return 0
    return Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000))
  }

  function handleExpired() {
    if (completedRef.current) return
    completedRef.current = true
    if (intervalRef.current) clearInterval(intervalRef.current)
    stopTimer()
    playBeep()
    onComplete()
  }

  // Timer principal — usa timestamp absoluto: preciso mesmo após tela bloqueada
  useEffect(() => {
    if (timerActive && timerEndTime > 0) {
      completedRef.current = false

      const tick = () => {
        const remaining = getRemaining()
        setDisplaySeconds(remaining)
        if (remaining === 0) handleExpired()
      }

      tick() // tick imediato para exibir valor correto de cara
      intervalRef.current = setInterval(tick, 250) // 4x/s para precisão
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (!timerActive) setDisplaySeconds(0)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerActive, timerEndTime]) // eslint-disable-line

  // Ao desbloquear a tela / retornar ao tab — recalcula imediatamente
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible' && timerActive && timerEndTime > 0) {
        const remaining = getRemaining()
        setDisplaySeconds(remaining)
        if (remaining === 0) handleExpired()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [timerActive, timerEndTime]) // eslint-disable-line

  function playBeep() {
    try {
      const ctx  = new AudioContext()
      const osc  = ctx.createOscillator()
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

  if (!timerActive && displaySeconds === 0) return null

  const pct = maxSeconds > 0 ? (displaySeconds / maxSeconds) * 100 : 0

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
        {String(Math.floor(displaySeconds / 60)).padStart(2, '0')}:{String(displaySeconds % 60).padStart(2, '0')}
      </div>
      <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, backgroundColor: '#E67E22' }}
        />
      </div>
    </div>
  )
}
