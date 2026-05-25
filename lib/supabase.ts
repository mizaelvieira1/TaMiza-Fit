import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  name: string
  age: number
  weight_kg: number
  height_cm: number
  goal: string
  protein_goal_g: number
  color_primary: string
  created_at: string
}

export type Workout = {
  id: string
  profile_id: string
  name: string
  day_of_week: number
  type: string
  duration_min: number
  focus: string
  order_index: number
}

export type Exercise = {
  id: string
  workout_id: string
  name: string
  sets: number
  reps: string
  rest_seconds: number
  initial_weight_kg: number
  notes: string
  exercise_type: string
  order_index: number
}

export type WorkoutSession = {
  id: string
  profile_id: string
  workout_id: string
  started_at: string
  finished_at: string | null
  duration_min: number | null
  completed: boolean
}

export type SetLog = {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  weight_kg: number
  reps_done: number
  completed: boolean
  logged_at: string
}

export type Meal = {
  id: string
  profile_id: string
  day_type: string
  meal_name: string
  time_label: string
  protein_g: number
  order_index: number
}

export type MealLog = {
  id: string
  profile_id: string
  meal_id: string
  logged_date: string
  completed: boolean
  logged_at: string
}

export type WaterLog = {
  id: string
  profile_id: string
  logged_date: string
  glasses: number
  updated_at: string
}

export type ExamResult = {
  id: string
  profile_id: string
  exam_name: string
  value: number
  unit: string
  goal: number
  logged_date: string
}

export type BeerLog = {
  id: string
  profile_id: string
  logged_date: string
  count: number
}
