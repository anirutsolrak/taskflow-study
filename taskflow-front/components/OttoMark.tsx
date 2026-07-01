export default function OttoMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* orelhas */}
      <path d="M4 3.5 L8.5 8 L4.2 9.2 Z" />
      <path d="M20 3.5 L15.5 8 L19.8 9.2 Z" />
      {/* cabeca */}
      <path d="M12 6.5c-4 0-7 3-7 7 0 2.6 3.1 4.5 7 4.5s7-1.9 7-4.5c0-4-3-7-7-7Z" />
      {/* olhos (recorte) */}
      <circle cx="9.3" cy="12.6" r="1.05" fill="var(--surf)" />
      <circle cx="14.7" cy="12.6" r="1.05" fill="var(--surf)" />
      {/* focinho */}
      <path d="M12 14.2 l1.1 1 -1.1 0.9 -1.1 -0.9 Z" fill="var(--surf)" />
    </svg>
  )
}
