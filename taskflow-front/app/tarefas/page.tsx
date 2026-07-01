"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"
import ProgressBar from "@/components/ProgressBar"
import FilterChips, { Filtro } from "@/components/FilterChips"
import FormTarefa from "@/components/FormTarefa"
import TarefaCard from "@/components/TarefaCard"
import ConfirmDialog from "@/components/ConfirmDialog"
import Otto from "@/components/Otto"
import { useToast } from "@/components/providers/ToastProvider"
import { buscarTarefas, criarTarefa, atualizarTarefa, deletarTarefa } from "@/services/api"
import { Tarefa } from "@/types"

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [novoTitulo, setNovoTitulo] = useState("")
  const [filtro, setFiltro] = useState<Filtro>("todas")
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { showToast } = useToast()
  const router = useRouter()

  async function carregarTarefas() {
    try {
      setTarefas(await buscarTarefas())
    } catch {
      setTarefas([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.replace("/login")
      return
    }
    let ativo = true
    buscarTarefas()
      .then((d) => ativo && setTarefas(d))
      .catch(() => ativo && setTarefas([]))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [router])

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    if (!novoTitulo.trim()) return
    await criarTarefa(novoTitulo.trim())
    setNovoTitulo("")
    await carregarTarefas()
    showToast("Tarefa adicionada.")
  }

  async function handleAlternar(id: string, concluida: boolean) {
    await atualizarTarefa(id, concluida)
    carregarTarefas()
  }

  async function handleConfirmDelete() {
    if (!confirmId) return
    await deletarTarefa(confirmId)
    setConfirmId(null)
    await carregarTarefas()
    showToast("Tarefa removida")
  }

  const total = tarefas.length
  const feitas = tarefas.filter((t) => t.concluida).length
  const pct = total ? Math.round((feitas / total) * 100) : 0
  const visiveis = tarefas.filter((t) =>
    filtro === "todas" ? true : filtro === "pendentes" ? !t.concluida : t.concluida,
  )

  if (carregando) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "50%", border: "4px solid var(--warm2)", borderTopColor: "var(--terra)", animation: "spin .9s linear infinite" }} />
          <span style={{ font: "500 14px var(--font-jetbrains)", color: "var(--muted)" }}>Organizando seu dia…</span>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page)" }}>
      <div style={{ width: "100%", maxWidth: "600px", position: "relative" }}>
        <div style={{ position: "absolute", right: "-46px", top: "120px", width: "30px", height: "30px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f0c089,var(--terra))", boxShadow: "inset -3px -3px 6px #00000033", animation: "yarnRoll 3.2s ease-in-out infinite" }} />

        <div style={{ background: "var(--surf)", border: "1px solid var(--warm)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 30px 70px -38px var(--shadow)" }}>
          <NavBar mostrarAvatar />
          <div style={{ padding: "26px 24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
              <h2 style={{ font: "700 24px var(--font-space-grotesk)", color: "var(--ink)", margin: 0, letterSpacing: "-.02em" }}>Hoje</h2>
              <span style={{ font: "500 13px var(--font-jetbrains)", color: "var(--muted)" }}>{feitas} / {total} feitas</span>
            </div>
            <ProgressBar pct={pct} />
            <FormTarefa valor={novoTitulo} onChange={setNovoTitulo} onSubmit={handleCriar} />
            <FilterChips filtro={filtro} onChange={setFiltro} />

            {visiveis.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {visiveis.map((t) => (
                  <TarefaCard key={t.id} tarefa={t} aoAlternar={handleAlternar} aoPedirDelete={setConfirmId} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "18px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ animation: "floatY 4.5s ease-in-out infinite", marginBottom: "14px" }}><Otto /></div>
                <h3 style={{ font: "700 20px var(--font-space-grotesk)", color: "var(--ink)", margin: "0 0 8px" }}>Nada por aqui ainda.</h3>
                <p style={{ font: "400 15px/1.5 var(--font-jakarta)", color: "var(--muted)", margin: 0, maxWidth: "320px" }}>Adicione sua primeira tarefa — o Otto cuida de manter tudo em ordem.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog aberto={confirmId !== null} onCancel={() => setConfirmId(null)} onConfirm={handleConfirmDelete} />
    </main>
  )
}
