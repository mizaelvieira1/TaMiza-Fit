'use client'

/**
 * Mapeamento PT-BR → ID do free-exercise-db (GitHub)
 * Imagens: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{ID}/{0|1}.jpg
 * 2 frames por exercício — animados alternando entre eles no componente ExerciseDemo
 */
const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

const PT_TO_ID: Record<string, string> = {
  // Peito
  'Supino com halteres (no chão)':        'Dumbbell_Floor_Press',
  'Supino inclinado com halteres':        'Incline_Dumbbell_Press',
  'Supino com halteres':                  'Dumbbell_Bench_Press',

  // Ombro
  'Desenvolvimento de ombro sentado':              'Arnold_Dumbbell_Press',
  'Desenvolvimento de ombro sentado com halteres': 'Arnold_Dumbbell_Press',
  'Elevação lateral (ombro)':             'Side_Lateral_Raise',
  'Elevação frontal com halteres':        'Front_Dumbbell_Raise',

  // Tríceps
  'Tríceps na polia':                     'Triceps_Pushdown_-_Rope_Attachment',

  // Costas
  'Puxada na polia (barra larga)':        'Wide-Grip_Lat_Pulldown',
  'Remada com halter apoiado':            'Bent_Over_One-Arm_Long_Bar_Row',
  'Remada na polia baixa':                'Seated_Cable_Rows',

  // Bíceps
  'Rosca bíceps com halteres':            'Dumbbell_Bicep_Curl',
  'Rosca martelo':                        'Hammer_Curls',

  // Pernas
  'Agachamento com barra':                'Barbell_Squat',
  'Agachamento sumo com halter':          'Dumbbell_Squat',
  'Cadeira extensora':                    'Leg_Extensions',
  'Cadeira flexora':                      'Seated_Leg_Curl',
  'Avanço com halteres':                  'Dumbbell_Lunges',
  'Elevação de panturrilha':              'Standing_Calf_Raises',
  'Stiff com halteres (posterior)':       'Romanian_Deadlift',

  // Core
  'Prancha':                              'Plank',
  'Prancha lateral':                      'Side_Bridge',
  'Abdominal':                            'Crunches',
}

export interface ExerciseGif {
  url: string | null
  url2: string | null   // segundo frame para animação alternada
  isVideo: boolean
}

/** Retorno síncrono — sem fetch, sem loading state */
export function useExerciseGif(exerciseName: string): ExerciseGif {
  const id = PT_TO_ID[exerciseName]
  if (!id) return { url: null, url2: null, isVideo: false }
  return {
    url:     `${BASE}/${id}/0.jpg`,
    url2:    `${BASE}/${id}/1.jpg`,
    isVideo: false,
  }
}
