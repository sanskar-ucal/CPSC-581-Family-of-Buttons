export type Trait = {
  label: string
  percent: number
  color: string
  opposite: string
}

export type Person = {
  id: string
  name: string
  typeCode: string
  typeName: string
  avatar: string
  accent: string
  funFact: string
  summary: string
  traits: Trait[]
  insights: { title: string; text: string }[]
}

export const people: Person[] = [
  {
    id: 'sanskar',
    name: 'Sanskar',
    typeCode: 'ENTJ-A',
    typeName: 'Commander',
    avatar: '/avatars/sanskar.svg',
    accent: '#88619a',
    funFact: 'Loves momentum — always finding a way, or making one.',
    summary:
      'Commanders are bold, imaginative, and strong-willed, always finding a way — or making one. These decisive types love momentum and accomplishment, often acting on their creative visions.',
    traits: [
      { label: 'Extraverted', percent: 64, color: '#4298b4', opposite: 'Introverted' },
      { label: 'Intuitive', percent: 74, color: '#e4ae3a', opposite: 'Observant' },
      { label: 'Thinking', percent: 81, color: '#33a474', opposite: 'Feeling' },
      { label: 'Judging', percent: 82, color: '#88619a', opposite: 'Prospecting' },
      { label: 'Assertive', percent: 60, color: '#f25e62', opposite: 'Turbulent' },
    ],
    insights: [
      {
        title: 'Energy',
        text: 'You likely get energized by social interaction and tend to openly express your enthusiasm and excitement.',
      },
      {
        title: 'Mind',
        text: "You're likely very imaginative and open-minded, focusing on hidden meanings and distant possibilities.",
      },
      {
        title: 'Nature',
        text: 'You likely focus on objectivity and rationality, putting effectiveness above social harmony.',
      },
      {
        title: 'Tactics',
        text: "You're likely organized, decisive, and thorough, valuing structure and planning over spontaneity.",
      },
      {
        title: 'Identity',
        text: "You're likely self-assured, even-tempered, and resistant to stress, refusing to worry too much.",
      },
    ],
  },
  {
    id: 'friend2',
    name: 'Friend 2',
    typeCode: 'TBD',
    typeName: 'Placeholder',
    avatar: '/avatars/friend2.png',
    accent: '#2d8a9e',
    funFact: 'Placeholder fun fact — swap this later.',
    summary:
      'Friend 2’s full personality profile will go here once we add their 16Personalities results.',
    traits: [
      { label: 'Introverted', percent: 58, color: '#4298b4', opposite: 'Extraverted' },
      { label: 'Observant', percent: 62, color: '#e4ae3a', opposite: 'Intuitive' },
      { label: 'Feeling', percent: 70, color: '#33a474', opposite: 'Thinking' },
      { label: 'Prospecting', percent: 55, color: '#88619a', opposite: 'Judging' },
      { label: 'Turbulent', percent: 65, color: '#f25e62', opposite: 'Assertive' },
    ],
    insights: [
      {
        title: 'Coming soon',
        text: 'Real insights will replace this placeholder when Friend 2’s data is added.',
      },
    ],
  },
  {
    id: 'friend3',
    name: 'Friend 3',
    typeCode: 'TBD',
    typeName: 'Placeholder',
    avatar: '/avatars/friend3.png',
    accent: '#c46b3a',
    funFact: 'Another placeholder fun fact for later.',
    summary:
      'Friend 3’s full personality profile will go here once we add their 16Personalities results.',
    traits: [
      { label: 'Extraverted', percent: 72, color: '#4298b4', opposite: 'Introverted' },
      { label: 'Intuitive', percent: 51, color: '#e4ae3a', opposite: 'Observant' },
      { label: 'Feeling', percent: 66, color: '#33a474', opposite: 'Thinking' },
      { label: 'Judging', percent: 60, color: '#88619a', opposite: 'Prospecting' },
      { label: 'Assertive', percent: 54, color: '#f25e62', opposite: 'Turbulent' },
    ],
    insights: [
      {
        title: 'Coming soon',
        text: 'Real insights will replace this placeholder when Friend 3’s data is added.',
      },
    ],
  },
]

const commonalityMap: Record<string, string[]> = {
  'friend2-sanskar': [
    'Both thrive when there’s a clear goal to chase.',
    'Shared love of late-night brainstorming sessions.',
  ],
  'friend3-sanskar': [
    'Both bring high energy to group projects.',
    'Prefer deciding fast over endless debate.',
  ],
  'friend2-friend3': [
    'Both value creative collaboration.',
    'Placeholder commonality — replace later.',
  ],
}

export function getPerson(id: string): Person | undefined {
  return people.find((p) => p.id === id)
}

export function pairKey(a: string, b: string): string {
  return [a, b].sort().join('-')
}

export function getCommonalities(a: string, b: string): string[] {
  return (
    commonalityMap[pairKey(a, b)] ?? [
      'Something in common (placeholder).',
      'Add a real commonality here later.',
    ]
  )
}
