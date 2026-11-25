import { useEffect, useState } from 'react'
import DesignTokenPage from './design-system/foundation/DesignToken'
import LayoutPage from './design-system/foundation/Layout'
import ColorTabs from './design-system/foundation/ColorTabs'
import TypographyPage from './design-system/foundation/Typography'
import ScalePage from './design-system/foundation/Scale'
import IcongraphPage from './design-system/icongraph/Icongraph'
import InputFieldPage from './design-system/components/InputField'
import TextAreaPage from './design-system/components/TextArea'
import DropdownPage from './design-system/components/Dropdown'
import SearchbarPage from './design-system/components/Searchbar'
import PickerPage from './design-system/components/Picker'
import SelectControlPage from './design-system/components/SelectControl'
import ButtonGuidePage from './design-system/components/ButtonGuide'
import FloatingButtonPage from './design-system/components/FloatingButton'
import FileUploadPage from './design-system/components/FileUpload'
import ActionBarPage from './design-system/components/ActionBar'
import DateTimeInputPage from './design-system/components/DateTimeInput'
import HeaderPage from './design-system/components/Header'
import './App.css'

const foundationPages = {
  'Design Token': DesignTokenPage,
  Layout: LayoutPage,
  Color: ColorTabs,
  Typography: TypographyPage,
  Scale: ScalePage,
  Icongraphy: IcongraphPage,
} as const

const componentPages = {
  InputField: InputFieldPage,
  TextArea: TextAreaPage,
  DateTimeInput: DateTimeInputPage,
  Dropdown: DropdownPage,
  Searchbar: SearchbarPage,
  Picker: PickerPage,
  SelectControl: SelectControlPage,
  Button: ButtonGuidePage,
  FloatingButton: FloatingButtonPage,
  FileUpload: FileUploadPage,
  ActionBar: ActionBarPage,
  Header: HeaderPage,
} as const

const pages = { ...foundationPages, ...componentPages }

type PageName = keyof typeof pages

// 새로고침해도 현재 페이지를 유지하도록 URL 해시(#InputField)에 페이지 이름을 저장합니다.
const DEFAULT_PAGE: PageName = 'Design Token'

function pageFromHash(): PageName {
  const name = decodeURIComponent(window.location.hash.slice(1))
  return name in pages ? (name as PageName) : DEFAULT_PAGE
}

function Header() {
  return (
    <header className="ds-header">
      <div className="ds-header__inner">WHDS Design System</div>
    </header>
  )
}

function App() {
  const [active, setActive] = useState<PageName>(pageFromHash)

  useEffect(() => {
    const onHashChange = () => setActive(pageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goTo = (name: PageName) => {
    window.location.hash = encodeURIComponent(name)
    setActive(name)
  }
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
                  onClick={() => goTo(name)}
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
                  onClick={() => goTo(name)}
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
