export default function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: "7px", background: "var(--bar)", borderRadius: "99px", overflow: "hidden", marginBottom: "20px" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg,var(--amber),var(--terra))",
          transition: "width .4s ease",
        }}
      />
    </div>
  )
}
