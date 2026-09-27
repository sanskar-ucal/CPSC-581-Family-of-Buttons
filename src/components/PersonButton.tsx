import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { hobbies, type Charge, type Person } from '../data/people'
import { HobbyIcon } from './HobbyIcon'
import { PersonPhoto } from './PersonPhoto'
import './PersonButton.css'

type Props = {
  person: Person
  x: number
  y: number
  radius: number
  hovered: boolean
  onHover: (id: string | null) => void
  bumpPulse: boolean
  charge: Charge
}

const ORBIT_PARTICLES = [0, 120, 240]

function ChargeOrbit({ charge, radius }: { charge: Charge; radius: number }) {
  const positive = charge > 0
  return (
    <span
      className={`charge-orbit ${positive ? 'charge-orbit--pos' : 'charge-orbit--neg'}`}
      style={{ '--orbit-r': `${radius + 14}px` } as CSSProperties}
      aria-hidden
    >
      <span className="charge-orbit__track" />
      {ORBIT_PARTICLES.map((angle) => (
        <span key={angle} className="charge-orbit__particle" style={{ '--a': `${angle}deg` } as CSSProperties}>
          {positive ? '+' : '−'}
        </span>
      ))}
    </span>
  )
}

export function PersonButton({ person, x, y, radius, hovered, onHover, bumpPulse, charge }: Props) {
  const navigate = useNavigate()
  const size = radius * 2
  const badges = person.hobbies
    .map((id) => hobbies[id])
    .filter((h) => h.icon !== person.object)
    .slice(0, 2)

  const classes = ['person-btn', hovered && 'person-btn--flipped', bumpPulse && 'person-btn--bump']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      style={
        {
          width: size,
          height: size,
          transform: `translate(${x - radius}px, ${y - radius}px)`,
          '--accent': person.accent,
        } as CSSProperties
      }
      onMouseEnter={() => onHover(person.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(person.id)}
      onBlur={() => onHover(null)}
      onClick={() => navigate(`/person/${person.id}`)}
      aria-label={`Open profile for ${person.name}`}
    >
      <ChargeOrbit key={charge} charge={charge} radius={radius} />
      <span className="person-btn__ring" />
      <span className="person-btn__card">
        <span className="person-btn__face person-btn__face--front">
          <HobbyIcon icon={person.object} size={Math.round(size * 0.62)} />
        </span>
        <span className="person-btn__face person-btn__face--back">
          <PersonPhoto person={person} />
        </span>
      </span>
      {badges.map((h, i) => (
        <span
          key={h.id}
          className={`person-btn__badge person-btn__badge--${badges.length > 1 && i === 0 ? 'left' : 'right'}`}
          title={h.label}
        >
          <HobbyIcon icon={h.icon} size={20} />
        </span>
      ))}
      <span className="person-btn__meta">
        <span className="person-btn__name">{person.name}</span>
        <span className="person-btn__type">
          {person.typeName}
        </span>
        <span className="person-btn__fact">{person.funFact}</span>
      </span>
    </button>
  )
}
