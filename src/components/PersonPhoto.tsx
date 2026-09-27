import type { Person } from '../data/people'
import './PersonPhoto.css'

type Props = {
  person: Person
  className?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function PersonPhoto({ person, className = '' }: Props) {
  if (person.photo) {
    return <img className={`person-photo ${className}`} src={person.photo} alt={person.name} draggable={false} />
  }

  return (
    <span className={`person-photo person-photo--placeholder ${className}`}>
      <span className="person-photo__initials">{initials(person.name)}</span>
      <span className="person-photo__note">photo coming soon</span>
    </span>
  )
}
