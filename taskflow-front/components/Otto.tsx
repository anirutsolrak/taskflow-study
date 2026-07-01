import type { CSSProperties } from "react"

const amber = "var(--amber)"
const terra = "var(--terra)"
const ear = "var(--terradeep)"
const light = "color-mix(in srgb, var(--amber) 45%, #fff7ec)"

function Eye({ left }: { left: boolean }) {
  const style: CSSProperties = {
    position: "absolute",
    top: "58px",
    [left ? "left" : "right"]: "52px",
    width: "13px",
    height: "15px",
    borderRadius: "50%",
    background: "#fffdf9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "blink 4.2s ease-in-out infinite",
    transformOrigin: "center",
  }
  return (
    <div style={style}>
      <div style={{ width: "7px", height: "9px", borderRadius: "50%", background: "#4a6b3a" }} />
    </div>
  )
}

export default function Otto() {
  return (
    <div style={{ position: "relative", width: "150px", height: "150px" }}>
      {/* cauda */}
      <div
        style={{
          position: "absolute", left: "2px", bottom: "8px", width: "46px", height: "24px",
          borderBottom: `13px solid ${amber}`, borderLeft: `13px solid ${amber}`,
          borderRadius: "0 0 0 40px", transformOrigin: "right bottom",
          animation: "tailSway 3.4s ease-in-out infinite",
        }}
      />
      {/* corpo */}
      <div
        style={{
          position: "absolute", left: "30px", bottom: 0, width: "90px", height: "92px",
          background: amber, borderRadius: "46% 46% 42% 42% / 58% 58% 42% 42%",
          transformOrigin: "bottom center", animation: "catBreathe 3.6s ease-in-out infinite",
        }}
      />
      {/* barriga */}
      <div
        style={{
          position: "absolute", left: "52px", bottom: "4px", width: "46px", height: "58px",
          background: light, borderRadius: "50% 50% 46% 46%",
        }}
      />
      {/* orelhas */}
      <div style={{ position: "absolute", left: "34px", top: "14px", width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderBottom: `24px solid ${ear}` }} />
      <div style={{ position: "absolute", right: "34px", top: "14px", width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderBottom: `24px solid ${ear}` }} />
      {/* cabeca */}
      <div style={{ position: "absolute", left: "33px", top: "26px", width: "84px", height: "70px", background: amber, borderRadius: "46% 46% 44% 44%" }} />
      <Eye left />
      <Eye left={false} />
      {/* nariz */}
      <div style={{ position: "absolute", top: "74px", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${terra}` }} />
      {/* patas */}
      <div style={{ position: "absolute", left: "42px", bottom: 0, width: "26px", height: "18px", background: light, borderRadius: "40% 40% 50% 50%" }} />
      <div style={{ position: "absolute", right: "42px", bottom: 0, width: "26px", height: "18px", background: light, borderRadius: "40% 40% 50% 50%" }} />
    </div>
  )
}
