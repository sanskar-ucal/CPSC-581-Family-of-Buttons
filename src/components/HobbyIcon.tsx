import type { IconId } from '../data/people'

type Props = {
  icon: IconId
  size?: number
  className?: string
}

function Controller() {
  return (
    <>
      <path
        d="M30 30 H70 C84 30 92 42 94 58 C96 74 90 84 81 84 C74 84 70 78 66 72 H34 C30 78 26 84 19 84 C10 84 4 74 6 58 C8 42 16 30 30 30 Z"
        fill="#6b4f8a"
        stroke="#2b2f3a"
        strokeWidth="2.5"
      />
      <path
        d="M30 33 H70 C80 33 87 41 90 52 C80 42 68 40 50 40 C32 40 20 42 10 52 C13 41 20 33 30 33 Z"
        fill="#ffffff"
        opacity="0.12"
      />
      <rect x="24" y="44" width="8" height="22" rx="1.5" fill="#e9edf5" />
      <rect x="17" y="51" width="22" height="8" rx="1.5" fill="#e9edf5" />
      <circle cx="72" cy="45" r="4.2" fill="#33a474" />
      <circle cx="80" cy="53" r="4.2" fill="#f25e62" />
      <circle cx="64" cy="53" r="4.2" fill="#4298b4" />
      <circle cx="72" cy="61" r="4.2" fill="#e4ae3a" />
      <rect x="42" y="45" width="6" height="3" rx="1.5" fill="#d6cde3" />
      <rect x="52" y="45" width="6" height="3" rx="1.5" fill="#d6cde3" />
      <circle cx="40" cy="64" r="6.5" fill="#2b2f3a" stroke="#1c1f27" strokeWidth="1.5" />
      <circle cx="60" cy="64" r="6.5" fill="#2b2f3a" stroke="#1c1f27" strokeWidth="1.5" />
    </>
  )
}

function Music() {
  return (
    <g fill="#e4ae3a">
      <polygon points="41,28 84,18 84,30 41,40" />
      <rect x="41" y="28" width="5" height="46" />
      <rect x="79" y="18" width="5" height="46" />
      <ellipse cx="33" cy="74" rx="11" ry="8" transform="rotate(-20 33 74)" />
      <ellipse cx="71" cy="64" rx="11" ry="8" transform="rotate(-20 71 64)" />
    </g>
  )
}

function Camera() {
  return (
    <>
      <rect x="32" y="66" width="36" height="24" rx="2" fill="#ffffff" />
      <rect x="38" y="72" width="24" height="10" rx="1" fill="#ef8f6e" />
      <rect x="14" y="22" width="72" height="54" rx="9" fill="#f6dcae" />
      <rect x="22" y="30" width="13" height="9" rx="2" fill="#4a4458" />
      <rect x="66" y="30" width="13" height="7" rx="2" fill="#ffffff" />
      <circle cx="50" cy="50" r="18" fill="#e7d3ad" stroke="#2b2f3a" strokeWidth="2" />
      <circle cx="50" cy="50" r="12" fill="#6fa8dc" stroke="#2b2f3a" strokeWidth="2" />
      <circle cx="45.5" cy="45.5" r="3.5" fill="#ffffff" opacity="0.8" />
    </>
  )
}

const CLAP_STRIPES = [18, 34, 50, 66]

function Clapperboard() {
  return (
    <>
      <rect x="14" y="44" width="72" height="42" rx="3" fill="#2f3340" stroke="#9aa0ad" strokeWidth="2" />
      <rect x="22" y="58" width="56" height="2.5" rx="1" fill="#6b7280" />
      <rect x="22" y="67" width="56" height="2.5" rx="1" fill="#6b7280" />
      <rect x="22" y="76" width="36" height="2.5" rx="1" fill="#6b7280" />
      <rect x="14" y="36" width="72" height="9" fill="#f3f4f6" stroke="#2b2f3a" strokeWidth="1.5" />
      {CLAP_STRIPES.map((x) => (
        <polygon key={`b${x}`} points={`${x + 4},36 ${x + 12},36 ${x + 8},45 ${x},45`} fill="#1f2230" />
      ))}
      <g transform="rotate(-16 14 36)">
        <rect x="14" y="24" width="72" height="11" fill="#f3f4f6" stroke="#2b2f3a" strokeWidth="1.5" />
        {CLAP_STRIPES.map((x) => (
          <polygon key={`t${x}`} points={`${x},24 ${x + 8},24 ${x + 12},35 ${x + 4},35`} fill="#1f2230" />
        ))}
      </g>
      <circle cx="15" cy="36" r="3" fill="#9aa0ad" />
    </>
  )
}

function Ball() {
  return (
    <g stroke="#2b2f3a" strokeWidth="2.5" fill="none" strokeLinecap="round">
      <circle cx="50" cy="50" r="34" fill="#e8772e" />
      <path d="M50 16 V84 M16 50 H84" />
      <path d="M27 25 C40 38 40 62 27 75 M73 25 C60 38 60 62 73 75" />
    </g>
  )
}

function Plane() {
  return (
    <g transform="rotate(45 50 50)" fill="#5aa9e6" stroke="#1f3b57" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="50,40 90,60 90,67 50,56 10,67 10,60" />
      <polygon points="50,74 67,84 67,89 50,85 33,89 33,84" />
      <rect x="44" y="10" width="12" height="78" rx="6" />
    </g>
  )
}

function Vase() {
  return (
    <>
      <path
        d="M36 14 H64 V20 C64 26 58 28 58 34 C58 40 80 46 80 64 C80 80 68 88 50 88 C32 88 20 80 20 64 C20 46 42 40 42 34 C42 28 36 26 36 20 Z"
        fill="#d9774a"
        stroke="#2b2f3a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="33" y="11" width="34" height="7" rx="3.5" fill="#e8946a" stroke="#2b2f3a" strokeWidth="2.5" />
      <path d="M24 58 H76" stroke="#f6dcae" strokeWidth="4" />
      <path d="M22 68 H78" stroke="#8a3f22" strokeWidth="3" />
      <g fill="#f6dcae">
        <circle cx="34" cy="76" r="2.5" />
        <circle cx="50" cy="78" r="2.5" />
        <circle cx="66" cy="76" r="2.5" />
      </g>
    </>
  )
}

function Hanger() {
  return (
    <>
      <path
        d="M50 22 V16 C50 10 58 10 58 15"
        fill="none"
        stroke="#9aa0ad"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M50 22 L20 34 H80 Z" fill="none" stroke="#9aa0ad" strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M40 30 H60 L58 46 L76 88 H24 L42 46 Z"
        fill="#e86b9a"
        stroke="#2b2f3a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M42 46 H58" stroke="#2b2f3a" strokeWidth="4" />
      <path d="M38 62 L34 84 M50 60 V86 M62 62 L66 84" stroke="#c9477a" strokeWidth="2" />
    </>
  )
}

export function HobbyIcon({ icon, size = 64, className }: Props) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {icon === 'controller' && <Controller />}
      {icon === 'music' && <Music />}
      {icon === 'ball' && <Ball />}
      {icon === 'camera' && <Camera />}
      {icon === 'clapperboard' && <Clapperboard />}
      {icon === 'plane' && <Plane />}
      {icon === 'vase' && <Vase />}
      {icon === 'hanger' && <Hanger />}
    </svg>
  )
}
