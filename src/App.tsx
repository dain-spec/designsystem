import { useState } from 'react'
import TypographyPage from './design-system/foundation/Typography'
import ColorPage from './design-system/foundation/Color'
import ScalePage from './design-system/foundation/Scale'
import './App.css'

const pages = {
  Typography: TypographyPage,
  Color: ColorPage,
  Scale: ScalePage,
} as const

type PageName = keyof typeof pages

function App() {
  const [active, setActive] = useState<PageName>('Typography')
  const ActivePage = pages[active]

  return (
    <div className="ds-shell">
      <aside className="ds-nav">
        <div className="ds-nav__brand">Design System</div>
        <nav>
          <div className="ds-nav__group">Foundation</div>
          <ul>
            {(Object.keys(pages) as PageName[]).map((name) => (
              <li
                key={name}
                className={`ds-nav__item${active === name ? ' ds-nav__item--active' : ''}`}
                onClick={() => setActive(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="ds-content">
        <ActivePage />
      </main>
    </div>
  )
}

export default App
