import '../foundation/Typography.css'
import './InputField.css'
import './TextArea.css'

// Figma "TextArea_2.0" 프레임(node 21433:57638)의 구성을 따릅니다.
// 페이지 공통 스타일(제목, 섹션, 패널, 가이드선)은 InputField.css를 함께 씁니다.

type TextAreaState = 'default' | 'focused' | 'typing' | 'completed' | 'disabled' | 'readonly'

const LONG =
  '사용자가 입력할 내용의 길이는 상황에 따라 달라질 수 있습니다. 예상되는 분량과 주변 컨테이너의 크기를 고려해 TextArea 높이를 설정합니다. 내용이 설정된 높이를 초과하면 입력 영역 안에서 스크롤합니다.'
const LONGER =
  LONG + ' 스크롤하는 동안에도 입력 영역의 높이는 유지됩니다. 사용자는 작성한 내용을 위아래로 이동하며 확인하고 편집할 수 있습니다.'

function TextAreaBox({
  state = 'default',
  value,
  placeholder = '내용을 입력하세요.',
  height = 114,
  scroll,
}: {
  state?: TextAreaState
  value?: string
  placeholder?: string
  height?: number
  scroll?: boolean
}) {
  return (
    <div className={`ds-ta ds-ta--${state}`} style={{ height }}>
      <span className={value ? 'ds-ta__value' : 'ds-ta__placeholder'}>
        {state === 'focused' && <i className="ds-ta__caret" />}
        {value ?? placeholder}
        {state === 'typing' && <i className="ds-ta__caret" />}
      </span>
      {scroll && <span className="ds-ta__scroll" />}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-if-labeled ds-ta-labeled">
      <span className="ds-if-label">
        내용
        <em>*</em>
      </span>
      {children}
    </div>
  )
}

function Guide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`ds-if-guide ${className}`}>{children}</span>
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

function Block({ title, description, children }: { title?: string; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ds-if-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      <div className="ds-panel ds-if-panel">{children}</div>
    </div>
  )
}

function Dim({ height, children, className = '' }: { height: number; children: React.ReactNode; className?: string }) {
  return (
    <span className={`ds-if-dim ${className}`} style={{ height }}>
      {children}
    </span>
  )
}

const STATES: { label: string; state: TextAreaState; value?: string; scroll?: boolean }[] = [
  { label: 'Default', state: 'default' },
  { label: 'Focused', state: 'focused' },
  { label: 'Typing', state: 'typing', value: '내용 입력중' },
  { label: 'Completed', state: 'completed', value: LONG, scroll: true },
  { label: 'Disabled', state: 'disabled' },
  { label: 'ReadOnly', state: 'readonly' },
]

export default function TextAreaPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>TextArea</h1>
        <p>여러 줄의 텍스트를 입력하거나 입력된 값을 확인할 때 사용하는 폼 컴포넌트입니다.</p>
      </header>

      <Section
        title="Anatomy"
        description="TextArea는 여러 줄 입력 영역인 Container로 구성되며, 필요에 따라 Label을 함께 표시할 수 있습니다."
      >
        <Block>
          <div className="ds-ta-anatomy">
            <Guide className="ds-ta-anatomy__label ds-if-pin ds-if-pin--down">Label (Optional)</Guide>
            <Guide className="ds-ta-anatomy__scroll ds-if-pin ds-if-pin--down">Scroll</Guide>
            <Dim height={114} className="ds-ta-anatomy__container">
              <i className="ds-if-bar" style={{ height: 114 }} />
              <Guide>Container</Guide>
            </Dim>
            <Label>
              <TextAreaBox state="completed" value={LONG} scroll />
            </Label>
          </div>
        </Block>
      </Section>

      <Section title="Variants">
        <Block title="Label" description="Label을 입력 영역 위에 배치할 때는 두 요소 사이에 6px의 간격을 둡니다.">
          <Label>
            <TextAreaBox />
            <Guide className="ds-if-gap6">6</Guide>
          </Label>
        </Block>
      </Section>

      <Section title="Behaviors">
        <Block title="State" description="TextArea는 Default, Focused, Typing, Completed, Disabled, ReadOnly 상태를 가집니다.">
          <div className="ds-ta-states">
            {STATES.map(({ label, state, value, scroll }) => (
              <div key={label} className="ds-if-state">
                <span className="ds-if-state__label">{label}</span>
                <TextAreaBox state={state} value={value} scroll={scroll} />
              </div>
            ))}
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block
          title="Size"
          description={
            <>
              TextArea의 기본 높이는 114px입니다. 사용처에 따라 컨테이너 높이에 맞춰 높이를 조절할 수 있습니다.
              <br />
              입력 내용이 설정된 높이를 초과하면 TextArea 내부에서 세로로 스크롤합니다.
            </>
          }
        >
          <div className="ds-ta-sizes">
            <div className="ds-ta-size">
              <Dim height={114} className="ds-ta-size__before">
                <Guide>114</Guide>
                <i className="ds-if-bar" style={{ height: 114 }} />
              </Dim>
              <TextAreaBox />
            </div>
            <div className="ds-ta-size">
              <TextAreaBox value={LONGER} height={171} scroll />
              <Dim height={171} className="ds-ta-size__after">
                <i className="ds-if-bar" style={{ height: 171 }} />
                <Guide>가변</Guide>
              </Dim>
            </div>
          </div>
        </Block>
      </Section>
    </div>
  )
}
