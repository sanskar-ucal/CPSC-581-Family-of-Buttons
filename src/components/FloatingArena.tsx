import { useEffect, useRef, useState } from 'react'
import { getAffinity, getPairInsight, pairKey, people, type Charge, type Person } from '../data/people'
import { ArenaBackdrop, type BackdropEvent } from './ArenaBackdrop'
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
  frozen: boolean
}

const RADIUS = 68
const COLLISION_COOLDOWN_MS = 2800
const TOAST_DURATION_MS = 4200
const BACKDROP_DURATION_MS = 5000
const FIELD_RANGE = 520
const REPEL_RANGE = 250
const CHARGE_K = 700
const MAX_CHARGE_FORCE = 0.035
const FIELD_QUIET_MS = 2200
const ATTRACT_MIN_BOUNCE = 0.5
const REPEL_BASE_BOUNCE = 0.9

const CHARGE_STRENGTH = 0.3

function createCharges() {
  const charges = new Map<string, Charge>()
  const [first, ...rest] = people
  charges.set(first.id, 1)
  for (const p of rest) charges.set(p.id, getAffinity(first, p) > 0 ? -1 : 1)
  if (new Set(charges.values()).size === 1) charges.set(rest[rest.length - 1].id, -1)
  return charges
}

function chargeSymbol(c: Charge) {
  return c > 0 ? '+' : '−'
}

function minBounceFor(affinity: number) {
  return affinity < 0 ? REPEL_BASE_BOUNCE + 2 * Math.abs(affinity) : ATTRACT_MIN_BOUNCE
}

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
      vx: rand(-0.85, 0.85) || 0.5,
      vy: rand(-0.85, 0.85) || -0.45,
      r: RADIUS,
      frozen: false,
    }
  })
}

export function FloatingArena() {
  const arenaRef = useRef<HTMLDivElement>(null)
  const bodiesRef = useRef<Body[]>([])
  const rafRef = useRef<number>(0)
  const lastCollisionRef = useRef<Map<string, number>>(new Map())
  const lastContactRef = useRef<Map<string, number>>(new Map())
  const hoveredRef = useRef<string | null>(null)
  const chargeRef = useRef<Map<string, Charge>>(createCharges())
  const [charges, setCharges] = useState<Record<string, Charge>>(() =>
    Object.fromEntries(chargeRef.current),
  )
  const toastTimerRef = useRef<number>(0)
  const backdropTimerRef = useRef<number>(0)
  const bumpTimerRef = useRef<number>(0)

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [bumpIds, setBumpIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<ToastPayload | null>(null)
  const [backdrop, setBackdrop] = useState<BackdropEvent | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hoveredRef.current = hoveredId
  }, [hoveredId])

  useEffect(() => {
    for (const p of people) {
      for (const src of p.gallery ?? []) new Image().src = src
    }
  }, [])

  useEffect(() => {
    const el = arenaRef.current
    if (!el) return

    const chargeOf = (a: Body, b: Body) => {
      const ca = chargeRef.current.get(a.id) ?? 1
      const cb = chargeRef.current.get(b.id) ?? 1
      return -ca * cb * CHARGE_STRENGTH
    }

    const flipCharges = (a: Body, b: Body) => {
      const map = chargeRef.current
      const flipped = Math.random() < 0.5 ? a.person : b.person
      map.set(flipped.id, (-(map.get(flipped.id) ?? 1)) as Charge)

      let rebalanced: Person | null = null
      if (new Set(map.values()).size === 1) {
        rebalanced = people.find((p) => p.id !== a.id && p.id !== b.id) ?? null
        if (rebalanced) map.set(rebalanced.id, (-(map.get(rebalanced.id) ?? 1)) as Charge)
      }

      setCharges(Object.fromEntries(map))
      return { flipped, rebalanced }
    }

    const onCollide = (a: Body, b: Body, now: number) => {
      const key = pairKey(a.id, b.id)
      const last = lastCollisionRef.current.get(key) ?? -Infinity
      if (now - last < COLLISION_COOLDOWN_MS) return
      lastCollisionRef.current.set(key, now)

      const { flipped, rebalanced } = flipCharges(a, b)
      const other = flipped.id === a.id ? b.person : a.person
      const flippedCharge = chargeRef.current.get(flipped.id) ?? 1
      const nowAttracting = flippedCharge !== chargeRef.current.get(other.id)
      const chargeLines = [
        `${flipped.name} flipped to ${chargeSymbol(flippedCharge)}, now ${nowAttracting ? 'pulling toward' : 'pushing away from'} ${other.name}`,
      ]
      if (rebalanced) {
        const c = chargeRef.current.get(rebalanced.id) ?? 1
        chargeLines.push(`${rebalanced.name} flipped to ${chargeSymbol(c)} so nobody gets stuck`)
      }

      const insight = getPairInsight(a.person, b.person)
      const id = `${key}-${now}`

      setBumpIds(new Set([a.id, b.id]))
      window.clearTimeout(bumpTimerRef.current)
      bumpTimerRef.current = window.setTimeout(() => setBumpIds(new Set()), 450)

      setBackdrop({ id, a: a.person, b: b.person, insight })
      window.clearTimeout(backdropTimerRef.current)
      backdropTimerRef.current = window.setTimeout(() => setBackdrop(null), BACKDROP_DURATION_MS)

      setToast({
        id,
        kind: insight.kind,
        names: [a.person.name, b.person.name],
        items: [...insight.lines, ...chargeLines],
      })
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    }

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

      for (const b of bodies) b.frozen = b.id === hoveredRef.current

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i]
          const b = bodies[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.0001
          const affinity = chargeOf(a, b)
          if (dist > (affinity < 0 ? REPEL_RANGE : FIELD_RANGE)) continue
          const lastContact = lastContactRef.current.get(pairKey(a.id, b.id)) ?? -Infinity
          if (now - lastContact < FIELD_QUIET_MS) continue

          const nx = dx / dist
          const ny = dy / dist
          const clamped = Math.max(dist, a.r + b.r)
          const raw = (CHARGE_K * affinity) / (clamped * clamped)
          const f = Math.max(-MAX_CHARGE_FORCE, Math.min(MAX_CHARGE_FORCE, raw)) * dt

          if (!a.frozen) {
            a.vx += nx * f
            a.vy += ny * f
          }
          if (!b.frozen) {
            b.vx -= nx * f
            b.vy -= ny * f
          }
        }
      }

      for (const b of bodies) {
        if (b.frozen) continue

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

        const speed = Math.hypot(b.vx, b.vy)
        if (speed < 0.28) {
          b.vx += rand(-0.1, 0.1)
          b.vy += rand(-0.1, 0.1)
        }
        if (speed > 1.2) {
          b.vx *= 0.992
          b.vy *= 0.992
        }
        if (speed > 3) {
          b.vx *= 0.96
          b.vy *= 0.96
        }
      }

      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i]
            const b = bodies[j]
            if (a.frozen && b.frozen) continue

            const dx = b.x - a.x
            const dy = b.y - a.y
            const dist = Math.hypot(dx, dy) || 0.0001
            const minDist = a.r + b.r

            if (dist >= minDist) continue

            const minBounce = minBounceFor(chargeOf(a, b))
            if (pass === 0) {
              lastContactRef.current.set(pairKey(a.id, b.id), now)
              onCollide(a, b, now)
            }

            const nx = dx / dist
            const ny = dy / dist
            const overlap = minDist - dist

            if (a.frozen || b.frozen) {
              const free = a.frozen ? b : a
              const ox = free === b ? nx : -nx
              const oy = free === b ? ny : -ny
              free.x += ox * (overlap + 0.5)
              free.y += oy * (overlap + 0.5)
              let vOut = free.vx * ox + free.vy * oy
              if (vOut < 0) {
                free.vx -= 2 * vOut * ox
                free.vy -= 2 * vOut * oy
                vOut = -vOut
              }
              if (vOut < minBounce) {
                free.vx += (minBounce - vOut) * ox
                free.vy += (minBounce - vOut) * oy
              }
              continue
            }

            a.x -= nx * (overlap * 0.5 + 0.5)
            a.y -= ny * (overlap * 0.5 + 0.5)
            b.x += nx * (overlap * 0.5 + 0.5)
            b.y += ny * (overlap * 0.5 + 0.5)

            const vaN = a.vx * nx + a.vy * ny
            const vbN = b.vx * nx + b.vy * ny
            if (vaN - vbN <= 0) continue

            a.vx += (vbN - vaN) * nx
            a.vy += (vbN - vaN) * ny
            b.vx += (vaN - vbN) * nx
            b.vy += (vaN - vbN) * ny

            const aOut = a.vx * nx + a.vy * ny
            const bOut = b.vx * nx + b.vy * ny
            if (aOut > -minBounce) {
              a.vx -= (aOut + minBounce) * nx
              a.vy -= (aOut + minBounce) * ny
            }
            if (bOut < minBounce) {
              b.vx += (minBounce - bOut) * nx
              b.vy += (minBounce - bOut) * ny
            }
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
      window.clearTimeout(backdropTimerRef.current)
      window.clearTimeout(bumpTimerRef.current)
    }
  }, [])

  return (
    <div className="floating-arena" ref={arenaRef}>
      <ArenaBackdrop event={backdrop} />
      <div className="floating-arena__hint">
        Hover to flip · click to read more · opposites attract, like charges repel, every hit flips one
      </div>
      <div className="floating-arena__stage">
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
                charge={charges[person.id] ?? 1}
              />
            )
          })}
      </div>
      <CommonalityToast toast={toast} />
    </div>
  )
}
