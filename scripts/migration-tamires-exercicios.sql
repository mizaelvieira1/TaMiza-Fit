-- =============================================================
-- MIGRAÇÃO: Corrige exercícios de todos os treinos da Tamires
-- Os exercícios do banco estavam errados após renomear os treinos.
-- Este script apaga e reinsere os exercícios corretos por dia da semana.
-- =============================================================

DO $$
DECLARE
  v_tamires_id UUID;
  v_wid        UUID;
BEGIN
  -- Busca o profile_id da Tamires (tenta pelo nome)
  SELECT id INTO v_tamires_id FROM profiles
  WHERE LOWER(name) = 'tamires' LIMIT 1;

  IF v_tamires_id IS NULL THEN
    RAISE EXCEPTION 'Perfil tamires não encontrado. Verifique a coluna "name" na tabela profiles.';
  END IF;

  RAISE NOTICE 'Tamires profile_id: %', v_tamires_id;

  -- ─────────────────────────────────────────────────────────────
  -- SEGUNDA (1) — Superior A: Ombro + Tríceps
  -- ─────────────────────────────────────────────────────────────
  SELECT id INTO v_wid FROM workouts
  WHERE profile_id = v_tamires_id AND day_of_week = 1 LIMIT 1;

  IF v_wid IS NOT NULL THEN
    DELETE FROM exercises WHERE workout_id = v_wid;
    UPDATE workouts SET name = 'Superior A — Ombro + Tríceps', focus = 'Ombro • Tríceps', duration_min = 50
    WHERE id = v_wid;
    INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index) VALUES
      (v_wid, 'Desenvolvimento de ombro sentado com halteres', 3, '10-12', 60, 5.5,  '5-6 kg cada', 1),
      (v_wid, 'Elevação lateral (ombro)',                      3, '12-15', 60, 4.0,  '3-5 kg cada', 2),
      (v_wid, 'Elevação frontal com halteres',                 3, '12-15', 60, 4.0,  '3-5 kg cada', 3),
      (v_wid, 'Face pull na polia',                            3, '15',    60, 0.0,  'Peso leve — essencial para saúde do ombro', 4),
      (v_wid, 'Tríceps na polia',                              3, '12-15', 60, 0.0,  'Ajustar conforme capacidade', 5),
      (v_wid, 'Prancha',                                       3, '20 seg',60, 0.0,  'Aumentar tempo gradualmente', 6);
    RAISE NOTICE 'Segunda OK';
  ELSE
    RAISE NOTICE 'Workout segunda não encontrado';
  END IF;

  -- ─────────────────────────────────────────────────────────────
  -- TERÇA (2) — Inferior A: Pernas
  -- ─────────────────────────────────────────────────────────────
  SELECT id INTO v_wid FROM workouts
  WHERE profile_id = v_tamires_id AND day_of_week = 2 LIMIT 1;

  IF v_wid IS NOT NULL THEN
    DELETE FROM exercises WHERE workout_id = v_wid;
    UPDATE workouts SET name = 'Inferior A — Pernas', focus = 'Quadríceps • Posterior • Glúteo • Panturrilha', duration_min = 50
    WHERE id = v_wid;
    INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index) VALUES
      (v_wid, 'Agachamento com barra',     4, '8-10',          60, 15.0, 'Barra vazia (15 kg) — priorizar técnica', 1),
      (v_wid, 'Cadeira extensora',         3, '12-15',         60,  0.0, 'Ajustar', 2),
      (v_wid, 'Cadeira flexora',           3, '12-15',         60,  0.0, 'Ajustar', 3),
      (v_wid, 'Avanço com halteres',       3, '10 cada perna', 60,  6.0, '5-7 kg cada', 4),
      (v_wid, 'Elevação de panturrilha',   4, '15-20',         60,  0.0, 'Barra ou livre', 5),
      (v_wid, 'Abdominal',                 3, '15',            60,  0.0, 'Sem carga', 6);
    RAISE NOTICE 'Terça OK';
  ELSE
    RAISE NOTICE 'Workout terça não encontrado';
  END IF;

  -- ─────────────────────────────────────────────────────────────
  -- QUARTA (3) — HIIT
  -- ─────────────────────────────────────────────────────────────
  SELECT id INTO v_wid FROM workouts
  WHERE profile_id = v_tamires_id AND day_of_week = 3 LIMIT 1;

  IF v_wid IS NOT NULL THEN
    DELETE FROM exercises WHERE workout_id = v_wid;
    UPDATE workouts SET name = 'HIIT — Cardio Intervalado', focus = 'Queima de Gordura • Resistência', duration_min = 25
    WHERE id = v_wid;
    INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index) VALUES
      (v_wid, 'Aquecimento (bicicleta leve)',                    1, '5 min',   0, 0.0, 'Ritmo muito leve', 1),
      (v_wid, 'Intervalo forte (30 seg) + leve (90 seg)',        8, '8 ciclos',0, 0.0, 'Bicicleta ou elíptico — máximo esforço nos 30s', 2),
      (v_wid, 'Desaceleração',                                   1, '4 min',   0, 0.0, 'Ritmo muito leve', 3);
    RAISE NOTICE 'Quarta OK';
  ELSE
    RAISE NOTICE 'Workout quarta não encontrado';
  END IF;

  -- ─────────────────────────────────────────────────────────────
  -- QUINTA (4) — Superior B: Costas + Bíceps
  -- ─────────────────────────────────────────────────────────────
  SELECT id INTO v_wid FROM workouts
  WHERE profile_id = v_tamires_id AND day_of_week = 4 LIMIT 1;

  IF v_wid IS NOT NULL THEN
    DELETE FROM exercises WHERE workout_id = v_wid;
    UPDATE workouts SET name = 'Superior B — Costas + Bíceps', focus = 'Costas • Bíceps • Ombro Posterior', duration_min = 50
    WHERE id = v_wid;
    INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index) VALUES
      (v_wid, 'Puxada na polia (barra larga)',  4, '10-12', 60,  0.0, 'Ajustar', 1),
      (v_wid, 'Remada com halter apoiado',      3, '10-12', 60,  8.0, '7-9 kg cada', 2),
      (v_wid, 'Remada na polia baixa',          3, '10-12', 60,  0.0, 'Ajustar', 3),
      (v_wid, 'Rosca bíceps com halteres',      3, '10-12', 60,  5.5, '5-6 kg cada', 4),
      (v_wid, 'Rosca martelo',                  3, '10-12', 60,  5.5, '5-6 kg cada', 5),
      (v_wid, 'Face pull na polia',             3, '15',    60,  0.0, 'Peso leve — não pular!', 6);
    RAISE NOTICE 'Quinta OK';
  ELSE
    RAISE NOTICE 'Workout quinta não encontrado';
  END IF;

  -- ─────────────────────────────────────────────────────────────
  -- SEXTA (5) — Inferior B: Pernas Variação
  -- ─────────────────────────────────────────────────────────────
  SELECT id INTO v_wid FROM workouts
  WHERE profile_id = v_tamires_id AND day_of_week = 5 LIMIT 1;

  IF v_wid IS NOT NULL THEN
    DELETE FROM exercises WHERE workout_id = v_wid;
    UPDATE workouts SET name = 'Inferior B — Pernas Variação', focus = 'Posterior • Glúteo • Variação', duration_min = 50
    WHERE id = v_wid;
    INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index) VALUES
      (v_wid, 'Stiff com halteres (posterior)', 4, '10-12',          60,  9.0, '8-10 kg cada', 1),
      (v_wid, 'Agachamento sumo com halter',    3, '12-15',          60, 11.0, '10-12 kg', 2),
      (v_wid, 'Cadeira flexora',                3, '12-15',          60,  0.0, 'Ajustar', 3),
      (v_wid, 'Cadeira extensora',              3, '12-15',          60,  0.0, 'Ajustar', 4),
      (v_wid, 'Elevação de panturrilha',        4, '15-20',          60,  0.0, 'Livre ou barra', 5),
      (v_wid, 'Prancha lateral',                3, '20 seg cada lado',60, 0.0, 'Sem carga', 6);
    RAISE NOTICE 'Sexta OK';
  ELSE
    RAISE NOTICE 'Workout sexta não encontrado';
  END IF;

  -- ─────────────────────────────────────────────────────────────
  -- SÁBADO (6) — Caminhada Leve
  -- ─────────────────────────────────────────────────────────────
  SELECT id INTO v_wid FROM workouts
  WHERE profile_id = v_tamires_id AND day_of_week = 6 LIMIT 1;

  IF v_wid IS NOT NULL THEN
    DELETE FROM exercises WHERE workout_id = v_wid;
    UPDATE workouts SET name = 'Caminhada Leve', focus = 'Recuperação Ativa', duration_min = 25
    WHERE id = v_wid;
    INSERT INTO exercises (workout_id, name, sets, reps, rest_seconds, initial_weight_kg, notes, order_index) VALUES
      (v_wid, 'Caminhada leve', 1, '25 min', 0, 0.0, 'Condomínio ou arredores — sem intensidade', 1);
    RAISE NOTICE 'Sábado OK';
  ELSE
    RAISE NOTICE 'Workout sábado não encontrado';
  END IF;

END $$;

-- ─────────────────────────────────────────────────────────────
-- Verificação: lista todos os exercícios da Tamires por dia
-- ─────────────────────────────────────────────────────────────
SELECT
  w.day_of_week AS dia,
  w.name        AS treino,
  e.order_index AS ordem,
  e.name        AS exercicio,
  e.sets, e.reps, e.rest_seconds AS descanso_s
FROM workouts w
JOIN exercises e ON e.workout_id = w.id
JOIN profiles p  ON p.id = w.profile_id
WHERE LOWER(p.name) = 'tamires'
ORDER BY w.day_of_week, e.order_index;
