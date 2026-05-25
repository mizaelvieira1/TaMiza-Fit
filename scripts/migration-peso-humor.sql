-- Tabela de registro de peso
CREATE TABLE IF NOT EXISTS weight_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg     DECIMAL(5,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, logged_date)
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weight_logs_all" ON weight_logs FOR ALL USING (true) WITH CHECK (true);

-- Coluna de humor na sessão de treino
ALTER TABLE workout_sessions ADD COLUMN IF NOT EXISTS mood TEXT;
