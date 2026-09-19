import { FloatingArena } from '../components/FloatingArena'
import { ThemeToggle } from '../components/ThemeToggle'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-page__header">
        <div>
          <p className="home-page__eyebrow">CPSC 581 · Group Project 1</p>
          <h1 className="home-page__title">A Family of Buttons</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="home-page__arena">
        <FloatingArena />
      </main>
    </div>
  )
}
