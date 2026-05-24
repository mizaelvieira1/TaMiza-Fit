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

export const TAMIRES_TREINOS: Treino[] = [
  {
    name: "Treino A — Costas + Bíceps",
    dayOfWeek: 1,
    type: "musculacao",
    durationMin: 50,
    focus: "Costas • Bíceps",
    exercises: [
      { name: "Puxada alta na polia (barra larga)", sets: 4, reps: "10-12", restSeconds: 120, initialWeightKg: 0, notes: "Ajustar conforme capacidade" },
      { name: "Puxada frente na polia (triângulo)", sets: 3, reps: "10-12", restSeconds: 120, initialWeightKg: 0, notes: "Cavalinho" },
      { name: "Remada sentada na polia baixa", sets: 3, reps: "10-12", restSeconds: 90, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Remada unilateral com halter", sets: 3, reps: "10-12", restSeconds: 90, initialWeightKg: 7, notes: "6-8 kg cada lado" },
      { name: "Rosca direta com halteres", sets: 3, reps: "10-12", restSeconds: 90, initialWeightKg: 6, notes: "5-7 kg cada" },
      { name: "Rosca martelo alternada", sets: 3, reps: "10-12", restSeconds: 90, initialWeightKg: 6, notes: "5-7 kg cada" },
      { name: "Abdominal", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "abdominal" },
    ]
  },
  {
    name: "Treino B — Ombro + Tríceps",
    dayOfWeek: 4,
    type: "musculacao",
    durationMin: 50,
    focus: "Ombro • Tríceps",
    exercises: [
      { name: "Desenvolvimento de ombro sentado com halteres", sets: 4, reps: "10-12", restSeconds: 120, initialWeightKg: 5.5, notes: "5-6 kg cada" },
      { name: "Elevação lateral com halteres", sets: 3, reps: "12-15", restSeconds: 90, initialWeightKg: 4, notes: "3-5 kg cada" },
      { name: "Elevação frontal com halteres", sets: 3, reps: "12-15", restSeconds: 90, initialWeightKg: 4, notes: "3-5 kg cada" },
      { name: "Face pull na polia com corda", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Peso leve — essencial para saúde do ombro" },
      { name: "Tríceps na polia (corda ou barra)", sets: 3, reps: "12-15", restSeconds: 90, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Tríceps francês com halter", sets: 3, reps: "10-12", restSeconds: 90, initialWeightKg: 5.5, notes: "5-6 kg" },
      { name: "Prancha frontal", sets: 3, reps: "25 seg", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "prancha" },
    ]
  },
  {
    name: "Treino C — Quadríceps + Panturrilha",
    dayOfWeek: 2,
    type: "musculacao",
    durationMin: 50,
    focus: "Quadríceps • Panturrilha",
    exercises: [
      { name: "Agachamento livre com halteres ou barra", sets: 4, reps: "10-12", restSeconds: 120, initialWeightKg: 12.5, notes: "Barra vazia 10-15 kg — priorizar técnica" },
      { name: "Cadeira extensora", sets: 3, reps: "12-15", restSeconds: 90, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Avanço com halteres (afundo)", sets: 3, reps: "10 cada perna", restSeconds: 120, initialWeightKg: 6.5, notes: "5-8 kg cada" },
      { name: "Agachamento sumo com halter", sets: 3, reps: "12-15", restSeconds: 90, initialWeightKg: 11, notes: "10-12 kg" },
      { name: "Elevação de panturrilha unilateral", sets: 4, reps: "15-20", restSeconds: 60, initialWeightKg: 0, notes: "Livre ou halter" },
      { name: "Abdominal bicicleta", sets: 3, reps: "20", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "abdominal" },
    ]
  },
  {
    name: "Treino D — Posterior + Glúteo",
    dayOfWeek: 5,
    type: "musculacao",
    durationMin: 50,
    focus: "Posterior • Glúteo",
    exercises: [
      { name: "Stiff com halteres (posterior de coxa)", sets: 4, reps: "10-12", restSeconds: 120, initialWeightKg: 10, notes: "8-12 kg cada" },
      { name: "Cadeira flexora", sets: 3, reps: "12-15", restSeconds: 90, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Hip thrust com halter ou barra", sets: 4, reps: "12-15", restSeconds: 90, initialWeightKg: 12.5, notes: "10-15 kg — melhor exercício para glúteo" },
      { name: "Avanço reverso com halteres", sets: 3, reps: "10 cada perna", restSeconds: 120, initialWeightKg: 6.5, notes: "5-8 kg cada" },
      { name: "Abdução de quadril (máquina ou elástico)", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Prancha lateral", sets: 3, reps: "20 seg cada lado", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "prancha" },
    ]
  },
  {
    name: "Cardio — Corrida Progressiva",
    dayOfWeek: 3,
    type: "cardio",
    durationMin: 25,
    focus: "Resistência Cardiovascular",
    exercises: [
      { name: "Aquecimento — caminhada 5-6 km/h", sets: 1, reps: "5 min", restSeconds: 0, initialWeightKg: 0, notes: "Respiração tranquila", exerciseType: "cardio" },
      { name: "Corrida leve — trote 8-9 km/h", sets: 1, reps: "5-8 min", restSeconds: 0, initialWeightKg: 0, notes: "Conversa possível", exerciseType: "cardio" },
      { name: "Intervalo — caminhada 4-5 km/h", sets: 1, reps: "3 min", restSeconds: 0, initialWeightKg: 0, notes: "Recuperar o fôlego", exerciseType: "cardio" },
      { name: "Corrida moderada — 9-10 km/h", sets: 1, reps: "5-8 min", restSeconds: 0, initialWeightKg: 0, notes: "Ligeiramente ofegante", exerciseType: "cardio" },
      { name: "Desaceleração — caminhada 4-5 km/h", sets: 1, reps: "5 min", restSeconds: 0, initialWeightKg: 0, notes: "Retorno calmo", exerciseType: "cardio" },
    ]
  },
  {
    name: "Caminhada de Recuperação",
    dayOfWeek: 6,
    type: "cardio",
    durationMin: 25,
    focus: "Recuperação Ativa",
    exercises: [
      { name: "Caminhada leve", sets: 1, reps: "20-25 min", restSeconds: 0, initialWeightKg: 0, notes: "Ritmo confortável — condomínio, calçada ou parque", exerciseType: "cardio" },
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
