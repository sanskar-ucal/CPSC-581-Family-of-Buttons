import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Person } from '../data/people'
import { TraitPieChart } from './TraitPieChart'
import './PersonButton.css'

type Props = {
  person: Person
  x: number
  y: number
  radius: number
  hovered: boolean
  onHover: (id: string | null) => void
  bumpPulse: boolean
}

export function PersonButton({
  person,
  x,
  y,
  radius,
  hovered,
  onHover,
  bumpPulse,
}: Props) {
  const navigate = useNavigate()
  const size = radius * 2

  return (
    <button
      type="button"
      className={`person-btn ${hovered ? 'person-btn--hovered' : ''} ${bumpPulse ? 'person-btn--bump' : ''}`}
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
      <span className="person-btn__ring" />
      <img className="person-btn__avatar" src={person.avatar} alt="" draggable={false} />
      <span className="person-btn__meta">
        <span className="person-btn__name">{person.name}</span>
        <span className="person-btn__type">
          {person.typeName} ({person.typeCode})
        </span>
        <span className="person-btn__fact">{person.funFact}</span>
      </span>
      <TraitPieChart traits={person.traits} visible={hovered} />
    </button>
  )
}
