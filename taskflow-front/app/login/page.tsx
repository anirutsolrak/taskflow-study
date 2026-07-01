"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/services/api"
import OttoMark from "@/components/OttoMark"

const label: React.CSSProperties = {
  font: "500 13px var(--font-jakarta)", color: "var(--muted)", marginBottom: "7px",
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const router = useRouter()

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault()
    setErro("")
    try {
      const dados = await login(email, senha)
      localStorage.setItem("access_token", dados.access_token)
      localStorage.setItem("user_email", email)
      router.push("/tarefas")
    } catch {
      setErro("Email ou senha incorretos")
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page)" }}>
      <div style={{ width: "100%", maxWidth: "860px", borderRadius: "20px", overflow: "hidden", border: "1px solid var(--warm)", boxShadow: "0 30px 70px -34px var(--shadow)", background: "var(--surf)" }}>
        <div style={{ display: "flex", minHeight: "520px" }}>
          <div className="hidden md:flex" style={{ width: "42%", position: "relative", background: "linear-gradient(155deg,var(--amber),var(--terra) 70%,var(--terradeep))", padding: "42px 36px", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "300px", height: "300px", right: "-130px", bottom: "-110px", background: "radial-gradient(circle,#ffffff44,transparent 70%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", color: "#fff" }}>
              <OttoMark size={30} />
              <div style={{ font: "700 19px var(--font-space-grotesk)", color: "#fff" }}>CATNotes</div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ font: "600 32px/1.15 var(--font-space-grotesk)", color: "#fff", letterSpacing: "-.02em" }}>Menos ruído.<br />Mais feito.</div>
              <p style={{ font: "400 15px/1.55 var(--font-jakarta)", color: "#fff", opacity: 0.92, margin: "14px 0 0", maxWidth: "250px" }}>O jeito calmo de organizar o dia e realmente terminar a lista.</p>
            </div>
            <div style={{ display: "flex", gap: "7px", alignItems: "center", position: "relative", opacity: 0.9 }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#fff", animation: "pawTrail 2.4s ease-in-out infinite" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#fff", animation: "pawTrail 2.4s ease-in-out .3s infinite" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#fff", animation: "pawTrail 2.4s ease-in-out .6s infinite" }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ flex: 1, padding: "48px 46px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ font: "500 13px/1 var(--font-jetbrains)", color: "var(--terra)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "10px" }}>Bem-vindo de volta</div>
            <h2 style={{ font: "700 28px/1.1 var(--font-space-grotesk)", color: "var(--ink)", margin: "0 0 26px", letterSpacing: "-.02em" }}>Entrar na conta</h2>
            <label style={label}>Email</label>
            <input type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="cn-input" style={{ marginBottom: "16px" }} required />
            <label style={label}>Senha</label>
            <input type="password" placeholder="sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="cn-input" style={{ marginBottom: "14px" }} required />
            {erro && <div style={{ font: "500 13px var(--font-jakarta)", color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 12%, transparent)", borderRadius: "9px", padding: "9px 12px", marginBottom: "14px" }}>{erro}</div>}
            <button type="submit" className="cn-btn-grad" style={{ padding: "15px", fontSize: "16px", marginTop: "4px" }}>Entrar →</button>
            <div style={{ font: "400 14px var(--font-jakarta)", color: "var(--muted)", textAlign: "center", marginTop: "18px" }}>Novo por aqui? <span onClick={() => router.push("/registro")} style={{ color: "var(--terra)", fontWeight: 600, cursor: "pointer" }}>Criar conta</span></div>
          </form>
        </div>
      </div>
    </main>
  )
}
