"use client"

interface ConfirmDialogProps {
  aberto: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ aberto, onCancel, onConfirm }: ConfirmDialogProps) {
  if (!aberto) return null
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "var(--modal)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--surf)", borderRadius: "18px", padding: "30px 28px", maxWidth: "340px", width: "100%", boxShadow: "0 30px 70px -20px rgba(0,0,0,.4)", animation: "popIn .2s ease", textAlign: "center" }}
      >
        <h3 style={{ font: "700 20px var(--font-space-grotesk)", color: "var(--ink)", margin: "0 0 8px" }}>Deletar tarefa?</h3>
        <p style={{ font: "400 14px/1.5 var(--font-jakarta)", color: "var(--muted)", margin: "0 0 22px" }}>Essa ação não pode ser desfeita.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, background: "var(--warm2)", color: "var(--ink)", border: "none", borderRadius: "11px", padding: "13px", font: "600 14px var(--font-space-grotesk)", cursor: "pointer" }}>Cancelar</button>
          <button onClick={onConfirm} style={{ flex: 1, background: "var(--danger)", color: "#fff", border: "none", borderRadius: "11px", padding: "13px", font: "600 14px var(--font-space-grotesk)", cursor: "pointer" }}>Deletar</button>
        </div>
      </div>
    </div>
  )
}
