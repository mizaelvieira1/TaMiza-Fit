export interface Exercise {
  name: string
  sets: number
  reps: string
  restSeconds: number
  initialWeightKg: number
  notes: string
  exerciseType?: string
}

export interface Treino {
  name: string
  dayOfWeek: number
  type: string
  durationMin: number
  focus: string
  exercises: Exercise[]
}

// Treinos da Tamires — idênticos ao Mizael, sem exercícios de peito.
// Superior A: Ombro + Tríceps (sem supino)
export const TAMIRES_TREINOS: Treino[] = [
  {
    name: "Superior A — Ombro + Tríceps",
    dayOfWeek: 1,
    type: "musculacao",
    durationMin: 50,
    focus: "Ombro • Tríceps",
    exercises: [
      { name: "Desenvolvimento de ombro sentado com halteres", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 5.5, notes: "5-6 kg cada" },
      { name: "Elevação lateral (ombro)", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 4, notes: "3-5 kg cada" },
      { name: "Elevação frontal com halteres", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 4, notes: "3-5 kg cada" },
      { name: "Face pull na polia", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Peso leve — essencial para saúde do ombro" },
      { name: "Tríceps na polia", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar conforme capacidade" },
      { name: "Prancha", sets: 3, reps: "20 seg", restSeconds: 60, initialWeightKg: 0, notes: "Aumentar tempo gradualmente", exerciseType: "prancha" },
    ]
  },
  {
    name: "Inferior A — Pernas",
    dayOfWeek: 2,
    type: "musculacao",
    durationMin: 50,
    focus: "Quadríceps • Posterior • Glúteo • Panturrilha",
    exercises: [
      { name: "Agachamento com barra", sets: 3, reps: "8-10", restSeconds: 60, initialWeightKg: 15, notes: "Barra vazia (15 kg) — priorizar técnica" },
      { name: "Cadeira extensora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Cadeira flexora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Avanço com halteres", sets: 3, reps: "10 cada perna", restSeconds: 60, initialWeightKg: 6, notes: "5-7 kg cada" },
      { name: "Elevação de panturrilha", sets: 3, reps: "15-20", restSeconds: 60, initialWeightKg: 0, notes: "Barra ou livre" },
      { name: "Abdominal", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "abdominal" },
    ]
  },
  {
    name: "HIIT — Cardio Intervalado",
    dayOfWeek: 3,
    type: "hiit",
    durationMin: 25,
    focus: "Queima de Gordura • Resistência",
    exercises: [
      { name: "Aquecimento (bicicleta leve)", sets: 1, reps: "5 min", restSeconds: 0, initialWeightKg: 0, notes: "Ritmo muito leve", exerciseType: "cardio" },
      { name: "Intervalo forte (30 seg) + leve (90 seg)", sets: 8, reps: "8 ciclos", restSeconds: 0, initialWeightKg: 0, notes: "Bicicleta ou elíptico — máximo esforço nos 30s", exerciseType: "cardio" },
      { name: "Desaceleração", sets: 1, reps: "4 min", restSeconds: 0, initialWeightKg: 0, notes: "Ritmo muito leve", exerciseType: "cardio" },
    ]
  },
  {
    name: "Superior B — Costas + Bíceps",
    dayOfWeek: 4,
    type: "musculacao",
    durationMin: 50,
    focus: "Costas • Bíceps • Ombro Posterior",
    exercises: [
      { name: "Puxada na polia (barra larga)", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Remada com halter apoiado", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 8, notes: "7-9 kg cada" },
      { name: "Remada na polia baixa", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Rosca bíceps com halteres", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 5.5, notes: "5-6 kg cada" },
      { name: "Rosca martelo", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 5.5, notes: "5-6 kg cada" },
      { name: "Face pull na polia", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Peso leve — não pular!" },
    ]
  },
  {
    name: "Inferior B — Pernas Variação",
    dayOfWeek: 5,
    type: "musculacao",
    durationMin: 50,
    focus: "Posterior • Glúteo • Variação",
    exercises: [
      { name: "Stiff com halteres (posterior)", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 9, notes: "8-10 kg cada" },
      { name: "Agachamento sumo com halter", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 11, notes: "10-12 kg" },
      { name: "Cadeira flexora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Cadeira extensora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Elevação de panturrilha", sets: 3, reps: "15-20", restSeconds: 60, initialWeightKg: 0, notes: "Livre ou barra" },
      { name: "Prancha lateral", sets: 3, reps: "20 seg cada lado", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "prancha" },
    ]
  },
  {
    name: "Caminhada Leve",
    dayOfWeek: 6,
    type: "cardio",
    durationMin: 25,
    focus: "Recuperação Ativa",
    exercises: [
      { name: "Caminhada leve", sets: 1, reps: "25 min", restSeconds: 0, initialWeightKg: 0, notes: "Condomínio ou arredores — sem intensidade", exerciseType: "cardio" },
    ]
  },
  {
    name: "Descanso Total",
    dayOfWeek: 0,
    type: "descanso",
    durationMin: 0,
    focus: "Recuperação",
    exercises: []
  },
]
