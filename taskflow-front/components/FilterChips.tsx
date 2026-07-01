export type Filtro = "todas" | "pendentes" | "concluidas"

const base: React.CSSProperties = {
  padding: "9px 15px",
  borderRadius: "10px",
  font: "600 13px var(--font-jakarta)",
  cursor: "pointer",
  transition: "transform .15s ease",
}

function estilo(ativo: boolean): React.CSSProperties {
  return ativo
    ? { ...base, border: "none", background: "linear-gradient(135deg,var(--amber),var(--terra))", color: "#fff" }
    : { ...base, border: "1px solid var(--warm)", background: "var(--surf)", color: "var(--muted)" }
}

interface FilterChipsProps {
  filtro: Filtro
  onChange: (f: Filtro) => void
}

export default function FilterChips({ filtro, onChange }: FilterChipsProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
      <button onClick={() => onChange("todas")} style={estilo(filtro === "todas")}>Todas</button>
      <button onClick={() => onChange("pendentes")} style={estilo(filtro === "pendentes")}>Pendentes</button>
      <button onClick={() => onChange("concluidas")} style={estilo(filtro === "concluidas")}>Concluídas</button>
    </div>
  )
}
