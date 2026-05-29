# TaMiza Fit

PWA de treino e alimentação personalizada para Tamires e Mizael.

---

## Funcionalidades

- **Treinos** — plano semanal personalizado por perfil, séries com contador, descanso cronometrado (funciona com tela bloqueada), GIF de demonstração de cada exercício
- **Sessão de treino** — navegação entre exercícios, registro de carga, histórico de pesos (pré-preenchido da última sessão)
- **Alimentação** — refeições por dia da semana, marcação de refeições concluídas, barra de proteína
- **Água** — tracker com ml/copo editável (salvo por perfil), botões +/−
- **Evolução** — sequência de dias (streak), grid de frequência 28 dias, gráfico de carga por exercício, gráfico de proteína semanal, registro de peso, exames laboratoriais (Mizael)
- **PWA** — instalável no iPhone/Android, funciona offline

---

## Setup Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 3. Rodar em desenvolvimento
npm run dev
# Acesse http://localhost:3000
```

---

## Configuração Supabase

### 1. Criar projeto
- Acesse supabase.com e crie uma conta gratuita
- Crie um novo projeto (free tier)
- Aguarde o setup (~2 min)

### 2. Criar schema
No SQL Editor do Supabase, execute:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  age INTEGER, weight_kg DECIMAL, height_cm DECIMAL,
  goal TEXT, protein_goal_g INTEGER, color_primary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL, day_of_week INTEGER, type TEXT,
  duration_min INTEGER, focus TEXT, order_index INTEGER
);

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id),
  name TEXT NOT NULL, sets INTEGER, reps TEXT,
  rest_seconds INTEGER, initial_weight_kg DECIMAL,
  notes TEXT, exercise_type TEXT, order_index INTEGER
);

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  workout_id UUID REFERENCES workouts(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ, duration_min INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  mood TEXT
);

CREATE TABLE set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id),
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER, weight_kg DECIMAL, reps_done INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  day_type TEXT, meal_name TEXT NOT NULL,
  time_label TEXT, protein_g INTEGER, order_index INTEGER
);

CREATE TABLE meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals(id),
  description TEXT NOT NULL, is_tip BOOLEAN DEFAULT FALSE,
  order_index INTEGER
);

CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  meal_id UUID REFERENCES meals(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  glasses INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  weight_kg DECIMAL NOT NULL
);

CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  exam_name TEXT, value DECIMAL, unit TEXT, goal DECIMAL,
  logged_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE beer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  logged_date DATE DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 0
);
```

### 3. Configurar variáveis
No painel do Supabase: Settings → API
- Copie a Project URL e a anon public key
- Cole no `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Popular dados iniciais
Após rodar `npm run dev`, acesse uma única vez:
```
http://localhost:3000/api/seed
```

---

## Deploy na Vercel

1. Crie repositório no GitHub e faça push
2. Acesse vercel.com e importe o repositório
3. Em Environment Variables, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em Deploy

---

## Instalar no iPhone (PWA)

1. Abra no Safari
2. Toque em Compartilhar (seta para cima)
3. Selecione "Adicionar à Tela de Início"
4. Confirme o nome "TaMiza Fit"

---

## Stack

- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + Auth)
- **Tailwind CSS** — estilização
- **Zustand** — estado global (perfil, sessão de treino, timer)
- **Recharts** — gráficos de evolução
- **next-pwa** — PWA / service worker
- **muscles.wiki** — GIFs de demonstração dos exercícios
