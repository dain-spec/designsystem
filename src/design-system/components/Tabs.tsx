import '../foundation/Typography.css'
import { Guide, Section, Block, Dim } from './GuideParts'
import './InputField.css'
import './Tabs.css'

// Figma "Tabs_2.0" 프레임(node 21524:71863)의 구성을 따릅니다.
// 색상·글자 크기는 Figma 노드 값(#4a4a4a 선택, #777 비선택, #105aff 카운트 등)을 그대로 사용합니다.

type Size = 'md' | 'sm'

const ChatIcon = ({ s = 16 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} fill="none" aria-hidden="true">
    <path d="M8 2.5c3 0 5.5 2 5.5 4.5S11 11.5 8 11.5c-.6 0-1.2-.1-1.7-.3L3.5 13l.7-2.4C3.2 9.8 2.5 8.5 2.5 7 2.5 4.5 5 2.5 8 2.5z" stroke="currentColor" />
  </svg>
)
const GridIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    {[2, 9].map((x) => [2, 9].map((y) => <rect key={`${x}${y}`} x={x} y={y} width="5" height="5" rx="1.2" fill="currentColor" />))}
  </svg>
)
const ListIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M3 4.5H13M3 8H13M3 11.5H13" stroke="currentColor" strokeLinecap="round" />
  </svg>
)
const ArrowRight = () => (
  <svg viewBox="0 0 6 10" width="6" height="10" fill="none" aria-hidden="true" style={{ color: '#b4b4b4' }}>
    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type ItemProps = { on?: boolean; icon?: boolean; count?: string; label?: string; size?: Size; dot?: boolean }

function Count({ children }: { children: React.ReactNode }) {
  return <span className="ds-tb-count">{children}</span>
}

function BorderItem({ on, icon, count, label = 'Tab Item', size = 'md' }: ItemProps) {
  return (
    <span className={`ds-tb-border ds-tb-border--${size}${on ? ' is-on' : ''}`}>
      {icon && <ChatIcon />}
      {label}
      {count && <Count>{count}</Count>}
    </span>
  )
}

function ChipItem({ on, icon, count, label = 'Tab Item', size = 'md', dot, hovered }: ItemProps & { hovered?: boolean }) {
  return (
    <span className={`ds-tb-chip ds-tb-chip--${size}${on ? ' is-on' : ''}${hovered ? ' is-hover' : ''}`}>
      {icon && <ChatIcon s={14} />}
      {label}
      {count && <span>{count}</span>}
      {dot && <i className="ds-tb-dot" />}
    </span>
  )
}

function TextItem({ on, count }: { on?: boolean; count?: string }) {
  return (
    <span className={`ds-tb-text${on ? ' is-on' : ''}`}>
      Tab Item
      {count && <Count>{count}</Count>}
    </span>
  )
}

function IconItem({ kind, on }: { kind: 'grid' | 'list'; on?: boolean }) {
  return <span className={`ds-tb-icon${on ? ' is-on' : ''}`}>{kind === 'grid' ? <GridIcon /> : <ListIcon />}</span>
}

function SegItem({ on }: { on?: boolean }) {
  return <span className={`ds-tb-seg__item${on ? ' is-on' : ''}`}>Tab Item</span>
}

function Segment({ n = 3 }: { n?: number }) {
  return (
    <span className="ds-tb-seg">
      {Array.from({ length: n }, (_, i) => (
        <SegItem key={i} on={i === 0} />
      ))}
    </span>
  )
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ds-tb-card">
      <span className="ds-if-state__label">{label}</span>
      {children}
    </div>
  )
}

function Row({ gap = 20, children }: { gap?: number; children: React.ReactNode }) {
  return (
    <div className="ds-tb-row" style={{ gap }}>
      {children}
    </div>
  )
}

function Anno({ pins, children }: { pins: { text: string; left: string; top?: number; bottom?: number; dir: 'down' | 'up' | 'right' | 'left' }[]; children: React.ReactNode }) {
  // left: 가운데 기준 가로 오프셋. top/bottom: 위(down 방향 선) 또는 아래(up 방향 선) 라벨 위치.
  return (
    <div className="ds-tb-anno">
      {pins.map((p) => (
        <span
          key={p.text}
          className={`ds-tb-pin ds-tb-pin--${p.dir}`}
          style={{ left: `calc(50% + ${p.left})`, top: p.dir === 'up' ? undefined : p.dir === 'down' ? 6 : '50%', bottom: p.dir === 'up' ? 6 : undefined }}
        >
          {p.text}
        </span>
      ))}
      {children}
    </div>
  )
}

export default function TabsPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>Tabs</h1>
        <p>한 화면 내에서 콘텐츠를 탭 단위로 구분하여 전환할 때 사용하는 컴포넌트입니다.</p>
      </header>

      <Section title="Types">
        <div className="ds-panel ds-if-panel">
          <div className="ds-tb-types">
            <Card label="Tabs">
              <Row><BorderItem on /><BorderItem /><BorderItem /><BorderItem /></Row>
            </Card>
            <Card label="TabChips">
              <Row gap={8}><ChipItem on /><ChipItem /><ChipItem /></Row>
            </Card>
            <Card label="TabText">
              <Row gap={8}><TextItem on /><TextItem /></Row>
            </Card>
            <Card label="TabIcon">
              <span className="ds-tb-iconwrap"><IconItem kind="grid" on /><IconItem kind="list" /><IconItem kind="list" /></span>
            </Card>
            <Card label="TabSegment">
              <Segment />
            </Card>
          </div>
        </div>
      </Section>

      {/* ───────── Tabs ───────── */}
      <Section title="Tabs" description="화면의 최상위 탐색 단계에서 콘텐츠를 전환할 때 사용하는 기본 탭입니다.">
        <Block title="Anatomy" description="Tabs는 여러 Tab Item을 담는 Container로 구성되며, 각 Tab Item은 선택 여부에 따라 Selected와 Unselected로 표시되고 필요에 따라 Icon과 Count를 추가할 수 있습니다.">
          <Anno
            pins={[
              { text: 'Icon (Optional)', left: '-44px', top: -28, dir: 'down' },
              { text: 'Count (Optional)', left: '58px', top: -28, dir: 'down' },
              { text: 'Divider', left: '-150px', top: 10, dir: 'right' },
              { text: 'Container', left: '230px', top: 10, dir: 'left' },
              { text: 'Active Indicator', left: '-20px', top: 52, dir: 'up' },
              { text: 'Tab Item', left: '120px', top: 52, dir: 'up' },
            ]}
          >
            <Row><BorderItem on icon count="00" /><BorderItem icon count="00" /></Row>
          </Anno>
        </Block>
        <Block title="Scroll" description="탭이 많거나 라벨이 길어 한 줄에 다 들어가지 않으면 좌우로 스크롤하여 표시됩니다.">
          <div className="ds-tb-scroll">
            <Row><BorderItem on icon /><BorderItem icon /><BorderItem icon /><BorderItem icon /></Row>
            <ArrowRight />
          </div>
        </Block>
        <Block title="Size" description="Container의 높이는 Medium 32px, Small 24px이며, Tab Item의 너비는 라벨 길이에 따라 달라집니다.">
          <div className="ds-tb-size">
            <Dim height={32}><Guide>32</Guide><i className="ds-if-bar" style={{ height: 32 }} /></Dim>
            <BorderItem on icon />
            <BorderItem icon />
            <Dim height={24}><Guide>24</Guide><i className="ds-if-bar" style={{ height: 24 }} /></Dim>
            <BorderItem on icon size="sm" />
            <BorderItem icon size="sm" />
          </div>
        </Block>
        <Block title="Spacing" description="Tab Item 사이 간격은 20px입니다. Tab Item을 Fill로 배치할 때는 간격을 0px로 설정합니다.">
          <div className="ds-tb-size ds-tb-size--spaced">
            <BorderItem on icon />
            <Guide className="ds-tb-gap">20</Guide>
            <BorderItem icon />
            <span className="ds-tb-sep" />
            <BorderItem on icon />
            <Guide className="ds-tb-gap">0</Guide>
            <BorderItem icon />
          </div>
        </Block>
      </Section>

      {/* ───────── TabChips ───────── */}
      <Section title="TabChips" description="칩 형태의 탭으로, 하위 Depth나 좁은 영역에서 콘텐츠를 전환할 때 사용합니다.">
        <Block title="Anatomy" description="TabChips는 여러 Tab Item을 담는 Container로 구성되며, 각 Tab Item은 Selected와 Unselected로 표시되고 필요에 따라 Icon, Count, Badge Dot을 가질 수 있습니다.">
          <Anno
            pins={[
              { text: 'Icon (Optional)', left: '-150px', top: 6, dir: 'right' },
              { text: 'Count (Optional)', left: '-55px', top: -28, dir: 'down' },
              { text: 'Badge Dot (Optional)', left: '50px', top: -28, dir: 'down' },
              { text: 'Container', left: '170px', top: 6, dir: 'left' },
              { text: 'Selected Tab', left: '-55px', top: 52, dir: 'up' },
              { text: 'UnSelected Tab', left: '40px', top: 52, dir: 'up' },
            ]}
          >
            <Row gap={8}><ChipItem on icon count="99" dot /><ChipItem count="99" /></Row>
          </Anno>
        </Block>
        <Block title="State" description="TabChips는 다른 Tab 유형과 달리 Selected, Unselected와 함께 Hovered 상태를 추가로 가집니다.">
          <Row gap={28}>
            <Card label="Selected"><ChipItem on /></Card>
            <Card label="Unselected"><ChipItem /></Card>
            <Card label="Hovered"><ChipItem hovered /></Card>
          </Row>
        </Block>
        <Block title="Size" description="Container의 높이는 Medium 32px, Small 24px이며, Tab Item의 너비는 라벨 길이에 따라 달라집니다.">
          <div className="ds-tb-size">
            <Dim height={32}><Guide>32</Guide><i className="ds-if-bar" style={{ height: 32 }} /></Dim>
            <ChipItem on /><ChipItem />
            <Dim height={24}><Guide>24</Guide><i className="ds-if-bar" style={{ height: 24 }} /></Dim>
            <ChipItem on size="sm" /><ChipItem size="sm" />
          </div>
        </Block>
        <Block title="Spacing" description="Tab Item 사이 간격은 8px입니다.">
          <div className="ds-tb-size ds-tb-size--tight">
            <ChipItem on />
            <Guide className="ds-tb-gap ds-tb-gap--chip">8</Guide>
            <ChipItem />
          </div>
        </Block>
      </Section>

      {/* ───────── TabText ───────── */}
      <Section title="TabText" description="텍스트만으로 구성된 가벼운 탭으로, 하위 Depth의 보조 전환에 사용합니다.">
        <Block title="Anatomy" description="TabText는 여러 Tab Item을 담는 Container로 구성됩니다. 각 Tab Item은 Divider로 구분하며, Selected와 Unselected 상태로 표시합니다. 필요에 따라 Count를 추가할 수 있습니다.">
          <Anno
            pins={[
              { text: 'Divider', left: '70px', top: -28, dir: 'down' },
              { text: 'Count (Optional)', left: '10px', top: -28, dir: 'down' },
              { text: 'Container', left: '200px', top: 4, dir: 'left' },
              { text: 'Selected Tab', left: '-30px', top: 52, dir: 'up' },
              { text: 'UnSelected Tab', left: '90px', top: 52, dir: 'up' },
            ]}
          >
            <span className="ds-tb-textrow"><TextItem on count="00" /><i className="ds-tb-div" /><TextItem count="00" /></span>
          </Anno>
        </Block>
        <Block title="Spacing" description="Tab Item 사이 간격은 8px입니다.">
          <div className="ds-tb-size ds-tb-size--tight">
            <TextItem on count="00" />
            <Guide className="ds-tb-gap ds-tb-gap--chip">8</Guide>
            <TextItem count="00" />
          </div>
        </Block>
      </Section>

      {/* ───────── TabIcon ───────── */}
      <Section title="TabIcon" description="아이콘으로 보기 방식을 전환할 때 사용하는 탭으로, 그리드와 리스트처럼 표현 방식을 바꿀 때 활용합니다.">
        <Block title="Anatomy" description="TabIcon은 여러 아이콘 Tab Item을 담는 Container로 구성되며, 각 Tab Item은 Selected와 Unselected로 표시합니다.">
          <Anno
            pins={[
              { text: 'Selected Tab', left: '-60px', top: -28, dir: 'down' },
              { text: 'Container', left: '86px', top: 6, dir: 'left' },
              { text: 'UnSelected Tab', left: '-20px', top: 46, dir: 'up' },
            ]}
          >
            <span className="ds-tb-iconwrap"><IconItem kind="grid" on /><IconItem kind="list" /></span>
          </Anno>
        </Block>
        <Block title="Size" description="각 Tab Item의 크기는 32×32px로 고정됩니다.">
          <div className="ds-tb-size">
            <Guide>32</Guide>
            <Dim height={32}><i className="ds-if-bar" style={{ height: 32 }} /></Dim>
            <span className="ds-tb-iconwrap"><IconItem kind="grid" on /><IconItem kind="list" /></span>
          </div>
        </Block>
      </Section>

      {/* ───────── TabSegment ───────── */}
      <Section title="TabSegment" description="세그먼트 컨트롤 형태의 탭으로, 상호 배타적인 소수 옵션을 전환할 때 사용합니다.">
        <Block title="Anatomy" description="TabSegment는 여러 Segmented Control Item을 담는 Container로 구성되며, 각 Item은 Selected와 Unselected로 표시됩니다.">
          <Anno
            pins={[
              { text: 'Selected Tab', left: '-30px', top: -28, dir: 'down' },
              { text: 'Container', left: '160px', top: 6, dir: 'left' },
              { text: 'UnSelected Tab', left: '40px', top: 52, dir: 'up' },
            ]}
          >
            <Segment n={2} />
          </Anno>
        </Block>
        <Block title="Size" description="Container의 높이는 32px이며, 내부 Tab Item의 높이는 24px입니다.">
          <div className="ds-tb-size">
            <Dim height={24}><Guide>24</Guide><i className="ds-if-bar" style={{ height: 24 }} /></Dim>
            <Segment n={2} />
            <Dim height={32}><i className="ds-if-bar" style={{ height: 32 }} /><Guide>32</Guide></Dim>
          </div>
        </Block>
      </Section>
    </div>
  )
}
