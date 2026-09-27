import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { Person } from '../data/people'
import './PhotoCarousel.css'

const SLOT_COUNT = 4

type Props = {
  person: Person
}

function CameraIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.3l1.2-1.8A1.5 1.5 0 0 1 10.2 3.5h3.6a1.5 1.5 0 0 1 1.2.7L16.2 6h1.3A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function PhotoCarousel({ person }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => person.gallery?.[i])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[]
      const center = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (index: number) => {
    const track = trackRef.current
    const clamped = Math.max(0, Math.min(SLOT_COUNT - 1, index))
    const card = track?.children[clamped] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: 'smooth',
    })
    setActive(clamped)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    }
  }

  return (
    <div className="carousel" style={{ '--accent': person.accent } as CSSProperties}>
      <div
        ref={trackRef}
        className="carousel__track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${person.name}'s photos`}
        onKeyDown={onKeyDown}
      >
        {slots.map((src, i) => (
          <figure
            key={i}
            className={`carousel__card ${i === active ? 'carousel__card--active' : ''}`}
            aria-label={`Photo ${i + 1} of ${SLOT_COUNT}`}
          >
            {src ? (
              <>
                <img className="carousel__backdrop" src={src} alt="" aria-hidden draggable={false} />
                <img
                  className="carousel__photo"
                  src={src}
                  alt={`${person.name}, photo ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </>
            ) : (
              <div className="carousel__placeholder">
                <CameraIcon />
                <span>Photo {i + 1}</span>
              </div>
            )}
          </figure>
        ))}
      </div>

      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__arrow"
          aria-label="Previous photo"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          ‹
        </button>
        <div className="carousel__dots">
          {slots.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel__dot ${i === active ? 'carousel__dot--active' : ''}`}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="carousel__arrow"
          aria-label="Next photo"
          disabled={active === SLOT_COUNT - 1}
          onClick={() => goTo(active + 1)}
        >
          ›
        </button>
      </div>
    </div>
  )
}
