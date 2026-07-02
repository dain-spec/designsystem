import TypographyPage from './design-system/foundation/Typography'
import './App.css'

function App() {
  return (
    <div className="ds-shell">
      <aside className="ds-nav">
        <div className="ds-nav__brand">Design System</div>
        <nav>
          <div className="ds-nav__group">Foundation</div>
          <ul>
            <li className="ds-nav__item ds-nav__item--active">Typography</li>
          </ul>
        </nav>
      </aside>
      <main className="ds-content">
        <TypographyPage />
      </main>
    </div>
  )
}

export default App
