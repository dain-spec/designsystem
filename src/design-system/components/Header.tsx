import '../foundation/Typography.css'
import { assetUrl } from '../icongraph/assetUrl'
import HeaderBar, { type HeaderBarProps } from './HeaderBar'
import './Header.css'

// Figma "Header_2.0" 프레임(node 21595:57800)의 구성을 따릅니다.
// Dropdown·메뉴 팝업(서비스 메뉴, 회사 변경, 프로필 메뉴 등) 예시는 아직 포함하지 않았습니다.

function GuideSize({ label, width, grow }: { label: string; width?: number; grow?: boolean }) {
  return (
    <span className="hd-gs" style={grow ? { flex: 1, minWidth: 0 } : { width }}>
      <span className="hd-gs__label">{label}</span>
      <img src={assetUrl('/header/guide-width.svg')} alt="" />
    </span>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <h2 className="hd-h2">{title}</h2>
      {description && <p className="hd-h2-desc">{description}</p>}
      {children}
    </section>
  )
}

function Category({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="ds-section hd-category">
      <h2 className="hd-h1">{title}</h2>
      <p className="hd-h1-desc">{description}</p>
      {children}
    </section>
  )
}

function Block({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="hd-block">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`hd-panel ${className}`}>{children}</div>
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hd-spec">
      <span className="hd-spec__label">{label}</span>
      {children}
    </div>
  )
}

const COMPANY = '(주)더존비즈온'
const LONG = ['스페이스명 길어질 경우', '서비스명 길어질 경우 몇']
const baseProps: HeaderBarProps = { name: '김더존', rank: '대리' }

export default function HeaderPage() {
  return (
    <div className="ds-typography-page hd-page">
      <header className="hd-head">
        <h1>Header</h1>
        <p>서비스 최상단에 고정되어 로고와 현재 위치를 보여주고, 주요 기능과 계정에 접근할 수 있는 전역 내비게이션입니다.</p>
      </header>

      <Section
        title="Anatomy"
        description="Header는 서비스를 식별하는 Logo, 현재 위치를 나타내는 Breadcrumb, 주요 기능에 접근하는 Utility, 계정 정보를 담은 Profile로 구성됩니다."
      >
        <Panel className="hd-panel--anatomy">
          <div className="hd-guide">
            <GuideSize label="Logo" width={114} />
            <GuideSize label="Breadcrumb" grow />
            <GuideSize label="Utility" width={487} />
            <GuideSize label="Profile" width={120} />
          </div>
          <HeaderBar {...baseProps} path={['스페이스명', '서비스명', '09기']} dropdownLast />
        </Panel>
      </Section>

      <Section title="Types">
        <Panel className="hd-panel--stack">
          <div className="hd-group">
            <span className="hd-spec__label">Logo</span>
            <div className="hd-stack hd-stack--tight">
              <HeaderBar {...baseProps} logo="wehago" company={COMPANY} />
              <HeaderBar {...baseProps} logo="wehago-ai" company={COMPANY} />
              <HeaderBar {...baseProps} logo="wehago-t" company={COMPANY} />
              <HeaderBar {...baseProps} logo="wehago-t-ai" company={COMPANY} />
            </div>
          </div>
          <Spec label="Breadcrumb">
            <HeaderBar {...baseProps} path={['스페이스명', '서비스명', '09기']} dropdownLast />
          </Spec>
        </Panel>
      </Section>

      <Category title="Logo" description="서비스와 제품 라인을 식별하는 로고 영역입니다.">
        <h3 className="hd-h2 hd-h2--sub">Behaviors</h3>
        <Block title="State" description="Logo는 Default, Hovered 상태를 가집니다.">
          <Panel className="hd-panel--stack">
            <Spec label="Default">
              <HeaderBar {...baseProps} company={COMPANY} />
            </Spec>
            <Spec label="Hovered">
              <HeaderBar {...baseProps} company={COMPANY} hovered="icons" hoveredProfile />
            </Spec>
          </Panel>
        </Block>
        <Block title="Dark Mode" description="어두운 배경에서는 Dark Mode를 사용합니다.">
          <Panel className="hd-panel--stack">
            <HeaderBar {...baseProps} logo="wehago-ai" company={COMPANY} dark />
          </Panel>
        </Block>
      </Category>

      <Category
        title="Breadcrumb"
        description="현재 화면의 위치를 경로 형태로 보여주는 영역으로, 진입 맥락에 따라 표시 형태가 달라집니다."
      >
        <h3 className="hd-h2 hd-h2--sub">Variants</h3>
        <Block
          title="Type"
          description="메인, 서비스, 서비스 마켓 등 진입 위치에 따라 경로 구성이 달라집니다. 항목 이름이 길면 말줄임표(…)로 표시합니다."
        >
          <Panel className="hd-panel--stack">
            <Spec label="메인 진입 시">
              <HeaderBar {...baseProps} path={[COMPANY]} />
            </Spec>
            <Spec label="서비스 진입 시">
              <HeaderBar {...baseProps} path={[COMPANY, '연락처']} />
            </Spec>
            <Spec label="서비스 마켓 진입 시">
              <HeaderBar {...baseProps} path={[COMPANY, '서비스 마켓']} />
            </Spec>
            <Spec label="최대 글자수">
              <HeaderBar name="사용자 이름" rank="직급다섯자이상" path={['스페이스명 길어질 경우 몇', '서비스명 길어질 경우 몇']} />
            </Spec>
          </Panel>
        </Block>

        <h3 className="hd-h2 hd-h2--sub">Behaviors</h3>
        <Block title="State" description="Breadcrumb의 각 항목에 Hover하면 관련 메뉴가 열리며, 항목에 따라 다른 동작을 제공합니다.">
          <Panel className="hd-panel--stack">
            <Spec label="Hovered - 최대 글자 수">
              <HeaderBar name="사용자 이름" rank="직급다섯자이상" path={['스페이스명 길어질 경우 몇', '서비스명 길어질 경우 몇']} hovered="path" hoveredProfile />
            </Spec>
          </Panel>
        </Block>
        <Block title="Dark Mode" description="어두운 배경에서는 Dark Mode를 사용합니다.">
          <Panel className="hd-panel--stack">
            <HeaderBar name="사용자 이름" rank="직급다섯자이상" logo="wehago-ai" path={LONG} dark />
          </Panel>
        </Block>
      </Category>
    </div>
  )
}
