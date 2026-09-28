import { useState } from 'react'
import './CommonalityToast.css'

export type ToastPayload = {
  id: string
  kind: 'common' | 'different'
  names: [string, string]
  items: string[]
}

type Props = {
  toast: ToastPayload | null
  onDismiss: () => void
}

export function CommonalityToast({ toast, onDismiss }: Props) {
  const [shown, setShown] = useState(toast)
  const [leaving, setLeaving] = useState(false)

  if (toast && toast !== shown) {
    setShown(toast)
    setLeaving(false)
  } else if (!toast && shown && !leaving) {
    setLeaving(true)
  }

  if (!shown) return null

  return (
    <div
      className={`commonality-toast commonality-toast--${shown.kind} ${leaving ? 'commonality-toast--leaving' : ''}`}
      role="status"
      aria-live="polite"
      key={shown.id}
      onAnimationEnd={(e) => {
        if (e.animationName === 'toast-out') setShown(null)
      }}
    >
      <button type="button" className="commonality-toast__close" aria-label="Dismiss" onClick={onDismiss}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
      <p className="commonality-toast__eyebrow">
        {shown.kind === 'common' ? 'Common ground' : 'Worlds apart'}
      </p>
      <h2 className="commonality-toast__title">
        {shown.names[0]} <span>&amp;</span> {shown.names[1]}
      </h2>
      <ul>
        {shown.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
