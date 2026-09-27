import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './AmbientBackdrop.css'

type Props = {
  images: string[]
}

const HOLD_MS = 9000
const FADE_MS = 4000

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function AmbientBackdrop({ images }: Props) {
  const order = useMemo(() => shuffle(images), [images])
  const [layers, setLayers] = useState<[string | null, string | null]>(() => [order[0] ?? null, null])
  const [front, setFront] = useState(0)
  const frontRef = useRef(0)
  const indexRef = useRef(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (order.length < 2 || reducedMotion) return

    let timer = 0
    let cancelled = false

    const schedule = () => {
      timer = window.setTimeout(advance, HOLD_MS)
    }

    const advance = () => {
      if (document.hidden) {
        schedule()
        return
      }
      indexRef.current = (indexRef.current + 1) % order.length
      const src = order[indexRef.current]
      const img = new Image()
      img.onload = img.onerror = () => {
        if (cancelled) return
        const back = 1 - frontRef.current
        frontRef.current = back
        setLayers((prev) => {
          const next: [string | null, string | null] = [prev[0], prev[1]]
          next[back] = src
          return next
        })
        setFront(back)
        schedule()
      }
      img.src = src
    }

    schedule()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [order])

  if (order.length === 0) return null

  return (
    <div
      className="ambient"
      style={{ '--ambient-fade': `${FADE_MS}ms`, '--ambient-drift': `${HOLD_MS + FADE_MS}ms` } as CSSProperties}
      aria-hidden
    >
      {layers.map((src, i) => (
        <div
          key={i}
          className={`ambient__layer ${i === front ? 'ambient__layer--front' : ''}`}
          style={src ? { backgroundImage: `url("${src}")` } : undefined}
        />
      ))}
    </div>
  )
}
