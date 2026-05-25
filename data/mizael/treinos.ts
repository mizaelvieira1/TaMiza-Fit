import type { Treino } from '../tamires/treinos'

export const MIZAEL_TREINOS: Treino[] = [
  {
    name: "Superior A — Peito + Ombro + Tríceps",
    dayOfWeek: 1,
    type: "musculacao",
    durationMin: 50,
    focus: "Peito • Ombro • Tríceps",
    exercises: [
      { name: "Supino com halteres (no chão)", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 7, notes: "6-8 kg cada — descer em 2-3 seg" },
      { name: "Desenvolvimento de ombro sentado", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 5.5, notes: "5-6 kg cada" },
      { name: "Supino inclinado com halteres", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 7, notes: "6-8 kg cada" },
      { name: "Elevação lateral (ombro)", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 4.5, notes: "4-5 kg cada" },
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
      { name: "Agachamento com barra", sets: 4, reps: "8-10", restSeconds: 60, initialWeightKg: 20, notes: "Barra vazia (20kg) — priorizar técnica" },
      { name: "Cadeira extensora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Cadeira flexora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Avanço com halteres", sets: 3, reps: "10 cada perna", restSeconds: 60, initialWeightKg: 7, notes: "6-8 kg cada" },
      { name: "Elevação de panturrilha", sets: 4, reps: "15-20", restSeconds: 60, initialWeightKg: 0, notes: "Barra ou livre" },
      { name: "Abdominal", sets: 3, reps: "15", restSeconds: 60, initialWeightKg: 0, notes: "Sem carga", exerciseType: "abdominal" },
    ]
  },
  {
    name: "HIIT — Cardio Intervalado",
    dayOfWeek: 3,
    type: "hiit",
    durationMin: 25,
    focus: "Queima de Gordura • Resistência Insulínica",
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
      { name: "Puxada na polia (barra larga)", sets: 4, reps: "10-12", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Remada com halter apoiado", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 11, notes: "10-12 kg cada" },
      { name: "Remada na polia baixa", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Rosca bíceps com halteres", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 7.5, notes: "7-8 kg cada" },
      { name: "Rosca martelo", sets: 3, reps: "10-12", restSeconds: 60, initialWeightKg: 7.5, notes: "7-8 kg cada" },
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
      { name: "Stiff com halteres (posterior)", sets: 4, reps: "10-12", restSeconds: 60, initialWeightKg: 11, notes: "10-12 kg cada" },
      { name: "Agachamento sumo com halter", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 13.5, notes: "12-15 kg" },
      { name: "Cadeira flexora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Cadeira extensora", sets: 3, reps: "12-15", restSeconds: 60, initialWeightKg: 0, notes: "Ajustar" },
      { name: "Elevação de panturrilha", sets: 4, reps: "15-20", restSeconds: 60, initialWeightKg: 0, notes: "Livre ou barra" },
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
