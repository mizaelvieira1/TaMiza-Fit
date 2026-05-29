'use client'
import { useEffect, useState } from 'react'

/** Mapeamento de nomes PT-BR → slug em inglês para muscles.wiki */
const PT_TO_SLUG: Record<string, string> = {
  // Peito
  'Supino com halteres (no chão)':        'dumbbell-floor-press',
  'Supino inclinado com halteres':        'incline-dumbbell-press',
  'Supino com halteres':                  'dumbbell-bench-press',

  // Ombro
  'Desenvolvimento de ombro sentado':              'seated-dumbbell-shoulder-press',
  'Desenvolvimento de ombro sentado com halteres': 'seated-dumbbell-shoulder-press',
  'Elevação lateral (ombro)':             'dumbbell-lateral-raise',
  'Elevação frontal com halteres':        'dumbbell-front-raise',

  // Tríceps
  'Tríceps na polia':                     'cable-tricep-pushdown',

  // Costas
  'Puxada na polia (barra larga)':        'lat-pulldown',
  'Remada com halter apoiado':            'one-arm-dumbbell-row',
  'Remada na polia baixa':                'seated-cable-row',
  'Face pull na polia':                   'cable-face-pull',

  // Bíceps
  'Rosca bíceps com halteres':            'dumbbell-bicep-curl',
  'Rosca martelo':                        'hammer-curl',

  // Pernas
  'Agachamento com barra':                'barbell-back-squat',
  'Agachamento sumo com halter':          'dumbbell-sumo-squat',
  'Cadeira extensora':                    'leg-extension',
  'Cadeira flexora':                      'seated-leg-curl',
  'Avanço com halteres':                  'dumbbell-lunge',
  'Elevação de panturrilha':              'standing-calf-raise',
  'Stiff com halteres (posterior)':       'romanian-deadlift',

  // Core
  'Prancha':                              'plank',
  'Prancha lateral':                      'side-plank',
  'Abdominal':                            'crunch',

  // Cardio
  'Caminhada leve':                       'walking',
  'Aquecimento (bicicleta leve)':         'stationary-bike',
  'Intervalo forte (30 seg) + leve (90 seg)': 'stationary-bike',
  'Desaceleração':                        'stationary-bike',
}

/** Cache em memória para evitar requisições duplicadas */
const gifCache: Record<string, string | null> = {}

/**
 * Retorna a URL do GIF do exercício via muscles.wiki.
 * Retorna null enquanto carrega ou se não encontrar.
 */
export function useExerciseGif(exerciseName: string): string | null {
  const [gifUrl, setGifUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!exerciseName) return

    const slug = PT_TO_SLUG[exerciseName]
    if (!slug) return

    // Checa cache
    if (gifCache[slug] !== undefined) {
      setGifUrl(gifCache[slug])
      return
    }

    // muscles.wiki disponibiliza GIFs em CDN público
    const url = `https://muscles.wiki/wp-content/uploads/${slug}.gif`

    // Verifica se o URL responde antes de exibir
    fetch(url, { method: 'HEAD', cache: 'force-cache' })
      .then(res => {
        const result = res.ok ? url : null
        gifCache[slug] = result
        setGifUrl(result)
      })
      .catch(() => {
        gifCache[slug] = null
        setGifUrl(null)
      })
  }, [exerciseName])

  return gifUrl
}
