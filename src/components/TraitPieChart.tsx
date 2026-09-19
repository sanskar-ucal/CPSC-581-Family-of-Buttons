import type { Trait } from '../data/people'
import './TraitPieChart.css'

type Props = {
  traits: Trait[]
  visible: boolean
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end)
  const e = polar(cx, cy, r, start)
  const large = end - start <= 180 ? 0 : 1
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`
}

export function TraitPieChart({ traits, visible }: Props) {
  const total = traits.reduce((sum, t) => sum + t.percent, 0) || 1
  const cx = 70
  const cy = 70
  const r = 52
  const stroke = 18

  let angle = 0
  const segments = traits.map((trait) => {
    const sweep = (trait.percent / total) * 360
    const start = angle
    const end = angle + sweep
    angle = end
    return { trait, start, end, path: arcPath(cx, cy, r, start, end) }
  })

  return (
    <div className={`trait-pie ${visible ? 'trait-pie--visible' : ''}`} aria-hidden={!visible}>
      <div className="trait-pie__glow" />
      <svg className="trait-pie__svg" viewBox="0 0 140 140" width="140" height="140">
        <circle cx={cx} cy={cy} r={r} className="trait-pie__track" />
        {segments.map(({ trait, path }) => (
          <path
            key={trait.label}
            d={path}
            fill="none"
            stroke={trait.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            className="trait-pie__seg"
          />
        ))}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 4} className="trait-pie__hole" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="trait-pie__center-label">
          Traits
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="trait-pie__center-sub">
          {traits.length}
        </text>
      </svg>
      <ul className="trait-pie__legend">
        {traits.map((t) => (
          <li key={t.label}>
            <span className="trait-pie__swatch" style={{ background: t.color }} />
            <span className="trait-pie__name">{t.label}</span>
            <span className="trait-pie__pct">{t.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
