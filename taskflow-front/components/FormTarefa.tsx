"use client"

interface FormTarefaProps {
  valor: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function FormTarefa({ valor, onChange, onSubmit }: FormTarefaProps) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: "9px", marginBottom: "16px" }}>
      <input
        type="text"
        placeholder="Nova tarefa…"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="cn-input"
        style={{ flex: 1 }}
      />
      <button
        type="submit"
        className="cn-btn-grad"
        style={{ padding: "0 20px", fontSize: "22px", fontWeight: 700, boxShadow: "none" }}
        aria-label="Adicionar tarefa"
      >
        +
      </button>
    </form>
  )
}
