import './CommonalityToast.css'

export type ToastPayload = {
  id: string
  kind: 'common' | 'different'
  names: [string, string]
  items: string[]
}

type Props = {
  toast: ToastPayload | null
}

export function CommonalityToast({ toast }: Props) {
  if (!toast) return null

  return (
    <div
      className={`commonality-toast commonality-toast--${toast.kind}`}
      role="status"
      aria-live="polite"
      key={toast.id}
    >
      <p className="commonality-toast__eyebrow">
        {toast.kind === 'common' ? 'Common ground' : 'Worlds apart'}
      </p>
      <h2 className="commonality-toast__title">
        {toast.names[0]} <span>&amp;</span> {toast.names[1]}
      </h2>
      <ul>
        {toast.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
