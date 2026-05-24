import { supabase } from './supabase'
import { TAMIRES_TREINOS } from '../data/tamires/treinos'
import { MIZAEL_TREINOS } from '../data/mizael/treinos'
import { TAMIRES_REFEICOES } from '../data/tamires/alimentacao'
import { MIZAEL_REFEICOES, MIZAEL_EXAMES_INICIAIS } from '../data/mizael/alimentacao'

export async function runSeed() {
  // Create profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .upsert([
      {
        name: 'Tamires',
        age: 28,
        weight_kg: 60,
        height_cm: 165,
        goal: 'Definição muscular e saúde',
        protein_goal_g: 128,
        color_primary: '#E91E8C',
      },
      {
        name: 'Mizael',
        age: 30,
        weight_kg: 85,
        height_cm: 175,
        goal: 'Perda de gordura e saúde metabólica',
        protein_goal_g: 150,
        color_primary: '#FFFFFF',
      },
    ], { onConflict: 'name' })
    .select()

  if (profileError) throw profileError

  const tamiresProfile = profiles?.find(p => p.name === 'Tamires')
  const mizaelProfile = profiles?.find(p => p.name === 'Mizael')

  if (!tamiresProfile || !mizaelProfile) throw new Error('Profiles not created')

  // Seed Tamires workouts
  for (let i = 0; i < TAMIRES_TREINOS.length; i++) {
    const treino = TAMIRES_TREINOS[i]
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        profile_id: tamiresProfile.id,
        name: treino.name,
        day_of_week: treino.dayOfWeek,
        type: treino.type,
        duration_min: treino.durationMin,
        focus: treino.focus,
        order_index: i,
      })
      .select()
      .single()

    if (workoutError) throw workoutError

    for (let j = 0; j < treino.exercises.length; j++) {
      const ex = treino.exercises[j]
      await supabase.from('exercises').insert({
        workout_id: workout.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.restSeconds,
        initial_weight_kg: ex.initialWeightKg,
        notes: ex.notes,
        exercise_type: ex.exerciseType || 'forca',
        order_index: j,
      })
    }
  }

  // Seed Mizael workouts
  for (let i = 0; i < MIZAEL_TREINOS.length; i++) {
    const treino = MIZAEL_TREINOS[i]
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        profile_id: mizaelProfile.id,
        name: treino.name,
        day_of_week: treino.dayOfWeek,
        type: treino.type,
        duration_min: treino.durationMin,
        focus: treino.focus,
        order_index: i,
      })
      .select()
      .single()

    if (workoutError) throw workoutError

    for (let j = 0; j < treino.exercises.length; j++) {
      const ex = treino.exercises[j]
      await supabase.from('exercises').insert({
        workout_id: workout.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.restSeconds,
        initial_weight_kg: ex.initialWeightKg,
        notes: ex.notes,
        exercise_type: ex.exerciseType || 'forca',
        order_index: j,
      })
    }
  }

  // Seed meals for Tamires
  for (const [dayType, meals] of Object.entries(TAMIRES_REFEICOES)) {
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i]
      const { data: mealData, error: mealError } = await supabase
        .from('meals')
        .insert({
          profile_id: tamiresProfile.id,
          day_type: dayType,
          meal_name: meal.name,
          time_label: meal.timeLabel,
          protein_g: meal.proteinG,
          order_index: i,
        })
        .select()
        .single()

      if (mealError) throw mealError

      for (let j = 0; j < meal.items.length; j++) {
        await supabase.from('meal_items').insert({
          meal_id: mealData.id,
          description: meal.items[j],
          is_tip: false,
          order_index: j,
        })
      }

      if (meal.tip) {
        await supabase.from('meal_items').insert({
          meal_id: mealData.id,
          description: meal.tip,
          is_tip: true,
          order_index: meal.items.length,
        })
      }
    }
  }

  // Seed meals for Mizael
  for (const [dayType, meals] of Object.entries(MIZAEL_REFEICOES)) {
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i]
      const { data: mealData, error: mealError } = await supabase
        .from('meals')
        .insert({
          profile_id: mizaelProfile.id,
          day_type: dayType,
          meal_name: meal.name,
          time_label: meal.timeLabel,
          protein_g: meal.proteinG,
          order_index: i,
        })
        .select()
        .single()

      if (mealError) throw mealError

      for (let j = 0; j < meal.items.length; j++) {
        await supabase.from('meal_items').insert({
          meal_id: mealData.id,
          description: meal.items[j],
          is_tip: false,
          order_index: j,
        })
      }

      if (meal.tip) {
        await supabase.from('meal_items').insert({
          meal_id: mealData.id,
          description: meal.tip,
          is_tip: true,
          order_index: meal.items.length,
        })
      }
    }
  }

  // Seed Mizael initial exam results
  for (const exam of MIZAEL_EXAMES_INICIAIS) {
    await supabase.from('exam_results').insert({
      profile_id: mizaelProfile.id,
      exam_name: exam.examName,
      value: exam.value,
      unit: exam.unit,
      goal: exam.goal,
      logged_date: new Date().toISOString().split('T')[0],
    })
  }

  return { tamiresId: tamiresProfile.id, mizaelId: mizaelProfile.id }
}
