'use client'
import { useState, useEffect } from 'react'

interface ExerciseDemoProps {
  url: string
  url2?: string | null
  alt: string
  maxHeight?: number
}

/**
 * Alterna entre 2 frames JPG para simular animação do exercício.
 * Usa crossfade suave de 500ms a cada 1.2s.
 */
export function ExerciseDemo({ url, url2, alt, maxHeight = 200 }: ExerciseDemoProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!url2) return
    setActive(0)
    const t = setInterval(() => setActive(a => (a === 0 ? 1 : 0)), 1200)
    return () => clearInterval(t)
  }, [url, url2])

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-[#111] min-h-[120px]"
      style={{ maxHeight }}
    >
      {/* Frame 0 — determina a altura do container */}
      <img
        src={url}
        alt={alt}
        className={`w-full object-contain transition-opacity duration-500 ${
          active === 1 && url2 ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ maxHeight }}
      />

      {/* Frame 1 — overlay absoluto */}
      {url2 && (
        <img
          src={url2}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            active === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
