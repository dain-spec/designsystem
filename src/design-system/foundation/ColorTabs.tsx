import { useState } from 'react'
import ColorOverviewPage from './ColorOverview'
import ColorPaletteTab from './Color'
import './ColorTabs.css'

// Figma Color01_2.0, Color02_2.0 두 프레임을 Color 메뉴 안의 탭으로 구성합니다.
const tabs = [
  { id: 'color1', label: 'Color 1', Page: ColorOverviewPage },
  { id: 'color2', label: 'Color 2', Page: ColorPaletteTab },
] as const

export default function ColorTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('color1')
  const ActivePage = tabs.find((t) => t.id === active)!.Page

  const tabBar = (
    <div className="ds-tabs" role="tablist" aria-label="Color">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={active === t.id}
          aria-controls="color-tabpanel"
          className={`ds-tabs__tab${active === t.id ? ' ds-tabs__tab--active' : ''}`}
          onClick={() => setActive(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )

  // 탭 줄은 각 페이지의 제목과 설명 바로 아래에 놓입니다.
  return (
    <div id="color-tabpanel" role="tabpanel" aria-labelledby={`tab-${active}`}>
      <ActivePage afterTitle={tabBar} />
    </div>
  )
}
