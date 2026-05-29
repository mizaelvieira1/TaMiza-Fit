import type { Meal } from '../tamires/alimentacao'

export const MIZAEL_REFEICOES: Record<string, Meal[]> = {
  semana: [
    {
      name: "Café da Manhã",
      timeLabel: "07:30",
      proteinG: 18,
      items: [
        "2 ovos mexidos ou estrelados no azeite",
        "1 fatia de mussarela",
        "2 fatias de pão integral",
        "1 fruta (banana, maçã ou mamão)",
        "Café sem açúcar",
      ],
      tip: "Opção B nos dias que não der tempo: iogurte grego 200g + 2 col aveia + fruta"
    },
    {
      name: "Almoço",
      timeLabel: "14:00",
      proteinG: 50,
      items: [
        "Proteína grelhada ou assada (frango, carne ou peixe)",
        "Arroz + feijão — METADE do que pegaria normalmente",
        "Salada à vontade — montar PRIMEIRO no prato",
        "Fio de azeite na salada",
      ],
      tip: "Estratégia: encher metade do prato de salada antes de qualquer outra coisa."
    },
    {
      name: "Pré-Treino",
      timeLabel: "17:30",
      proteinG: 7,
      items: [
        "1 fatia de pão de forma integral",
        "1 colher de sopa rasa de pasta de amendoim integral (sem açúcar adicionado)",
        "Alternativa: 1 iogurte grego natural",
      ],
      tip: "Essencial — são 5h desde o almoço até o treino. Sem isso o desempenho cai."
    },
    {
      name: "Treino",
      timeLabel: "19:00-20:00",
      proteinG: 0,
      items: ["Conforme dia da semana — ver aba Treino"],
      tip: ""
    },
    {
      name: "Whey Protein Pós-Treino",
      timeLabel: "20:00",
      proteinG: 27,
      items: [
        "1 scoop de whey protein com água ou leite desnatado",
        "25-30g de proteína por dose",
      ],
      tip: "Tomar IMEDIATAMENTE após o treino — janela anabólica de 2 horas."
    },
    {
      name: "Jantar",
      timeLabel: "20:00-20:30",
      proteinG: 43,
      items: [
        "1 tapioca média",
        "Frango desfiado generoso",
        "1 colher rasa de requeijão",
        "1 fatia de mussarela",
        "Saladinha: tomate, alface, pepino",
      ],
      tip: "Pós-treino: priorizar proteína. Tapioca fornece o carboidrato ideal para recuperação."
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
      ],
      tip: "Fim de semana sem pressa — acorda às 9h, café tranquilo às 9:30h."
    },
    {
      name: "Almoço",
      timeLabel: "13:30",
      proteinG: 35,
      items: [
        "Proteína grelhada ou assada (frango, carne ou peixe)",
        "Arroz + feijão — METADE do habitual",
        "Salada à vontade — montar PRIMEIRO no prato",
        "Fio de azeite",
      ],
      tip: "Estratégia: encher metade do prato de salada antes de qualquer outra coisa."
    },
    {
      name: "Cerveja no Almoço",
      timeLabel: "13:30",
      proteinG: 0,
      items: [
        "Máximo: 1-2 cervejas long neck (350ml cada)",
        "Preferir long neck — menos quantidade por gole",
        "Sempre com comida — nunca em jejum",
        "1 copo de água entre cada cerveja",
        "Evitar petiscos fritos (batata, polenta, linguiça)",
      ],
      tip: "Seu fígado está em recuperação (TGP 124). Máximo 2 cervejas/dia no fim de semana."
    },
    {
      name: "Atividade Física",
      timeLabel: "Tarde",
      proteinG: 0,
      items: [
        "SÁBADO: caminhada leve 25 minutos",
        "DOMINGO: descanso total",
      ],
      tip: "Sem lanche à tarde — o almoço com cerveja já trouxe calorias suficientes."
    },
    {
      name: "Jantar",
      timeLabel: "~20:00",
      proteinG: 30,
      items: [
        "Opção 1: omelete 3 ovos + salada",
        "Opção 2: frango grelhado + legumes refogados",
        "Evitar tapioca — o almoço já tinha carboidrato suficiente",
      ],
      tip: "Jantar leve no fim de semana. Whey opcional."
    },
  ]
}

export const MIZAEL_EXAMES_INICIAIS = [
  { examName: "TGP (Fígado)", value: 124, unit: "U/L", goal: 41 },
  { examName: "HOMA-IR", value: 3.59, unit: "", goal: 2.70 },
  { examName: "LDL", value: 149, unit: "mg/dL", goal: 115 },
  { examName: "HDL", value: 40, unit: "mg/dL", goal: 50 },
  { examName: "Vitamina D", value: 14, unit: "ng/mL", goal: 20 },
  { examName: "Peso", value: 85, unit: "kg", goal: 76 },
]
