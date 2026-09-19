import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { getPerson } from '../data/people'
import './PersonPage.css'

export function PersonPage() {
  const { id } = useParams()
  const person = id ? getPerson(id) : undefined

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
      <header className="person-page__top">
        <Link className="person-page__back" to="/">
          ← Back to arena
        </Link>
        <ThemeToggle />
      </header>

      <div className="person-page__hero">
        <img className="person-page__avatar" src={person.avatar} alt="" />
        <div>
          <p className="person-page__type">
            {person.typeName} · {person.typeCode}
          </p>
          <h1>{person.name}</h1>
          <p className="person-page__fact">{person.funFact}</p>
        </div>
      </div>

      <section className="person-page__section">
        <h2>About</h2>
        <p>{person.summary}</p>
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
