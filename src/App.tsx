import { useState } from 'react'
import TypographyPage from './design-system/foundation/Typography'
import ColorPage from './design-system/foundation/Color'
import ScalePage from './design-system/foundation/Scale'
import DateTimeInputDemo from './design-system/components/DateTimeInputDemo'
import TypeBaseDemo from './design-system/components/TypeBaseDemo'
import TypeFormDemo from './design-system/components/TypeFormDemo'
import './App.css'

const foundationPages = {
  Typography: TypographyPage,
  Color: ColorPage,
  Scale: ScalePage,
} as const

const componentPages = {
  'Type-Base': TypeBaseDemo,
  'Type-Form': TypeFormDemo,
  DateTimeInput: DateTimeInputDemo,
} as const

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
  const [active, setActive] = useState<PageName>('Typography')
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
