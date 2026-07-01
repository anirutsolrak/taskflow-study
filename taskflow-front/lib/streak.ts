/**
 * Numero de dias consecutivos (data local) terminando hoje ou ontem
 * com ao menos uma conclusao. `datas` sao timestamps ISO de conclusao.
 */
export function calcularStreak(
  datas: (string | null | undefined)[],
  hoje: Date = new Date(),
): number {
  const chave = (dt: Date) => `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`
  const dias = new Set(
    datas.filter(Boolean).map((s) => chave(new Date(s as string))),
  )
  if (dias.size === 0) return 0

  const cursor = new Date(hoje)
  if (!dias.has(chave(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dias.has(chave(cursor))) return 0
  }

  let n = 0
  while (dias.has(chave(cursor))) {
    n++
    cursor.setDate(cursor.getDate() - 1)
  }
  return n
}
