import '../foundation/Typography.css'
import { assetUrl } from '../icongraph/assetUrl'
import './InputField.css'
import './DateTimeInput.css'

// Figma "DateTimeInput_2.0" 프레임(node 21433:58630)의 구성을 따릅니다.

type FieldState = 'default' | 'focused' | 'completed' | 'disabled'
type FieldKind = 'date' | 'time'

function Icon({ kind }: { kind: FieldKind }) {
  return (
    <span className="ds-dt-icon">
      {kind === 'date' ? (
        <img src={assetUrl('/datetime/ic-calendar.png')} alt="" />
      ) : (
        <img className="ds-dt-icon__time" src={assetUrl('/datetime/ic-time.svg')} alt="" />
      )}
    </span>
  )
}

function Field({
  kind,
  state = 'default',
  value,
  size = 'medium',
  width = 190,
}: {
  kind: FieldKind
  state?: FieldState
  value?: string
  size?: 'medium' | 'small'
  width?: number
}) {
  const placeholder = kind === 'date' ? 'YYYY.MM.DD' : '오전 hh:mm'
  return (
    <div className={`ds-dt ds-dt--${state} ds-dt--${size}`} style={{ width }}>
      <span className={value ? 'ds-dt__value' : 'ds-dt__placeholder'}>{value ?? placeholder}</span>
      <Icon kind={kind} />
    </div>
  )
}

function Label({ text, children, width }: { text: string; children: React.ReactNode; width?: number }) {
  return (
    <div className="ds-if-labeled" style={{ width }}>
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

function Dim({ height, children, className = '' }: { height: number; children: React.ReactNode; className?: string }) {
  return (
    <span className={`ds-if-dim ${className}`} style={{ height }}>
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

function Block({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="ds-if-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      <div className="ds-panel ds-if-panel">{children}</div>
    </div>
  )
}

// ── Picker ─────────────────────────────────────────────────────────

type Cell = { d: number; tone?: 'sun' | 'out' | 'today'; selected?: boolean; hover?: boolean }

// Figma 달력 예시(2026년 1월)의 날짜 배치를 그대로 사용합니다.
const WEEKS: Cell[][] = [
  [{ d: 23, tone: 'sun' }, { d: 24, tone: 'out' }, { d: 25, tone: 'out' }, { d: 26, tone: 'out' }, { d: 27, tone: 'out' }, { d: 28, tone: 'out' }, { d: 1 }],
  [{ d: 2, tone: 'sun' }, { d: 3 }, { d: 4, tone: 'today' }, { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }],
  [{ d: 9, tone: 'sun' }, { d: 10 }, { d: 11 }, { d: 12, selected: true }, { d: 13 }, { d: 14 }, { d: 15 }],
  [{ d: 16, tone: 'sun' }, { d: 17 }, { d: 18 }, { d: 19 }, { d: 20 }, { d: 21 }, { d: 22 }],
  [{ d: 23, tone: 'sun' }, { d: 24 }, { d: 25 }, { d: 26 }, { d: 27, hover: true }, { d: 28 }, { d: 29 }],
  [{ d: 30, tone: 'sun' }, { d: 31 }, { d: 1, tone: 'out' }, { d: 2, tone: 'out' }, { d: 3, tone: 'out' }, { d: 4, tone: 'out' }, { d: 5, tone: 'out' }],
]
const DAYS = ['일', '월', '화', '수', '목', '금', '토']

const ARROWS = {
  dl: { file: 'arrow-double-left.svg', inset: '12.5% 20.99% 12.5% 16.92%' },
  l: { file: 'arrow-left.svg', inset: '12.5% 33.33% 12.5% 26.04%' },
  r: { file: 'arrow-right.svg', inset: '12.5% 26.04% 12.5% 33.33%' },
  dr: { file: 'arrow-double-right.svg', inset: '12.5% 16.9% 12.5% 21%' },
}

function Arrow({ k }: { k: keyof typeof ARROWS }) {
  const a = ARROWS[k]
  return (
    <span className="ds-dt-arrow">
      <img src={assetUrl(`/datetime/${a.file}`)} alt="" style={{ inset: a.inset }} />
    </span>
  )
}

function DatePicker() {
  return (
    <div className="ds-dt-picker ds-dt-cal">
      <div className="ds-dt-cal__title">
        <Arrow k="dl" />
        <Arrow k="l" />
        <span>2026년 1월</span>
        <Arrow k="r" />
        <Arrow k="dr" />
      </div>
      <div className="ds-dt-cal__days">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      {WEEKS.map((week, i) => (
        <div key={i} className="ds-dt-cal__row">
          {week.map((c, j) => (
            <span key={j} className="ds-dt-cal__cell">
              <span
                className={[
                  'ds-dt-cal__area',
                  c.tone ? `is-${c.tone}` : '',
                  c.selected ? 'is-selected' : '',
                  c.hover ? 'is-hover' : '',
                ].join(' ')}
              >
                {c.d}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

const HOURS = ['00', '01', '02', '03', '04', '05']
const MINUTES = ['17', '18', '19', '20', '21', '22']

function TimeList({ items, selected, hover }: { items: string[]; selected: string; hover?: string }) {
  return (
    <div className="ds-dt-time__list">
      {items.map((t) => (
        <span key={t} className={`ds-dt-time__item${t === selected ? ' is-selected' : ''}${t === hover ? ' is-hover' : ''}`}>
          {t}
        </span>
      ))}
      <i className="ds-dt-time__scroll" />
    </div>
  )
}

function TimePicker() {
  return (
    <div className="ds-dt-picker ds-dt-time">
      <div className="ds-dt-time__head">
        <span>시간</span>
        <span className="ds-dt-time__colon">:</span>
        <span>분</span>
      </div>
      <div className="ds-dt-time__body">
        <TimeList items={HOURS} selected="00" hover="02" />
        <TimeList items={MINUTES} selected="17" />
      </div>
      <div className="ds-dt-time__bottom">
        <span>3시간 15분소요</span>
        <span className="ds-dt-btns">
          <button type="button" className="ds-dt-btn">취소</button>
          <button type="button" className="ds-dt-btn ds-dt-btn--primary">확인</button>
        </span>
      </div>
    </div>
  )
}

const STATES: { label: string; state: FieldState; date?: string; time?: string }[] = [
  { label: 'Default', state: 'default' },
  { label: 'Focused', state: 'focused', date: '2025.05.15 (목)', time: '오전 10:09' },
  { label: 'Completed', state: 'completed', date: '2025.05.15 (목)', time: '오전 10:09' },
  { label: 'Disabled', state: 'disabled', date: '2025.05.15 (목)', time: '오전 10:09' },
]

export default function DateTimeInputPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>Date·Time Input</h1>
        <p>날짜 또는 시간을 입력하고 확인할 때 사용하는 폼 컴포넌트입니다. Picker는 팝오버로 표시됩니다.</p>
      </header>

      <Section
        title="Anatomy"
        description="Date·Time Input은 입력 영역인 Container, Picker, Picker를 여는 Trailing Icon으로 구성되며, 필요에 따라 Label을 함께 표시할 수 있습니다."
      >
        <Block>
          <div className="ds-dt-anatomy">
            <Guide className="ds-dt-anatomy__label ds-if-pin ds-if-pin--down">Label (Optional)</Guide>
            <Guide className="ds-dt-anatomy__icon ds-if-pin ds-if-pin--down">Trailing Icon</Guide>
            <Dim height={32} className="ds-dt-anatomy__container">
              <i className="ds-if-bar" style={{ height: 32 }} />
              <Guide>Container</Guide>
            </Dim>
            <Dim height={177} className="ds-dt-anatomy__picker">
              <i className="ds-if-bar" style={{ height: 177 }} />
              <Guide>Picker</Guide>
            </Dim>
            <div className="ds-dt-stack">
              <Label text="날짜" width={185}>
                <Field kind="date" state="completed" value="2025.05.15 (목)" width={185} />
              </Label>
              <DatePicker />
            </div>
          </div>
        </Block>
      </Section>

      <Section title="Variants">
        <Block title="Label" description="Label을 입력 영역 위에 배치할 때는 두 요소 사이에 6px의 간격을 둡니다.">
          <div className="ds-dt-row ds-dt-row--labels">
            <Label text="날짜" width={170}>
              <Field kind="date" width={170} />
              <Guide className="ds-if-gap6">6</Guide>
            </Label>
            <Label text="시간" width={170}>
              <Field kind="time" width={170} />
            </Label>
          </div>
        </Block>
        <Block title="Focused" description="입력 영역을 선택하면 Picker가 팝오버로 열립니다.">
          <div className="ds-dt-row ds-dt-row--pickers">
            <div className="ds-dt-stack ds-dt-stack--tight">
              <Field kind="date" state="focused" value="2025.05.15 (목)" width={185} />
              <DatePicker />
            </div>
            <div className="ds-dt-stack ds-dt-stack--tight">
              <Field kind="time" state="focused" value="오전 10:09" width={200} />
              <TimePicker />
            </div>
          </div>
        </Block>
      </Section>

      <Section title="Behaviors">
        <Block title="State" description="Date·Time Input은 Default, Focused, Completed, Disabled 상태를 가집니다.">
          <div className="ds-dt-states">
            {STATES.map(({ label, state, date, time }) => (
              <div key={label} className="ds-dt-state">
                <span className="ds-if-state__label ds-dt-state__label">{label}</span>
                <Field kind="date" state={state} value={date} />
                <Field kind="time" state={state} value={time} />
              </div>
            ))}
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="Container의 높이는 Medium 32px, Small 28px입니다.">
          <div className="ds-dt-sizes">
            {([['medium', 32], ['small', 28]] as const).map(([size, h]) => (
              <div key={size} className="ds-dt-size">
                <Dim height={h} className="ds-dt-size__dim">
                  <Guide>{h}</Guide>
                  <i className="ds-if-bar" style={{ height: h }} />
                </Dim>
                <Field kind="date" size={size} />
              </div>
            ))}
          </div>
        </Block>
      </Section>
    </div>
  )
}
