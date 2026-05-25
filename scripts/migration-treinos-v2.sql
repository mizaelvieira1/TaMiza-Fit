-- =============================================================
-- MIGRAÇÃO: Treinos v2 — Descanso 60s + Treinos da Tamires
-- Rodar no Supabase SQL Editor
-- =============================================================

-- 1. Reduzir descanso para 60s em todos os exercícios de força
UPDATE exercises
SET rest_seconds = 60
WHERE rest_seconds > 0;

-- =============================================================
-- 2. Atualizar treinos da Tamires para coincidir com o Mizael
--    (sem exercícios de peito)
-- =============================================================

-- Renomeia workouts da Tamires para o novo esquema de dias
UPDATE workouts
SET name = 'Superior A — Ombro + Tríceps', focus = 'Ombro • Tríceps'
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
  AND day_of_week = 1;

UPDATE workouts
SET name = 'Inferior A — Pernas', focus = 'Quadríceps • Posterior • Glúteo • Panturrilha'
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
  AND day_of_week = 2;

UPDATE workouts
SET name = 'HIIT — Cardio Intervalado', focus = 'Queima de Gordura • Resistência'
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
  AND day_of_week = 3;

UPDATE workouts
SET name = 'Superior B — Costas + Bíceps', focus = 'Costas • Bíceps • Ombro Posterior'
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
  AND day_of_week = 4;

UPDATE workouts
SET name = 'Inferior B — Pernas Variação', focus = 'Posterior • Glúteo • Variação'
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
  AND day_of_week = 5;

-- =============================================================
-- 3. Remover exercícios de peito do Superior A da Tamires
-- =============================================================

DELETE FROM exercises
WHERE name IN (
  'Supino com halteres (no chão)',
  'Supino inclinado com halteres',
  -- nomes antigos do treino A dela (se existirem):
  'Supino com halteres',
  'Supino inclinado'
)
AND workout_id IN (
  SELECT id FROM workouts
  WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
    AND day_of_week = 1
);

-- =============================================================
-- 4. Adicionar os novos exercícios de ombro/tríceps no Superior A
--    (substitutos dos supinos removidos)
-- =============================================================

-- Pega o workout_id do Superior A da Tamires
DO $$
DECLARE
  v_workout_id UUID;
  v_tamires_id UUID;
  v_max_order  INT;
BEGIN
  SELECT id INTO v_tamires_id FROM profiles WHERE username = 'tamires' LIMIT 1;
  SELECT id INTO v_workout_id FROM workouts
    WHERE profile_id = v_tamires_id AND day_of_week = 1 LIMIT 1;

  IF v_workout_id IS NULL THEN
    RAISE NOTICE 'Workout da Tamires não encontrado — rode o seed primeiro.';
    RETURN;
  END IF;

  SELECT COALESCE(MAX(order_index), 0) INTO v_max_order
  FROM exercises WHERE workout_id = v_workout_id;

  -- Adiciona Elevação Frontal (substitui supino reto)
  INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index)
  VALUES (v_workout_id, 'Elevação frontal com halteres', 3, '12-15', 60, 4, '3-5 kg cada', v_max_order + 1)
  ON CONFLICT DO NOTHING;

  -- Adiciona Face Pull (substitui supino inclinado)
  INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index)
  VALUES (v_workout_id, 'Face pull na polia', 3, '15', 60, 0, 'Peso leve — essencial para saúde do ombro', v_max_order + 2)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Exercícios adicionados ao Superior A da Tamires (workout_id: %)', v_workout_id;
END $$;

-- =============================================================
-- 5. Atualizar Inferior A da Tamires — Agachamento com carga menor
-- =============================================================

UPDATE exercises
SET initial_weight_kg = 15, notes = 'Barra vazia (15 kg) — priorizar técnica'
WHERE name = 'Agachamento com barra'
  AND workout_id IN (
    SELECT id FROM workouts
    WHERE profile_id = (SELECT id FROM profiles WHERE username = 'tamires')
      AND day_of_week = 2
  );

-- =============================================================
-- Verificação final
-- =============================================================
SELECT
  w.name AS treino,
  w.day_of_week,
  e.order_index,
  e.name AS exercicio,
  e.sets,
  e.reps,
  e.rest_seconds
FROM workouts w
JOIN exercises e ON e.workout_id = w.id
JOIN profiles p ON p.id = w.profile_id
WHERE p.username = 'tamires'
ORDER BY w.day_of_week, e.order_index;
