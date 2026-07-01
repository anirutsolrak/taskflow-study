"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"
import { useTheme } from "@/components/providers/ThemeProvider"
import { buscarTarefas } from "@/services/api"
import { calcularStreak } from "@/lib/streak"
import { Tarefa } from "@/types"

const segBase: React.CSSProperties = { border: "none", borderRadius: "7px", padding: "6px 13px", font: "600 12px var(--font-jakarta)", cursor: "pointer" }
const cardStat: React.CSSProperties = { flex: 1, background: "var(--surf2)", border: "1px solid var(--warm2)", borderRadius: "13px", padding: "16px 14px", textAlign: "center" }
const rowOpt: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surf2)", border: "1px solid var(--warm2)", borderRadius: "13px", padding: "14px 16px", marginBottom: "12px" }

function seg(ativo: boolean): React.CSSProperties {
  return ativo
    ? { ...segBase, background: "var(--surf)", color: "var(--ink)", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }
    : { ...segBase, background: "transparent", color: "var(--muted)" }
}

export default function Perfil() {
  const { theme, setLight, setDark } = useTheme()
  const router = useRouter()
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [email, setEmail] = useState("voce@email.com")
  const [resumo, setResumo] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.replace("/login")
      return
    }
    const emailSalvo = localStorage.getItem("user_email") || "voce@email.com"
    const resumoSalvo = localStorage.getItem("catnotes-resumo") !== "off"
    let ativo = true
    const aplicar = (lista: Tarefa[]) => {
      if (!ativo) return
      setTarefas(lista)
      setEmail(emailSalvo)
      setResumo(resumoSalvo)
    }
    buscarTarefas().then(aplicar).catch(() => aplicar([]))
    return () => {
      ativo = false
    }
  }, [router])

  const feitas = tarefas.filter((t) => t.concluida).length
  const pendentes = tarefas.length - feitas
  const streak = calcularStreak(tarefas.map((t) => t.concluida_em))
  const nome = email.split("@")[0] || "Você"
  const inicial = nome.charAt(0).toUpperCase()

  function toggleResumo() {
    const novo = !resumo
    setResumo(novo)
    localStorage.setItem("catnotes-resumo", novo ? "on" : "off")
  }

  function logout() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_email")
    router.push("/login")
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page)" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "var(--surf)", border: "1px solid var(--warm)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 30px 70px -38px var(--shadow)" }}>
        <NavBar titulo="Perfil" aoVoltar={() => router.push("/tarefas")} />
        <div style={{ padding: "30px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "26px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,var(--amber),var(--terra))", display: "flex", alignItems: "center", justifyContent: "center", font: "700 26px var(--font-space-grotesk)", color: "#fff", boxShadow: "0 10px 24px -10px var(--terra)" }}>{inicial}</div>
            <div>
              <div style={{ font: "700 20px var(--font-space-grotesk)", color: "var(--ink)", letterSpacing: "-.01em", textTransform: "capitalize" }}>{nome}</div>
              <div style={{ font: "400 14px var(--font-jakarta)", color: "var(--muted)" }}>{email}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <div style={cardStat}><div style={{ font: "700 24px var(--font-space-grotesk)", color: "var(--terra)" }}>{feitas}</div><div style={{ font: "500 12px var(--font-jakarta)", color: "var(--muted)", marginTop: "2px" }}>Concluídas</div></div>
            <div style={cardStat}><div style={{ font: "700 24px var(--font-space-grotesk)", color: "var(--ink)" }}>{pendentes}</div><div style={{ font: "500 12px var(--font-jakarta)", color: "var(--muted)", marginTop: "2px" }}>Pendentes</div></div>
            <div style={cardStat}><div style={{ font: "700 24px var(--font-space-grotesk)", color: "var(--ink)" }}>{streak}</div><div style={{ font: "500 12px var(--font-jakarta)", color: "var(--muted)", marginTop: "2px" }}>Dias seguidos</div></div>
          </div>

          <div style={rowOpt}>
            <div>
              <div style={{ font: "600 15px var(--font-jakarta)", color: "var(--ink)" }}>Aparência</div>
              <div style={{ font: "400 13px var(--font-jakarta)", color: "var(--muted)" }}>Escolha claro ou escuro</div>
            </div>
            <div style={{ display: "flex", background: "var(--warm2)", borderRadius: "9px", padding: "3px" }}>
              <button onClick={setLight} style={seg(theme === "light")}>Claro</button>
              <button onClick={setDark} style={seg(theme === "dark")}>Escuro</button>
            </div>
          </div>

          <div style={{ ...rowOpt, marginBottom: "24px" }}>
            <div>
              <div style={{ font: "600 15px var(--font-jakarta)", color: "var(--ink)" }}>Resumo diário</div>
              <div style={{ font: "400 13px var(--font-jakarta)", color: "var(--muted)" }}>Receba um lembrete pela manhã</div>
            </div>
            <div onClick={toggleResumo} style={{ width: "46px", height: "26px", borderRadius: "99px", cursor: "pointer", padding: "3px", display: "flex", transition: "background .2s ease", background: resumo ? "var(--terra)" : "var(--warm)", justifyContent: resumo ? "flex-end" : "flex-start" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
            </div>
          </div>

          <button onClick={logout} style={{ width: "100%", background: "transparent", color: "var(--danger)", border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)", borderRadius: "11px", padding: "14px", font: "600 15px var(--font-space-grotesk)", cursor: "pointer" }}>Sair da conta</button>
        </div>
      </div>
    </main>
  )
}
