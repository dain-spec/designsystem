import '../foundation/Typography.css'
import '../../components/Dropdown/Dropdown.css'
import './InputField.css'
import './Dropdown.css'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import type { DropdownSize, DropdownState } from '../../components/Dropdown/Dropdown'

// Figma "Dropdown_2.0" 프레임(node 21433:59778)의 구성을 따릅니다.
// 페이지 공통 스타일(제목, 섹션, 패널, 가이드선)은 InputField.css를 함께 씁니다.

const ITEMS = ['현재 선택된 값', '리스트 항목', '리스트 항목', '리스트 항목', '리스트 항목']

function Guide({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`ds-if-guide ${className}`} style={style}>
      {children}
    </span>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <div className="ds-section-heading">
        <h2>{title}</h2>
      </div>
      {description && <p className="ds-if-section-desc">{description}</p>}
      {children}
    </section>
  )
}

function Block({ title, description, children, panelClass = '' }: { title?: string; description?: React.ReactNode; children: React.ReactNode; panelClass?: string }) {
  return (
    <div className="ds-if-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      <div className={`ds-panel ds-if-panel ${panelClass}`}>{children}</div>
    </div>
  )
}

function Dim({ height, children, className = '', style }: { height: number; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`ds-if-dim ${className}`} style={{ height, ...style }}>
      {children}
    </span>
  )
}


function Menu() {
  return (
    <ul className="dd-menu" role="listbox">
      {ITEMS.map((label, i) => (
        <li key={i}>
          <span className={`dd-menu__item${i === 0 ? ' dd-menu__item--selected' : ''}`}>{label}</span>
        </li>
      ))}
    </ul>
  )
}

function Box({ state, value, placeholder, size, open }: { state?: DropdownState; value?: string; placeholder?: string; size?: DropdownSize; open?: boolean }) {
  return (
    <div className="ds-dd">
      <div className="dd-wrap">
        <Dropdown state={open ? 'Focused' : state} value={value} placeholder={placeholder} size={size} disabled={state === 'Disabled'} />
        {open && <Menu />}
        {open && <span className="ds-dd__scroll" />}
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-dd-labeled">
      <span className="ds-if-label">
        진행상태
        <em>*</em>
      </span>
      {children}
    </div>
  )
}

const STATES: { label: string; node: React.ReactNode }[] = [
  { label: 'Default', node: <Box state="Default" /> },
  { label: 'Focused', node: <Box state="Focused" /> },
  { label: 'Opened', node: <Box open value="현재 선택된 값" /> },
  { label: 'Completed', node: <Box state="Completed" value="선택한 값" /> },
  { label: 'Disabled', node: <Box state="Disabled" /> },
]

export default function DropdownPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>Dropdown</h1>
        <p>목록에서 하나의 옵션을 선택할 때 사용하는 폼 컴포넌트입니다. 옵션 목록은 팝오버로 표시됩니다.</p>
      </header>

      <Section
        title="Anatomy"
        description="Dropdown은 입력 영역인 Container, ListMenu, ListMenu를 여는 Trailing Icon으로 구성되며, 필요에 따라 Label을 함께 표시할 수 있습니다."
      >
        <Block panelClass="ds-dd-panel">
          {/* Figma Dropdown_2.0 Anatomy(780×311) 좌표를 가운데(x=390) 기준 오프셋으로 옮긴 배치 */}
          <div className="ds-dd-stage">
            <Guide className="ds-dd-g ds-if-pin ds-if-pin--down" style={{ left: 'calc(50% - 59px)', top: 10, '--pin-len': '11px' } as React.CSSProperties}>Label (Optional)</Guide>
            <Guide className="ds-dd-g ds-if-pin ds-if-pin--down" style={{ left: 'calc(50% + 70px)', top: 10, '--pin-len': '50px' } as React.CSSProperties}>Trailing Icon</Guide>
            <Guide className="ds-dd-g ds-dd-g--item ds-if-pin ds-if-pin--right" style={{ left: 'calc(50% - 155px)', top: 114 }}>ListItem</Guide>
            <div className="ds-dd-stage__field">
              <Label>
                <Box open value="현재 선택된 값" />
              </Label>
            </div>
            <Dim height={32} className="ds-dd-dim" style={{ left: 'calc(50% + 93px)', top: 67 }}>
              <i className="ds-if-bar" style={{ height: 32 }} />
              <Guide>Container</Guide>
            </Dim>
            <Dim height={168} className="ds-dd-dim" style={{ left: 'calc(50% + 93px)', top: 103 }}>
              <i className="ds-if-bar" style={{ height: 168 }} />
              <Guide>ListMenu</Guide>
            </Dim>
          </div>
        </Block>
      </Section>

      <Section title="Variants">
        <Block title="Label" description="Label을 입력 영역 위에 배치할 때는 두 요소 사이에 6px의 간격을 둡니다.">
          <Label>
            <Box state="Completed" value="전체" />
          </Label>
        </Block>
        <Block title="Dropdown + Button" description="Dropdown을 Button 등 다른 컴포넌트와 가로로 배치할 때는 간격을 4px로 설정합니다.">
          <div className="ds-dd-row">
            <span className="ds-dd-row__input">이름을 입력하세요.</span>
            <Box placeholder="소속을 선택해주세요." />
            <button type="button" className="ds-dd-row__btn">저장</button>
          </div>
        </Block>
      </Section>

      <Section title="Behaviors">
        <Block title="State" description="Dropdown은 Default, Focused, Opened, Completed, Disabled 상태를 가집니다.">
          <div className="ds-dd-states">
            {STATES.map(({ label, node }) => (
              <div key={label} className="ds-if-state">
                <span className="ds-if-state__label">{label}</span>
                {node}
              </div>
            ))}
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="Container의 높이는 Medium 32px, Small 28px입니다.">
          <div className="ds-dd-sizes">
            <Dim height={32}>
              <Guide>32</Guide>
              <i className="ds-if-bar" style={{ height: 32 }} />
            </Dim>
            <Box state="Completed" value="전체" size="Medium" />
            <Dim height={28}>
              <Guide>28</Guide>
              <i className="ds-if-bar" style={{ height: 28 }} />
            </Dim>
            <Box state="Completed" value="전체" size="Small" />
          </div>
        </Block>
      </Section>
    </div>
  )
}
