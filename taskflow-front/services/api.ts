import { Tarefa } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

// Erro sinalizando sessao expirada/invalida (o wrapper ja redirecionou).
export const SESSAO_EXPIRADA = "SESSAO_EXPIRADA"

function encerrarSessao() {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("user_email")
  // hard redirect: limpa o estado da SPA e leva pro login
  window.location.href = "/login?sessao=expirada"
}

// fetch autenticado: injeta o token e trata 401 de forma centralizada
async function apiFetch(caminho: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })
  if (resposta.status === 401) {
    encerrarSessao()
    throw new Error(SESSAO_EXPIRADA)
  }
  return resposta
}

export async function buscarTarefas(): Promise<Tarefa[]> {
  const resposta = await apiFetch("/tarefas/")
  if (!resposta.ok) {
    throw new Error("Erro ao buscar tarefas")
  }
  return resposta.json()
}

export async function criarTarefa(titulo: string, tag?: string): Promise<Tarefa> {
  const corpo: { titulo: string; tag?: string } = { titulo }
  if (tag) corpo.tag = tag
  const resposta = await apiFetch("/tarefas/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  })
  if (!resposta.ok) {
    throw new Error("Erro ao criar tarefa")
  }
  return resposta.json()
}

export async function atualizarTarefa(id: string, concluida: boolean): Promise<Tarefa> {
  const resposta = await apiFetch(`/tarefas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida }),
  })
  if (!resposta.ok) {
    throw new Error("Erro ao atualizar tarefa")
  }
  return resposta.json()
}

export async function deletarTarefa(id: string): Promise<void> {
  const resposta = await apiFetch(`/tarefas/${id}`, { method: "DELETE" })
  if (!resposta.ok) {
    throw new Error("Erro ao deletar tarefa")
  }
}

export async function registrar(email: string, senha: string) {
  const resposta = await fetch(`${API_URL}/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  })
  if (!resposta.ok) {
    throw new Error("Erro ao registrar usuário")
  }
  return resposta.json()
}

export async function login(email: string, senha: string) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  })
  if (!resposta.ok) {
    throw new Error("Email ou senha incorretos")
  }
  return resposta.json()
}
