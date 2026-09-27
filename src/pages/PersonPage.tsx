import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AmbientBackdrop } from '../components/AmbientBackdrop'
import { HobbyIcon } from '../components/HobbyIcon'
import { PersonPhoto } from '../components/PersonPhoto'
import { PhotoCarousel } from '../components/PhotoCarousel'
import { ThemeToggle } from '../components/ThemeToggle'
import { VinylDisc } from '../components/VinylDisc'
import { getPerson, hobbies } from '../data/people'
import './PersonPage.css'

export function PersonPage() {
  const { id } = useParams()
  const person = id ? getPerson(id) : undefined
  const audioRef = useRef<HTMLAudioElement>(null)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setAutoplayBlocked(false)
    audio.currentTime = 0
    audio
      .play()
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'NotAllowedError') setAutoplayBlocked(true)
      })
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [person?.id])

  if (!person) {
    return (
      <div className="person-page person-page--missing">
        <p>Person not found.</p>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  return (
    <div
      className="person-page"
      style={{ '--accent': person.accent } as CSSProperties}
    >
      <AmbientBackdrop key={person.id} images={person.gallery ?? []} />
      <header className="person-page__top">
        <Link className="person-page__back" to="/">
          ← Back to arena
        </Link>
        <ThemeToggle />
      </header>

      <audio key={person.id} ref={audioRef} src={person.song.src} loop preload="auto" />

      <div className="person-page__hero">
        <div className="person-page__intro">
          <div className="person-page__avatar">
            <PersonPhoto person={person} />
            <span className="person-page__object">
              <HobbyIcon icon={person.object} size={44} />
            </span>
          </div>
          <div>
            <p className="person-page__type">
              {person.typeName}
            </p>
            <h1>{person.name}</h1>
            <p className="person-page__fact">{person.funFact}</p>
          </div>
        </div>
        <VinylDisc key={person.id} person={person} audioRef={audioRef} autoplayBlocked={autoplayBlocked} />
      </div>

      <section className="person-page__section">
        <h2>Gallery</h2>
        <PhotoCarousel key={person.id} person={person} />
      </section>

      <section className="person-page__section">
        <h2>About</h2>
        <p>{person.summary}</p>
      </section>

      <section className="person-page__section">
        <h2>Hobbies</h2>
        <ul className="person-page__hobbies">
          {person.hobbies.map((id) => (
            <li key={id}>
              <HobbyIcon icon={hobbies[id].icon} size={32} />
              <span>{hobbies[id].label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="person-page__section">
        <h2>Traits</h2>
        <ul className="person-page__traits">
          {person.traits.map((t) => (
            <li key={t.label}>
              <div className="person-page__trait-head">
                <span>{t.label}</span>
                <span className="person-page__trait-pct" style={{ color: t.color }}>
                  {t.percent}%
                </span>
              </div>
              <div className="person-page__bar">
                <div
                  className="person-page__bar-fill"
                  style={{ width: `${t.percent}%`, background: t.color }}
                />
              </div>
              <p className="person-page__opposite">vs {t.opposite}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="person-page__section">
        <h2>Insights</h2>
        <div className="person-page__insights">
          {person.insights.map((insight) => (
            <article key={insight.title}>
              <h3>{insight.title}</h3>
              <p>{insight.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
