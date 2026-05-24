import pg from 'pg'

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'njsorwokkbqdhnnidppe'
const DB_PASSWORD = process.env.DB_PASSWORD || ''

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  age INTEGER,
  weight_kg DECIMAL,
  height_cm DECIMAL,
  goal TEXT,
  protein_goal_g INTEGER,
  color_primary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  day_of_week INTEGER,
  type TEXT,
  duration_min INTEGER,
  focus TEXT,
  order_index INTEGER
);
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id),
  name TEXT NOT NULL,
  sets INTEGER,
  reps TEXT,
  rest_seconds INTEGER,
  initial_weight_kg DECIMAL,
  notes TEXT,
  exercise_type TEXT,
  order_index INTEGER
);
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  workout_id UUID REFERENCES workouts(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_min INTEGER,
  completed BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id),
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER,
  weight_kg DECIMAL,
  reps_done INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  day_type TEXT,
  meal_name TEXT NOT NULL,
  time_label TEXT,
  protein_g INTEGER,
  order_index INTEGER
);
CREATE TABLE IF NOT EXISTS meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals(id),
  description TEXT NOT NULL,
  is_tip BOOLEAN DEFAULT FALSE,
  order_index INTEGER
);
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  meal_id UUID REFERENCES meals(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  glasses INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  exam_name TEXT,
  value DECIMAL,
  unit TEXT,
  goal DECIMAL,
  logged_date DATE DEFAULT CURRENT_DATE
);
CREATE TABLE IF NOT EXISTS beer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 0
);
`

const client = new pg.Client({
  host: `db.${PROJECT_REF}.supabase.co`,
  port: 5432,
  user: 'postgres',
  password: DB_PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
})

console.log('Conectando ao banco Supabase...')
await client.connect()
console.log('Conectado! Criando tabelas...')
await client.query(SCHEMA_SQL)
console.log('Tabelas criadas com sucesso!')
await client.end()
console.log('Pronto — banco configurado.')
