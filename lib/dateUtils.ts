/** Retorna a data de hoje no fuso local (YYYY-MM-DD), evitando o offset UTC do toISOString() */
export function getLocalDate(): string {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

export const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function getDayType(day: number): string {
  if (day === 0 || day === 6) return 'fds'
  if (day === 5) return 'sexta'
  return 'semana'
}
