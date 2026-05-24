export interface MealItem {
  description: string
  isTip?: boolean
}

export interface Meal {
  name: string
  timeLabel: string
  proteinG: number
  items: string[]
  tip?: string
}

export const TAMIRES_REFEICOES: Record<string, Meal[]> = {
  semana: [
    {
      name: "Café da Manhã",
      timeLabel: "06:30-07:00",
      proteinG: 21,
      items: [
        "3 ovos mexidos ou fritos no azeite (aumentar de 2 para 3)",
        "1 fatia de pão de forma integral",
        "1 fruta in natura: banana, maçã ou mamão",
        "Café sem açúcar",
        "Creatina: 3-5g misturada com água",
      ],
      tip: "Troque o suco pela fruta in natura — mais fibras, menos açúcar"
    },
    {
      name: "Almoço",
      timeLabel: "12:00",
      proteinG: 30,
      items: [
        "Marmita Live Up — preferir frango, peixe ou carne + legumes",
        "Meta: ≥25g proteína por embalagem (verificar rótulo)",
        "Adicionar salada crua se possível",
      ],
      tip: "Prefira sabores com proteína magra. Verifique sempre o rótulo."
    },
    {
      name: "Lanche da Tarde",
      timeLabel: "15:00-16:00",
      proteinG: 20,
      items: [
        "Iogurte grego natural 200g",
        "OU 1 scoop de whey protein com água ou leite desnatado",
      ],
      tip: "A empanada de frango tem muito carboidrato refinado. Iogurte tem o dobro de proteína."
    },
    {
      name: "Jantar",
      timeLabel: "20:00-20:30",
      proteinG: 30,
      items: [
        "1 tapioca média OU crepioca (tapioca + 1-2 ovos batidos — preferir!)",
        "Frango desfiado generoso (100-150g)",
        "1 colher de requeijão light ou cream cheese light",
        "Saladinha: tomate, alface, pepino, cenoura",
      ],
      tip: "Crepioca = tapioca + 1-2 ovos na goma. Dobra a proteína da refeição!"
    },
  ],
  sexta: [
    {
      name: "Café da Manhã",
      timeLabel: "06:30-07:00",
      proteinG: 21,
      items: [
        "3 ovos mexidos ou fritos no azeite",
        "1 fatia de pão de forma integral",
        "1 fruta in natura",
        "Café sem açúcar",
        "Creatina: 3-5g",
      ],
      tip: "Mesmo café da semana"
    },
    {
      name: "Almoço",
      timeLabel: "12:00",
      proteinG: 30,
      items: [
        "Marmita Live Up — preferir frango, peixe ou carne + legumes",
        "Meta: ≥25g proteína por embalagem",
      ],
      tip: "Mesmo almoço da semana"
    },
    {
      name: "Lanche da Tarde",
      timeLabel: "15:00-16:00",
      proteinG: 20,
      items: [
        "Iogurte grego natural 200g",
        "OU 1 scoop de whey protein",
      ],
      tip: ""
    },
    {
      name: "Jantar — iFood",
      timeLabel: "20:00",
      proteinG: 25,
      items: [
        "Pizza: 2 fatias proteicas (frango, atum, mussarela) — sem borda recheada",
        "Hambúrguer: sem batata frita ou trocar por salada — pedir ovo extra",
        "Japonesa: sashimi, temaki de salmão — evitar hot-roll frito",
        "Dica geral: beber 1 copo de água antes de comer",
      ],
      tip: "Sexta sustentável — faça escolhas inteligentes dentro do que você quer."
    },
  ],
  fds: [
    {
      name: "Café da Manhã",
      timeLabel: "09:30",
      proteinG: 15,
      items: [
        "Iogurte grego natural 200g",
        "2 colheres de aveia",
        "1 fruta",
        "Café sem açúcar",
        "Creatina: 3-5g",
      ],
      tip: "Fim de semana sem pressa — café tranquilo."
    },
    {
      name: "Almoço",
      timeLabel: "13:30",
      proteinG: 30,
      items: [
        "Proteína grelhada ou assada (frango, carne ou peixe)",
        "Arroz + feijão — metade do habitual",
        "Salada à vontade — montar PRIMEIRO no prato",
        "Fio de azeite",
      ],
      tip: "Encher metade do prato de salada antes de qualquer outra coisa."
    },
    {
      name: "Jantar",
      timeLabel: "~20:00",
      proteinG: 25,
      items: [
        "Crepioca (2 ovos + goma) + frango desfiado + salada",
        "OU omelete 3 ovos + legumes refogados",
        "Evitar pizza ou hambúrguer no jantar se já pediu iFood na sexta",
      ],
      tip: "Jantar leve no fim de semana."
    },
  ]
}

export const TAMIRES_FRASES = [
  "Consistência bate perfeição todos os dias.",
  "Você não precisa ser perfeita. Só precisa aparecer.",
  "Cada série conta. Cada refeição importa. Cada dia te aproxima.",
  "O corpo que você quer está sendo construído hoje.",
  "Força não é ausência de dificuldade. É continuar mesmo assim.",
  "Resultados chegam para quem não para.",
  "Você já fez as partes difíceis. Agora colha.",
  "Seu futuro eu vai agradecer sua consistência hoje.",
  "Treinar não é punição — é o maior presente que você se dá.",
  "Uma série por vez. Um dia por vez. Uma semana por vez.",
  "Progresso, não perfeição.",
  "Você é mais forte do que imagina.",
  "Cuidar de você mesma não é egoísmo — é necessidade.",
  "Cada kg a mais na barra é uma versão melhor de você.",
  "O treino de hoje é o investimento do amanhã.",
  "Você não treina para se punir. Você treina para se cuidar.",
  "Comece. O resto vem depois.",
  "O único treino ruim é o que não aconteceu.",
  "Seus objetivos estão esperando do outro lado do esforço.",
  "Foco. Consistência. Resultado.",
  "Cada dia é uma nova chance de ser melhor.",
  "Você está mais próxima do que pensa.",
  "O processo é tão importante quanto o resultado.",
  "Ninguém arrependeu de um treino que fez.",
  "Pequenas vitórias diárias constroem grandes transformações.",
  "Seu corpo pode. Sua mente decide.",
  "Aqui não tem atalho. Só dedicação.",
  "O descanso faz parte do plano. O abandono não.",
  "Você escolheu se cuidar. Isso já é a maior vitória.",
  "Hoje é treino. E amanhã também. E isso é poderoso.",
]
