import { useCallback, useEffect, useRef, useState } from 'react'
import { getCommonalities, people, type Person } from '../data/people'
import { CommonalityToast, type ToastPayload } from './CommonalityToast'
import { PersonButton } from './PersonButton'
import './FloatingArena.css'

type Body = {
  id: string
  person: Person
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const RADIUS = 68
const COLLISION_COOLDOWN_MS = 2800
const TOAST_DURATION_MS = 4200

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createBodies(width: number, height: number): Body[] {
  const margin = RADIUS + 24
  const slots = [
    { x: width * 0.28, y: height * 0.4 },
    { x: width * 0.55, y: height * 0.55 },
    { x: width * 0.72, y: height * 0.35 },
  ]

  return people.map((person, i) => {
    const slot = slots[i] ?? { x: width / 2, y: height / 2 }
    return {
      id: person.id,
      person,
      x: Math.min(width - margin, Math.max(margin, slot.x)),
      y: Math.min(height - margin, Math.max(margin, slot.y)),
      vx: rand(-0.55, 0.55) || 0.35,
      vy: rand(-0.55, 0.55) || -0.3,
      r: RADIUS,
    }
  })
}

export function FloatingArena() {
  const arenaRef = useRef<HTMLDivElement>(null)
  const bodiesRef = useRef<Body[]>([])
  const rafRef = useRef<number>(0)
  const lastCollisionRef = useRef<Map<string, number>>(new Map())
  const toastTimerRef = useRef<number>(0)

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [bumpIds, setBumpIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<ToastPayload | null>(null)
  const [ready, setReady] = useState(false)

  const showCollision = useCallback((a: Body, b: Body) => {
    const key = [a.id, b.id].sort().join('-')
    const now = performance.now()
    const last = lastCollisionRef.current.get(key) ?? 0
    if (now - last < COLLISION_COOLDOWN_MS) return
    lastCollisionRef.current.set(key, now)

    setBumpIds(new Set([a.id, b.id]))
    window.setTimeout(() => setBumpIds(new Set()), 450)

    window.clearTimeout(toastTimerRef.current)
    setToast({
      id: `${key}-${now}`,
      names: [a.person.name, b.person.name],
      items: getCommonalities(a.id, b.id),
    })
    toastTimerRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }, [])

  useEffect(() => {
    const el = arenaRef.current
    if (!el) return

    const init = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 10 || height < 10) return
      bodiesRef.current = createBodies(width, height)
      const next: Record<string, { x: number; y: number }> = {}
      for (const b of bodiesRef.current) next[b.id] = { x: b.x, y: b.y }
      setPositions(next)
      setReady(true)
    }

    init()

    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect()
      const margin = RADIUS + 16
      for (const b of bodiesRef.current) {
        b.x = Math.min(width - margin, Math.max(margin, b.x))
        b.y = Math.min(height - margin, Math.max(margin, b.y))
      }
    })
    ro.observe(el)

    let last = performance.now()
    let frameSkip = 0

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67
      last = now

      const { width, height } = el.getBoundingClientRect()
      const bodies = bodiesRef.current
      const margin = 8

      for (const b of bodies) {
        b.x += b.vx * dt
        b.y += b.vy * dt

        if (b.x - b.r < margin) {
          b.x = b.r + margin
          b.vx = Math.abs(b.vx)
        } else if (b.x + b.r > width - margin) {
          b.x = width - b.r - margin
          b.vx = -Math.abs(b.vx)
        }

        if (b.y - b.r < margin) {
          b.y = b.r + margin
          b.vy = Math.abs(b.vy)
        } else if (b.y + b.r > height - margin - 36) {
          b.y = height - b.r - margin - 36
          b.vy = -Math.abs(b.vy)
        }

        // gentle drift so they never fully stop
        const speed = Math.hypot(b.vx, b.vy)
        if (speed < 0.22) {
          b.vx += rand(-0.08, 0.08)
          b.vy += rand(-0.08, 0.08)
        }
        if (speed > 1.1) {
          b.vx *= 0.98
          b.vy *= 0.98
        }
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i]
          const b = bodies[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.001
          const minDist = a.r + b.r + 6

          if (dist < minDist) {
            showCollision(a, b)

            const nx = dx / dist
            const ny = dy / dist
            const overlap = (minDist - dist) / 2
            a.x -= nx * overlap
            a.y -= ny * overlap
            b.x += nx * overlap
            b.y += ny * overlap

            const dvx = a.vx - b.vx
            const dvy = a.vy - b.vy
            const vn = dvx * nx + dvy * ny
            if (vn > 0) continue

            const bounce = 1.35
            a.vx -= vn * nx * bounce
            a.vy -= vn * ny * bounce
            b.vx += vn * nx * bounce
            b.vy += vn * ny * bounce
          }
        }
      }

      frameSkip++
      if (frameSkip % 2 === 0) {
        const next: Record<string, { x: number; y: number }> = {}
        for (const b of bodies) next[b.id] = { x: b.x, y: b.y }
        setPositions(next)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.clearTimeout(toastTimerRef.current)
    }
  }, [showCollision])

  return (
    <div className="floating-arena" ref={arenaRef}>
      <div className="floating-arena__hint">
        Hover a button for traits · click to read more · watch them bump
      </div>
      {ready &&
        people.map((person) => {
          const pos = positions[person.id]
          if (!pos) return null
          return (
            <PersonButton
              key={person.id}
              person={person}
              x={pos.x}
              y={pos.y}
              radius={RADIUS}
              hovered={hoveredId === person.id}
              onHover={setHoveredId}
              bumpPulse={bumpIds.has(person.id)}
            />
          )
        })}
      <CommonalityToast toast={toast} />
    </div>
  )
}
