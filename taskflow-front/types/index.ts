export interface Tarefa {
  id: string
  titulo: string
  concluida: boolean
  criado_em: string
  tag?: string | null
  concluida_em?: string | null
}
