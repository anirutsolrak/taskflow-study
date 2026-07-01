"use client"

import { useState } from "react"
import { Tarefa } from "@/types"

interface TarefaCardProps {
  tarefa: Tarefa
  aoAlternar: (id: string, concluida: boolean) => void
  aoEditar: (id: string, titulo: string) => void
  aoPedirDelete: (id: string) => void
}

const acao: React.CSSProperties = {
  color: "var(--faint)",
  cursor: "pointer",
  lineHeight: 1,
  transition: "color .15s ease",
}

export default function TarefaCard({ tarefa, aoAlternar, aoEditar, aoPedirDelete }: TarefaCardProps) {
  const { concluida } = tarefa
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState(tarefa.titulo)

  function iniciarEdicao() {
    setRascunho(tarefa.titulo)
    setEditando(true)
  }
  function salvar() {
    const limpo = rascunho.trim()
    setEditando(false)
    if (limpo && limpo !== tarefa.titulo) aoEditar(tarefa.id, limpo)
  }
  function cancelar() {
    setRascunho(tarefa.titulo)
    setEditando(false)
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "13px", background: "var(--card)", border: "1px solid var(--warm2)", borderRadius: "13px", padding: "14px 15px" }}>
      {concluida ? (
        <div onClick={() => aoAlternar(tarefa.id, false)} style={{ width: "24px", height: "24px", borderRadius: "7px", background: "linear-gradient(135deg,var(--amber),var(--terra))", flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", font: "700 14px var(--font-space-grotesk)", cursor: "pointer" }}>✓</div>
      ) : (
        <div onClick={() => aoAlternar(tarefa.id, true)} style={{ width: "24px", height: "24px", borderRadius: "7px", border: "2px solid var(--chk)", flex: "0 0 auto", cursor: "pointer" }} />
      )}

      {editando ? (
        <input
          autoFocus
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onBlur={salvar}
          onKeyDown={(e) => {
            if (e.key === "Enter") salvar()
            if (e.key === "Escape") cancelar()
          }}
          className="cn-input"
          style={{ flex: 1, padding: "8px 10px", fontSize: "15px" }}
        />
      ) : (
        <div
          onDoubleClick={iniciarEdicao}
          title="Duplo clique para editar"
          style={{ flex: 1, font: "500 15px var(--font-jakarta)", color: concluida ? "var(--faint)" : "var(--ink)", textDecoration: concluida ? "line-through" : "none", cursor: "text" }}
        >
          {tarefa.titulo}
        </div>
      )}

      {!editando && tarefa.tag && !concluida && (
        <span style={{ font: "500 11px var(--font-jetbrains)", color: "var(--terra)", background: "color-mix(in srgb, var(--terra) 14%, transparent)", padding: "4px 8px", borderRadius: "6px" }}>{tarefa.tag}</span>
      )}

      {!editando && (
        <span onClick={iniciarEdicao} style={{ ...acao, fontSize: "15px" }} title="Editar">✎</span>
      )}

      <span onClick={() => aoPedirDelete(tarefa.id)} style={{ ...acao, fontSize: "20px" }} title="Deletar">×</span>
    </div>
  )
}
