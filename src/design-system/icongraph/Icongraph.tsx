import { useState } from 'react'
import IcongraphGuide from './IcongraphGuide'
import { Icon3DTab, MotionTab, MultiColorTab } from './IcongraphIcons'
import '../foundation/Typography.css'
import '../foundation/ColorTabs.css'
import './Icongraph.css'

// IconLibrary(dain-spec.github.io/IconLibrary)의 Guide·MultiColor·3D·Motion을 탭으로 구성합니다.
const tabs = [
  { id: 'guide', label: 'Guide', Page: IcongraphGuide },
  { id: 'multicolor', label: 'MultiColor', Page: MultiColorTab },
  { id: '3d', label: '3D', Page: Icon3DTab },
  { id: 'motion', label: 'Motion', Page: MotionTab },
] as const

type TabId = (typeof tabs)[number]['id']

export default function IcongraphPage() {
  const [active, setActive] = useState<TabId>('guide')
  const ActivePage = tabs.find((t) => t.id === active)!.Page

  return (
    <div className="ds-typography-page ds-typography-page--figma ig-page">
      <div className="ds-page-title">
        <h1>Icongraphy</h1>
        <p>
          아이콘은 서비스 내 기능과 정보를 직관적으로 전달하는 그래픽 요소입니다. Guide에서 제작 기준을 확인하고,
          MultiColor·3D·Motion 탭에서 아이콘을 검색하고 내려받을 수 있습니다.
        </p>
      </div>

      <div className="ds-tabs" role="tablist" aria-label="Icongraphy">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`ig-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls="ig-tabpanel"
            className={`ds-tabs__tab${active === t.id ? ' ds-tabs__tab--active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="ig-tabpanel" role="tabpanel" aria-labelledby={`ig-tab-${active}`}>
        <ActivePage />
      </div>
    </div>
  )
}
