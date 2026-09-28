export type Trait = {
  label: string
  percent: number
  color: string
  opposite: string
}

export type IconId =
  | 'controller'
  | 'music'
  | 'ball'
  | 'camera'
  | 'clapperboard'
  | 'plane'
  | 'vase'
  | 'hanger'

export type HobbyId =
  | 'gaming'
  | 'music'
  | 'sports'
  | 'photography'
  | 'travel'
  | 'pottery'
  | 'fashion'
  | 'movies'

export type Hobby = {
  id: HobbyId
  label: string
  icon: IconId
}

export const hobbies: Record<HobbyId, Hobby> = {
  gaming: { id: 'gaming', label: 'Gaming', icon: 'controller' },
  music: { id: 'music', label: 'Music', icon: 'music' },
  sports: { id: 'sports', label: 'Sports', icon: 'ball' },
  photography: { id: 'photography', label: 'Photography', icon: 'camera' },
  travel: { id: 'travel', label: 'Travelling', icon: 'plane' },
  pottery: { id: 'pottery', label: 'Pottery', icon: 'vase' },
  fashion: { id: 'fashion', label: 'Fashion', icon: 'hanger' },
  movies: { id: 'movies', label: 'Watching movies', icon: 'clapperboard' },
}

export type Charge = 1 | -1

export type Song = {
  title: string
  artist: string
  src: string
  cover?: string
}

export type Person = {
  id: string
  name: string
  typeName: string
  object: IconId
  hobbies: HobbyId[]
  photo?: string
  gallery?: string[]
  song: Song
  accent: string
  funFact: string
  summary: string
  traits: Trait[]
  insights: { title: string; text: string }[]
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const people: Person[] = [
  {
    id: 'sanskar',
    name: 'Sanskar Jha',
    typeName: 'Commander',
    photo: asset('avatars/sanskar.jpg'),
    object: 'controller',
    hobbies: ['gaming', 'sports', 'music'],
    song: {
      title: 'Roslyn',
      artist: 'Bon Iver & St. Vincent',
      src: asset('music/sanskar.mp3'),
      cover: asset('covers/sanskar.jpg'),
    },
    gallery: [
      asset('photos/sanskar1.jpg'),
      asset('photos/sanskar2.jpg'),
      asset('photos/sanskar3.jpg'),
      asset('photos/sanskar4.jpg'),
    ],
    accent: '#88619a',
    funFact: 'Loves momentum. Always finding a way, or making one.',
    summary:
      "Hi, I'm Sanskar! I'm a fourth-year Computer Science student who loves software development and has completed two software engineering co-ops at RBC in Toronto. Outside of coding and academics, I love playing video games (can't wait for GTA 6!), playing guitar and piano, and enjoying outdoor activities like golfing and trekking. Last summer, I even got to trek through the Himalayas!",
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
        text: 'Sanskar likely gets energized by social interaction and tends to openly express his enthusiasm and excitement.',
      },
      {
        title: 'Mind',
        text: 'Sanskar is likely very imaginative and open-minded, focusing on hidden meanings and distant possibilities.',
      },
      {
        title: 'Nature',
        text: 'Sanskar likely focuses on objectivity and rationality, putting effectiveness above social harmony.',
      },
      {
        title: 'Tactics',
        text: 'Sanskar is likely organized, decisive, and thorough, valuing structure and planning over spontaneity.',
      },
      {
        title: 'Identity',
        text: 'Sanskar is likely self-assured, even-tempered, and resistant to stress, refusing to worry too much.',
      },
    ],
  },
  {
    id: 'mimi',
    name: 'Amina Abdi',
    typeName: 'Consul',
    photo: asset('avatars/mimi.jpg'),
    object: 'camera',
    hobbies: ['photography', 'pottery', 'fashion'],
    song: {
      title: 'Rein Me In',
      artist: 'Sam Fender & Olivia Dean',
      src: asset('music/mimi.mp3'),
      cover: asset('covers/mimi.jpg'),
    },
    gallery: [
      asset('photos/mimi1.webp'),
      asset('photos/mimi2.webp'),
      asset('photos/mimi3.webp'),
      asset('photos/mimi4.webp'),
    ],
    accent: '#33a474',
    funFact: 'Leads with empathy. Harmony first, always.',
    summary:
      "Hi, I'm Amina! I'm a computer science student who loves exploring the world, one trip, one meal and one photo at a time. I'm always up for meeting new people, trying a new cuisine, or snapping a cute picture to remember the moment.",
    traits: [
      { label: 'Extraverted', percent: 57, color: '#4298b4', opposite: 'Introverted' },
      { label: 'Observant', percent: 62, color: '#e4ae3a', opposite: 'Intuitive' },
      { label: 'Feeling', percent: 79, color: '#33a474', opposite: 'Thinking' },
      { label: 'Judging', percent: 61, color: '#88619a', opposite: 'Prospecting' },
      { label: 'Turbulent', percent: 85, color: '#f25e62', opposite: 'Assertive' },
    ],
    insights: [
      {
        title: 'Nature',
        text: 'Amina likely values emotional expression and sensitivity, prioritizing empathy, social harmony, and cooperation.',
      },
      {
        title: 'Energy',
        text: 'Amina likely gets energized by social interaction and tends to openly express her enthusiasm and excitement.',
      },
      {
        title: 'Mind',
        text: 'Amina is likely practical and grounded, focusing on what she can see and experience firsthand.',
      },
      {
        title: 'Tactics',
        text: 'Amina is likely organized and prefers clear plans, valuing structure when supporting the people around her.',
      },
      {
        title: 'Identity',
        text: 'Amina is likely self-conscious and sensitive to stress, often pushing herself to meet high standards.',
      },
    ],
  },
  {
    id: 'tanishk',
    name: 'Tanishk Batish',
    typeName: 'Architect',
    photo: asset('avatars/tanishk.jpg'),
    object: 'clapperboard',
    hobbies: ['movies', 'music', 'travel'],
    song: {
      title: 'Carry You Home',
      artist: 'Alex Warren',
      src: asset('music/tanishk.mp3'),
      cover: asset('covers/tanishk.jpg'),
    },
    gallery: [
      asset('photos/tanishk1.webp'),
      asset('photos/tanishk2.webp'),
      asset('photos/tanishk3.webp'),
      asset('photos/tanishk4.webp'),
    ],
    accent: '#5e4b8b',
    funFact: 'Has a plan for everything, then a backup plan too.',
    summary:
      "Hi, I'm Tanishk, third-year Computer Science student who enjoys learning about technology and exploring new ideas. Outside of academics, I love listening to music, travelling to new places, and watching movies. I enjoy trying new experiences, meeting new people, and making the most of my free time.",
    traits: [
      { label: 'Introverted', percent: 68, color: '#4298b4', opposite: 'Extraverted' },
      { label: 'Intuitive', percent: 75, color: '#e4ae3a', opposite: 'Observant' },
      { label: 'Thinking', percent: 54, color: '#33a474', opposite: 'Feeling' },
      { label: 'Judging', percent: 57, color: '#88619a', opposite: 'Prospecting' },
      { label: 'Assertive', percent: 61, color: '#f25e62', opposite: 'Turbulent' },
    ],
    insights: [
      {
        title: 'Mind',
        text: 'Tanishk likely prefers solitude to recharge and tends to process ideas carefully before sharing them.',
      },
      {
        title: 'Energy',
        text: 'Tanishk is likely imaginative and future-focused, spotting patterns and possibilities others miss.',
      },
      {
        title: 'Nature',
        text: 'Tanishk likely leans on logic and objectivity when making decisions, even when feelings run high.',
      },
      {
        title: 'Tactics',
        text: 'Tanishk is likely structured and decisive, preferring a clear plan over leaving things to chance.',
      },
      {
        title: 'Identity',
        text: 'Tanishk is likely confident under pressure and trusts his own judgment when navigating challenges.',
      },
    ],
  },
]

export type PairInsight = {
  kind: 'common' | 'different'
  sharedHobbies: Hobby[]
  uniqueA: Hobby[]
  uniqueB: Hobby[]
  lines: string[]
}

export function getPerson(id: string): Person | undefined {
  return people.find((p) => p.id === id)
}

export function pairKey(a: string, b: string): string {
  return [a, b].sort().join('-')
}

// traits[i] is the pole each person leans toward on the same dimension (E/I, N/S, T/F, J/P, A/T)
function sharedTraitSides(a: Person, b: Person): string[] {
  return a.traits.filter((t, i) => b.traits[i]?.label === t.label).map((t) => t.label)
}

function sharedHobbyIds(a: Person, b: Person): HobbyId[] {
  return a.hobbies.filter((h) => b.hobbies.includes(h))
}

/** -1..1: positive pairs attract (similar), negative pairs repel (different) */
export function getAffinity(a: Person, b: Person): number {
  const traitScore = sharedTraitSides(a, b).length / a.traits.length
  const hobbyScore = sharedHobbyIds(a, b).length > 0 ? 0.4 : 0
  return 0.6 * traitScore + hobbyScore - 0.5
}

export function getPairInsight(a: Person, b: Person): PairInsight {
  const shared = sharedHobbyIds(a, b)
  const sharedHobbies = shared.map((id) => hobbies[id])
  const uniqueA = a.hobbies.filter((h) => !shared.includes(h)).map((id) => hobbies[id])
  const uniqueB = b.hobbies.filter((h) => !shared.includes(h)).map((id) => hobbies[id])

  if (getAffinity(a, b) > 0) {
    const lines = [
      ...sharedHobbies.map((h) => `Both love ${h.label.toLowerCase()}.`),
      ...sharedTraitSides(a, b).map((label) => `Both ${label}.`),
    ]
    return { kind: 'common', sharedHobbies, uniqueA, uniqueB, lines }
  }

  const differing = a.traits
    .map((t, i) => ({ a: t.label, b: b.traits[i]?.label }))
    .filter((pair) => pair.b && pair.a !== pair.b)
    .slice(0, 3)
    .map((pair) => `${a.name} is ${pair.a}, ${b.name} is ${pair.b}.`)

  const hobbyLines = [
    uniqueA.length > 0 && `${a.name} is into ${uniqueA.map((h) => h.label.toLowerCase()).join(', ')}.`,
    uniqueB.length > 0 && `${b.name} is into ${uniqueB.map((h) => h.label.toLowerCase()).join(', ')}.`,
  ].filter((line): line is string => Boolean(line))

  return { kind: 'different', sharedHobbies, uniqueA, uniqueB, lines: [...differing, ...hobbyLines] }
}
