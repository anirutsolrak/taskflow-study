"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "@/components/providers/ThemeProvider"
import OttoMark from "@/components/OttoMark"

interface NavBarProps {
  titulo?: string
  mostrarAvatar?: boolean
  aoVoltar?: () => void
}

export default function NavBar({ titulo, mostrarAvatar, aoVoltar }: NavBarProps) {
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const icone = theme === "dark" ? "☀" : "☾"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 24px", borderBottom: "1px solid var(--warm2)" }}>
      {aoVoltar ? (
        <button onClick={aoVoltar} title="Voltar" className="cn-icon-btn" style={{ color: "var(--ink)", fontSize: "18px" }}>←</button>
      ) : (
        <span style={{ color: "var(--terra)", display: "inline-flex" }}><OttoMark size={30} /></span>
      )}
      <div style={{ font: "700 17px var(--font-space-grotesk)", color: "var(--ink)" }}>{titulo ?? "CATNotes"}</div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={toggle} title="Alternar tema" className="cn-icon-btn">{icone}</button>
        {mostrarAvatar && (
          <div onClick={() => router.push("/perfil")} title="Perfil" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,var(--amber),var(--terra))", display: "flex", alignItems: "center", justifyContent: "center", font: "700 14px var(--font-space-grotesk)", color: "#fff", cursor: "pointer" }}>A</div>
        )}
      </div>
    </div>
  )
}
