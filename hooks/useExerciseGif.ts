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

/** Cache client-side para não chamar a API duas vezes */
const clientCache: Record<string, { url: string | null; isVideo: boolean }> = {}

export interface ExerciseGif {
  url: string | null
  isVideo: boolean
}

export function useExerciseGif(exerciseName: string): ExerciseGif {
  const [result, setResult] = useState<ExerciseGif>({ url: null, isVideo: false })

  useEffect(() => {
    if (!exerciseName) return

    const slug = PT_TO_SLUG[exerciseName]
    if (!slug) return

    // Checa cache client
    if (clientCache[slug] !== undefined) {
      setResult(clientCache[slug])
      return
    }

    // Busca via rota server-side (sem CORS, com cache de 24h)
    fetch(`/api/exercise-gif?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then((data: ExerciseGif) => {
        clientCache[slug] = data
        setResult(data)
      })
      .catch(() => {
        clientCache[slug] = { url: null, isVideo: false }
      })
  }, [exerciseName])

  return result
}
