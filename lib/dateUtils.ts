/** Retorna a data de hoje no fuso local (YYYY-MM-DD), evitando o offset UTC do toISOString() */
export function getLocalDate(): string {
  return dateToStr(new Date())
}

/** Converte um objeto Date para string YYYY-MM-DD no fuso local */
export function dateToStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

/** Adiciona N dias a uma data (sem mutar o original) */
export function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

/** Verifica se duas datas são o mesmo dia (ignorando hora) */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function getDayType(day: number): string {
  if (day === 0 || day === 6) return 'fds'
  if (day === 5) return 'sexta'
  return 'semana'
}
