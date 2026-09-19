import './CommonalityToast.css'

export type ToastPayload = {
  id: string
  names: [string, string]
  items: string[]
}

type Props = {
  toast: ToastPayload | null
}

export function CommonalityToast({ toast }: Props) {
  if (!toast) return null

  return (
    <div className="commonality-toast" role="status" aria-live="polite" key={toast.id}>
      <p className="commonality-toast__eyebrow">Collision!</p>
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
