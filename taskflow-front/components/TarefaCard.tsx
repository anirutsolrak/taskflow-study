"use client"

import { Tarefa } from "@/types"

interface TarefaCardProps {
  tarefa: Tarefa
  aoAlternar: (id: string, concluida: boolean) => void
  aoPedirDelete: (id: string) => void
}

export default function TarefaCard({ tarefa, aoAlternar, aoPedirDelete }: TarefaCardProps) {
  const { concluida } = tarefa
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "13px", background: "var(--card)", border: "1px solid var(--warm2)", borderRadius: "13px", padding: "14px 15px" }}>
      {concluida ? (
        <div onClick={() => aoAlternar(tarefa.id, false)} style={{ width: "24px", height: "24px", borderRadius: "7px", background: "linear-gradient(135deg,var(--amber),var(--terra))", flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", font: "700 14px var(--font-space-grotesk)", cursor: "pointer" }}>✓</div>
      ) : (
        <div onClick={() => aoAlternar(tarefa.id, true)} style={{ width: "24px", height: "24px", borderRadius: "7px", border: "2px solid var(--chk)", flex: "0 0 auto", cursor: "pointer" }} />
      )}

      <div style={{ flex: 1, font: "500 15px var(--font-jakarta)", color: concluida ? "var(--faint)" : "var(--ink)", textDecoration: concluida ? "line-through" : "none" }}>{tarefa.titulo}</div>

      {tarefa.tag && !concluida && (
        <span style={{ font: "500 11px var(--font-jetbrains)", color: "var(--terra)", background: "color-mix(in srgb, var(--terra) 14%, transparent)", padding: "4px 8px", borderRadius: "6px" }}>{tarefa.tag}</span>
      )}

      <span onClick={() => aoPedirDelete(tarefa.id)} style={{ font: "400 20px var(--font-jakarta)", color: "var(--faint)", cursor: "pointer", lineHeight: 1 }} title="Deletar">×</span>
    </div>
  )
}
