"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registrar } from "@/services/api"
import OttoMark from "@/components/OttoMark"

const label: React.CSSProperties = {
  font: "500 13px var(--font-jakarta)", color: "var(--muted)", marginBottom: "7px",
}

export default function Registro() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [ok, setOk] = useState(false)
  const router = useRouter()

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault()
    setErro("")
    try {
      await registrar(email, senha)
      setOk(true)
      setTimeout(() => router.push("/login"), 1100)
    } catch {
      setErro("Erro ao registrar usuário")
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page)" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "var(--surf)", border: "1px solid var(--warm)", borderRadius: "20px", padding: "44px 38px", boxShadow: "0 30px 70px -34px var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "26px", color: "var(--terra)" }}>
          <OttoMark size={32} />
          <div style={{ font: "700 18px var(--font-space-grotesk)", color: "var(--ink)" }}>CATNotes</div>
        </div>
        <h2 style={{ font: "700 26px/1.1 var(--font-space-grotesk)", color: "var(--ink)", margin: "0 0 4px", letterSpacing: "-.02em" }}>Criar conta</h2>
        <p style={{ font: "400 14px var(--font-jakarta)", color: "var(--muted)", margin: "0 0 24px" }}>Leva menos de um minuto.</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <label style={label}>Email</label>
          <input type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="cn-input" style={{ marginBottom: "16px" }} required />
          <label style={label}>Senha</label>
          <input type="password" placeholder="mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className="cn-input" style={{ marginBottom: "14px" }} required />
          {erro && <div style={{ font: "500 13px var(--font-jakarta)", color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 12%, transparent)", borderRadius: "9px", padding: "9px 12px", marginBottom: "14px" }}>{erro}</div>}
          {ok && <div style={{ font: "500 13px var(--font-jakarta)", color: "var(--success)", background: "color-mix(in srgb, var(--success) 12%, transparent)", borderRadius: "9px", padding: "9px 12px", marginBottom: "14px" }}>Conta criada. Entrando…</div>}
          <button type="submit" className="cn-btn-grad" style={{ padding: "14px", fontSize: "15px" }}>Criar conta</button>
        </form>
        <div style={{ font: "400 13px var(--font-jakarta)", color: "var(--muted)", textAlign: "center", marginTop: "18px" }}>Já tem conta? <span onClick={() => router.push("/login")} style={{ color: "var(--terra)", fontWeight: 600, cursor: "pointer" }}>Entrar</span></div>
      </div>
    </main>
  )
}
