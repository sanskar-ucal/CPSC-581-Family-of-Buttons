import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from 'react'
import type { Person } from '../data/people'
import { PersonPhoto } from './PersonPhoto'
import './VinylDisc.css'

type Props = {
  person: Person
  audioRef: RefObject<HTMLAudioElement | null>
  autoplayBlocked: boolean
}

// 33 1/3 rpm: one full turn of the record equals 1.8s of song, both when spinning and when scrubbing
const SECONDS_PER_TURN = 1.8
const SPIN_DEG_PER_SEC = 360 / SECONDS_PER_TURN
const TAP_MAX_DEG = 6
const TAP_MAX_MS = 250
const KEY_SEEK_SEC = 5
const RING_SIZE = 224
const RING_RADIUS = 108
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function normalizeDeg(deg: number) {
  return ((((deg + 180) % 360) + 360) % 360) - 180
}

type Drag = {
  pointerId: number
  lastAngle: number
  moved: number
  startedAt: number
  wasPlaying: boolean
  scrubbing: boolean
}

export function VinylDisc({ person, audioRef, autoplayBlocked }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const discRef = useRef<HTMLSpanElement>(null)
  const angleRef = useRef(0)
  const speedRef = useRef(0)
  const dragRef = useRef<Drag | null>(null)

  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const sync = () => {
      setPlaying(!audio.paused)
      setTime(audio.currentTime)
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }
    const onError = () => setMissing(true)
    const onLoaded = () => {
      setMissing(false)
      sync()
    }

    setMissing(Boolean(audio.error))
    sync()

    const events = ['play', 'pause', 'timeupdate', 'durationchange'] as const
    for (const e of events) audio.addEventListener(e, sync)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('error', onError)
    return () => {
      for (const e of events) audio.removeEventListener(e, sync)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('error', onError)
    }
  }, [audioRef, person.id])

  useEffect(() => {
    let raf = 0
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const audio = audioRef.current
      const target = audio && !audio.paused && !dragRef.current?.scrubbing ? SPIN_DEG_PER_SEC : 0
      speedRef.current += (target - speedRef.current) * Math.min(1, dt * 3)
      angleRef.current += speedRef.current * dt
      if (discRef.current) discRef.current.style.transform = `rotate(${angleRef.current}deg)`
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [audioRef])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || missing) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  const seekBy = (sec: number) => {
    const audio = audioRef.current
    if (!audio || missing || !duration) return
    let next = audio.currentTime + sec
    if (audio.loop) next = ((next % duration) + duration) % duration
    else next = Math.max(0, Math.min(duration, next))
    audio.currentTime = next
    setTime(next)
  }

  const pointerAngle = (e: PointerEvent) => {
    const rect = buttonRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI
  }

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const audio = audioRef.current
    dragRef.current = {
      pointerId: e.pointerId,
      lastAngle: pointerAngle(e),
      moved: 0,
      startedAt: performance.now(),
      wasPlaying: Boolean(audio && !audio.paused),
      scrubbing: false,
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return

    const angle = pointerAngle(e)
    const delta = normalizeDeg(angle - drag.lastAngle)
    drag.lastAngle = angle
    drag.moved += Math.abs(delta)

    if (!drag.scrubbing) {
      if (drag.moved < TAP_MAX_DEG) return
      drag.scrubbing = true
      speedRef.current = 0
      if (drag.wasPlaying) audioRef.current?.pause()
    }

    angleRef.current += delta
    seekBy((delta / 360) * SECONDS_PER_TURN)
  }

  const endDrag = (e: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    dragRef.current = null

    if (drag.scrubbing) {
      if (drag.wasPlaying) audioRef.current?.play().catch(() => {})
    } else if (performance.now() - drag.startedAt < TAP_MAX_MS) {
      togglePlay()
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      togglePlay()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      seekBy(KEY_SEEK_SEC)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      seekBy(-KEY_SEEK_SEC)
    }
  }

  const progress = duration ? time / duration : 0
  const status = missing
    ? `Add public${person.song.src}`
    : autoplayBlocked && !playing
      ? 'Tap to play'
      : null

  return (
    <div
      className={`vinyl ${playing ? 'vinyl--playing' : ''} ${missing ? 'vinyl--missing' : ''}`}
      style={{ '--accent': person.accent } as CSSProperties}
    >
      <div className="vinyl__stage">
        <svg
          className="vinyl__progress"
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          aria-hidden
        >
          <circle className="vinyl__ring-track" cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} />
          <circle
            className="vinyl__ring-fill"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <button
          ref={buttonRef}
          type="button"
          className="vinyl__button"
          aria-label={`${playing ? 'Pause' : 'Play'} ${person.song.title} by ${person.song.artist}. Drag in a circle to scrub.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          <span className="vinyl__disc" ref={discRef}>
            <span className={`vinyl__label ${person.song.cover ? 'vinyl__label--cover' : ''}`}>
              {person.song.cover ? (
                <img className="vinyl__cover" src={person.song.cover} alt="" draggable={false} />
              ) : (
                <PersonPhoto person={person} />
              )}
            </span>
            <span className="vinyl__spindle" />
          </span>
          <span className="vinyl__glare" />
          {status && <span className="vinyl__status">{status}</span>}
        </button>
      </div>
      <div className="vinyl__meta">
        <p className="vinyl__title">{person.song.title}</p>
        <p className="vinyl__artist">{person.song.artist}</p>
        <p className="vinyl__time">
          {formatTime(time)} / {formatTime(duration)}
        </p>
      </div>
    </div>
  )
}
