import '../foundation/Typography.css'
import './InputField.css'

// Figma "InputField_2.0" 프레임(node 21433:56602)의 구성을 따릅니다.

type FieldState = 'default' | 'focused' | 'typing' | 'completed' | 'disabled' | 'readonly' | 'success' | 'warning' | 'error'
type FieldSize = 'large' | 'medium' | 'small'

const STATUS_ICON: Partial<Record<FieldState, string>> = { success: '✓', warning: '!', error: '!' }

function Field({
  state = 'default',
  size = 'medium',
  value,
  placeholder = '내용을 입력하세요.',
  width,
}: {
  state?: FieldState
  size?: FieldSize
  value?: string
  placeholder?: string
  width?: number
}) {
  const clearable = state === 'focused' || state === 'typing'
  return (
    <div className={`ds-if ds-if--${state} ds-if--${size}`} style={width ? { width } : undefined}>
      <span className={value ? 'ds-if__value' : 'ds-if__placeholder'}>
        {state === 'focused' && <i className="ds-if__caret" />}
        {value ?? placeholder}
        {state === 'typing' && <i className="ds-if__caret" />}
      </span>
      {clearable && <span className="ds-if__clear">×</span>}
      {STATUS_ICON[state] && <span className={`ds-if__status ds-if__status--${state}`}>{STATUS_ICON[state]}</span>}
    </div>
  )
}

function Label({ text = '이름', children }: { text?: string; children?: React.ReactNode }) {
  return (
    <div className="ds-if-labeled">
      <span className="ds-if-label">
        {text}
        <em>*</em>
      </span>
      {children}
    </div>
  )
}

function Guide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`ds-if-guide ${className}`}>{children}</span>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <div className="ds-section-heading">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Block({ title, description, children }: { title?: string; description: string; children: React.ReactNode }) {
  return (
    <div className="ds-if-block">
      {title && <h3>{title}</h3>}
      <p>{description}</p>
      <div className="ds-panel ds-if-panel">{children}</div>
    </div>
  )
}

const STATES: { label: string; state: FieldState; value?: string; helper?: string }[] = [
  { label: 'Default', state: 'default' },
  { label: 'Focused', state: 'focused' },
  { label: 'Typing', state: 'typing', value: '내용 입력' },
  { label: 'Completed', state: 'completed', value: '내용 입력완료' },
  { label: 'Disabled', state: 'disabled' },
  { label: 'ReadOnly', state: 'readonly', value: '내용 입력완료' },
  { label: 'Success', state: 'success', value: '내용 입력완료', helper: '사용 가능합니다.' },
  { label: 'Warning', state: 'warning', value: '내용 입력완료', helper: '사용을 권고하지 않습니다.' },
  { label: 'Error', state: 'error', value: '내용 입력완료', helper: '필수입력 항목입니다.' },
]

export default function InputFieldPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <div className="ds-page-title">
        <h1>InputField</h1>
        <p>한 줄의 텍스트를 입력하거나 입력된 값을 확인할 때 사용하는 기본 폼 컴포넌트입니다.</p>
      </div>

      <Section title="Anatomy">
        <Block description="InputField는 입력 영역인 Container로 구성되며, 필요에 따라 Label, Trailing Icon, Helper Text를 함께 표시할 수 있습니다.">
          <div className="ds-if-anatomy">
            <Guide className="ds-if-anatomy__label ds-if-pin ds-if-pin--down">Label (Optional)</Guide>
            <Guide className="ds-if-anatomy__icon ds-if-pin ds-if-pin--down">Trailing Icon (Optional)</Guide>
            <span className="ds-if-dim ds-if-anatomy__container"><i className="ds-if-bar" style={{ height: 32 }} /><Guide>Container</Guide></span>
            <Guide className="ds-if-anatomy__helper ds-if-pin ds-if-pin--right">Helper text (Optional)</Guide>
            <Label>
              <Field state="success" value="내용 입력완료" width={190} />
              <span className="ds-if-helper ds-if-helper--success">사용 가능합니다.</span>
            </Label>
          </div>
        </Block>
      </Section>

      <Section title="Variants">
        <Block title="Label" description="Label을 입력 영역 위에 배치할 때는 두 요소 사이에 6px의 간격을 둡니다.">
          <div className="ds-if-row">
            <Label>
              <Field placeholder="이름을 입력하세요." width={190} />
              <Guide className="ds-if-gap6">6</Guide>
            </Label>
          </div>
        </Block>
        <Block title="Dropdown + Button" description="Dropdown이나 Button 등 다른 컴포넌트와 가로로 배치할 때는 간격을 4px로 둡니다.">
          <div className="ds-if-row ds-if-row--gap4">
            <Field placeholder="이름을 입력하세요." width={190} />
            <Guide className="ds-if-gap">4</Guide>
            <div className="ds-if ds-if--medium ds-if--default ds-if--select" style={{ width: 190 }}>
              <span className="ds-if__value">소속을 선택해주세요.</span>
              <span className="ds-if__chevron">⌄</span>
            </div>
            <Guide className="ds-if-gap">4</Guide>
            <button type="button" className="ds-if-button">저장</button>
          </div>
        </Block>
        <Block title="Typing" description="입력 중 하단에 자동완성 Dropdown이 나타날 경우, 세로 간격을 4px로 둡니다.">
          <div className="ds-if-typing">
            <Field state="typing" value="내용 입력" width={190} />
            <Guide className="ds-if-gap">4</Guide>
            <ul className="ds-if-dropdown">
              <li className="ds-if-dropdown__title">카테고리명 <b>99</b>건</li>
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i}>douzonekim</li>
              ))}
            </ul>
            <Guide className="ds-if-typing__note ds-if-pin ds-if-pin--left">
              상단 타이틀 있는 경우
              <br />
              타이틀 리스트 고정, border 추가
            </Guide>
          </div>
        </Block>
      </Section>

      <Section title="Behaviors">
        <Block title="State" description="InputField는 Default, Focused, Typing, Completed, Disabled, ReadOnly, Success, Warning, Error 상태를 가집니다.">
          <div className="ds-if-states">
            {STATES.map(({ label, state, value, helper }) => (
              <div key={label} className="ds-if-state">
                <span className="ds-if-state__label">{label}</span>
                <Field state={state} value={value} />
                {helper && <span className={`ds-if-helper ds-if-helper--${state}`}>{helper}</span>}
              </div>
            ))}
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="Container의 높이는 Large 44px, Medium 32px, Small 28px입니다.">
          <div className="ds-if-row ds-if-row--sizes">
            {([['large', 44], ['medium', 32], ['small', 28]] as const).map(([size, h]) => (
              <div key={size} className="ds-if-size">
                <span className="ds-if-dim"><Guide>{h}</Guide><i className="ds-if-bar" style={{ height: h }} /></span>
                <Field size={size} width={190} />
              </div>
            ))}
          </div>
        </Block>
      </Section>
    </div>
  )
}
