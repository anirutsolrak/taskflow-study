import Link from "next/link"
import Otto from "@/components/Otto"

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page)" }}>
      <div style={{ textAlign: "center", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ animation: "floatY 4.5s ease-in-out infinite", marginBottom: "6px" }}><Otto /></div>
        <div style={{ font: "700 64px var(--font-space-grotesk)", color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1, marginBottom: "10px" }}>404</div>
        <h3 style={{ font: "700 20px var(--font-space-grotesk)", color: "var(--ink)", margin: "0 0 8px" }}>Essa página fugiu pela janela.</h3>
        <p style={{ font: "400 15px/1.5 var(--font-jakarta)", color: "var(--muted)", margin: "0 0 22px" }}>O Otto procurou por todo lado e não achou. Vamos voltar pra um lugar conhecido.</p>
        <Link href="/tarefas" className="cn-btn-grad" style={{ padding: "13px 26px", fontSize: "15px", textDecoration: "none", display: "inline-block" }}>Voltar ao início</Link>
      </div>
    </main>
  )
}
