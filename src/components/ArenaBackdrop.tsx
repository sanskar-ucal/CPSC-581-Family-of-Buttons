import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { IconId, PairInsight, Person } from '../data/people'
import { HobbyIcon } from './HobbyIcon'
import './ArenaBackdrop.css'

export type BackdropEvent = {
  id: string
  a: Person
  b: Person
  insight: PairInsight
}

type Props = {
  event: BackdropEvent | null
}

const FADE_OUT_MS = 700
const ICON_SIZE = 220

const DIVIDER_POINTS = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10
  const x = 58 - 16 * t + (i % 2 === 0 ? -2.5 : 2.5)
  return `${x},${t * 100}`
}).join(' ')

type IconItem = { icon: IconId; label: string }

type Photos = { a: string | null; b: string | null }

function objectItem(person: Person): IconItem {
  return { icon: person.object, label: person.name }
}

function pickPhoto(gallery?: string[]): string | null {
  if (!gallery || gallery.length === 0) return null
  return gallery[Math.floor(Math.random() * gallery.length)]
}

function Photo({ src, side }: { src: string | null; side: 'a' | 'b' }) {
  if (!src) return null
  return (
    <div
      className={`arena-backdrop__photo arena-backdrop__photo--${side}`}
      style={{ backgroundImage: `url("${src}")` }}
    />
  )
}

function Common({ event, photos }: { event: BackdropEvent; photos: Photos }) {
  const { a, b, insight } = event
  const icons: IconItem[] =
    insight.sharedHobbies.length > 0 ? insight.sharedHobbies : [objectItem(a), objectItem(b)]
  const caption =
    insight.sharedHobbies.length > 0
      ? `Common ground: both love ${insight.sharedHobbies.map((h) => h.label.toLowerCase()).join(' & ')}`
      : `Common ground: ${a.name} & ${b.name}`

  return (
    <div className="arena-backdrop__common">
      <div className="arena-backdrop__blend">
        <Photo src={photos.a} side="a" />
        <Photo src={photos.b} side="b" />
        <div className="arena-backdrop__wash" />
      </div>
      <div className="arena-backdrop__icons">
        {icons.map((h, i) => (
          <span key={`${h.label}-${i}`} className="arena-backdrop__icon" style={{ animationDelay: `${i * 0.12}s` }}>
            <HobbyIcon icon={h.icon} size={ICON_SIZE} />
          </span>
        ))}
      </div>
      <p className="arena-backdrop__caption">{caption}</p>
    </div>
  )
}

function Different({ event, photos }: { event: BackdropEvent; photos: Photos }) {
  const { a, b, insight } = event
  const iconA: IconItem = insight.uniqueA[0] ?? objectItem(a)
  const iconB: IconItem = insight.uniqueB[0] ?? objectItem(b)

  return (
    <div className="arena-backdrop__different">
      <div className="arena-backdrop__half arena-backdrop__half--a">
        <Photo src={photos.a} side="a" />
        <div className="arena-backdrop__wash" />
        <div className="arena-backdrop__side">
          <span className="arena-backdrop__icon">
            <HobbyIcon icon={iconA.icon} size={ICON_SIZE * 0.8} />
          </span>
          <span className="arena-backdrop__name">{a.name}</span>
        </div>
      </div>
      <div className="arena-backdrop__half arena-backdrop__half--b">
        <Photo src={photos.b} side="b" />
        <div className="arena-backdrop__wash" />
        <div className="arena-backdrop__side">
          <span className="arena-backdrop__icon" style={{ animationDelay: '0.12s' }}>
            <HobbyIcon icon={iconB.icon} size={ICON_SIZE * 0.8} />
          </span>
          <span className="arena-backdrop__name">{b.name}</span>
        </div>
      </div>
      <svg className="arena-backdrop__divider" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polyline points={DIVIDER_POINTS} />
      </svg>
      <p className="arena-backdrop__caption">Worlds apart</p>
    </div>
  )
}

export function ArenaBackdrop({ event }: Props) {
  const [shown, setShown] = useState<BackdropEvent | null>(event)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (event) {
      setShown(event)
      setLeaving(false)
      return
    }
    setLeaving(true)
    const t = window.setTimeout(() => setShown(null), FADE_OUT_MS)
    return () => window.clearTimeout(t)
  }, [event])

  const photos = useMemo<Photos>(
    () => ({ a: pickPhoto(shown?.a.gallery), b: pickPhoto(shown?.b.gallery) }),
    [shown],
  )

  if (!shown) return null

  return (
    <div
      key={shown.id}
      className={`arena-backdrop arena-backdrop--${shown.insight.kind} ${leaving ? 'arena-backdrop--leaving' : ''}`}
      style={{ '--a': shown.a.accent, '--b': shown.b.accent } as CSSProperties}
      aria-hidden
    >
      {shown.insight.kind === 'common' ? (
        <Common event={shown} photos={photos} />
      ) : (
        <Different event={shown} photos={photos} />
      )}
    </div>
  )
}
