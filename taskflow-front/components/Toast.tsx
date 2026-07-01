"use client"

export default function Toast({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null
  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--ink)",
        color: "var(--surf)",
        padding: "13px 20px",
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "14px",
        boxShadow: "0 14px 30px -12px rgba(0,0,0,.5)",
        animation: "toastIn .25s ease",
        zIndex: 50,
      }}
    >
      {mensagem}
    </div>
  )
}
