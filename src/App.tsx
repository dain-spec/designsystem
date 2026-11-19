import { useState } from 'react'
import DesignTokenPage from './design-system/foundation/DesignToken'
import LayoutPage from './design-system/foundation/Layout'
import ColorTabs from './design-system/foundation/ColorTabs'
import TypographyPage from './design-system/foundation/Typography'
import ScalePage from './design-system/foundation/Scale'
import './App.css'

const foundationPages = {
  'Design Token': DesignTokenPage,
  Layout: LayoutPage,
  Color: ColorTabs,
  Typography: TypographyPage,
  Scale: ScalePage,
} as const

const componentPages = {} as const

const pages = { ...foundationPages, ...componentPages }

type PageName = keyof typeof pages

function Header() {
  return (
    <header className="ds-header">
      <div className="ds-header__inner">WHDS Design System</div>
    </header>
  )
}

function App() {
  const [active, setActive] = useState<PageName>('Design Token')
  const ActivePage = pages[active]

  return (
    <>
      <Header />
      <div className="ds-shell">
        <aside className="ds-nav">
          <nav>
            <div className="ds-nav__group">Foundation</div>
            <ul>
              {(Object.keys(foundationPages) as PageName[]).map((name) => (
                <li
                  key={name}
                  className={`ds-nav__item${active === name ? ' ds-nav__item--active' : ''}`}
                  onClick={() => setActive(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
            <div className="ds-nav__group">Components</div>
            <ul>
              {(Object.keys(componentPages) as PageName[]).map((name) => (
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
    </>
  )
}

export default App
