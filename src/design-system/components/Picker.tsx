import '../foundation/Typography.css'
import { assetUrl } from '../icongraph/assetUrl'
import { DatePicker } from '../../components/DatePicker/DatePicker'
import { DateRangePicker } from '../../components/DateRangePicker/DateRangePicker'
import './InputField.css'
import './Picker.css'

// Figma "Picker_2.0" 프레임(node 21470:44283)의 구성을 따릅니다.
// 페이지 공통 스타일(제목, 섹션, 패널, 가이드선)은 InputField.css를 함께 씁니다.

const D = (y: number, m: number, d: number) => new Date(y, m - 1, d)
const FOCUS_DAY = D(2026, 1, 12)
const RANGE = { start: D(2026, 1, 21), end: D(2026, 2, 21) }

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


function Field({ value, placeholder, icon = 'date', width = 150, disabled }: { value?: string; placeholder?: string; icon?: 'date' | 'time'; width?: number; disabled?: boolean }) {
  return (
    <span className={`ds-pk-field${disabled ? ' is-disabled' : ''}`} style={{ width }}>
      <span className={value ? 'ds-pk-field__v' : 'ds-pk-field__p'}>{value ?? placeholder}</span>
      <img src={assetUrl(icon === 'date' ? '/datetime/ic-calendar.png' : '/datetime/ic-time.svg')} alt="" width={16} height={16} />
    </span>
  )
}

function Pair({ children }: { children: React.ReactNode }) {
  return <div className="ds-pk-pair">{children}</div>
}

const HOURS = ['00', '01', '02', '03', '04', '05']
const MINUTES = ['17', '18', '19', '20', '21', '22']

function TimeColumns({ label = true }: { label?: boolean }) {
  return (
    <div className="ds-pk-time">
      {label && (
        <div className="ds-pk-time__head">
          <span>시간</span>
          <span>:</span>
          <span>분</span>
        </div>
      )}
      <div className="ds-pk-time__cols">
        <ul className="ds-pk-col" data-col="hour">
          {HOURS.map((h, i) => (
            <li key={h} className={i === 0 ? 'is-selected' : i === 2 ? 'is-hover' : ''}>
              {h}
            </li>
          ))}
        </ul>
        <ul className="ds-pk-col" data-col="minute">
          {MINUTES.map((m, i) => (
            <li key={m} className={i === 0 ? 'is-selected' : ''}>
              {m}
            </li>
          ))}
        </ul>
        <i className="ds-pk-time__scroll" />
      </div>
    </div>
  )
}

function Footer({ text, children }: { text?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="ds-pk-footer">
      <span className="ds-pk-footer__text">{text}</span>
      <span className="ds-pk-btn">취소</span>
      <span className="ds-pk-btn ds-pk-btn--primary">확인</span>
      {children}
    </div>
  )
}

function CalendarWithTime({ footerText }: { footerText?: React.ReactNode }) {
  return (
    <div className="ds-pk-card">
      <div className="ds-pk-card__row">
        <DatePicker value={FOCUS_DAY} defaultMonth={FOCUS_DAY} className="ds-pk-bare" />
        <TimeColumns />
      </div>
      <Footer text={footerText} />
    </div>
  )
}

function Presets() {
  const row1 = ['올해', '오늘까지', '오늘', '내일', '주간', '다음주', '당월', '다음달']
  const row2 = ['전년도', '전전년도', '1분기', '2분기', '3분기', '4분기', '상반기', '하반기']
  const row3 = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  return (
    <div className="ds-pk-presets">
      {[row1, row2, row3].map((row, i) => (
        <div key={i} className="ds-pk-presets__row">
          {row.map((t) => (
            <span key={t} className={`ds-pk-chip${t === '오늘' && i === 0 ? ' is-active' : ''}`}>
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function RangeCard({ presets }: { presets?: boolean }) {
  return (
    <div className="ds-pk-rangewrap">
      {presets && <Presets />}
      <DateRangePicker value={RANGE} defaultMonth={D(2026, 1, 1)} className="ds-pk-bare" />
    </div>
  )
}

export default function PickerPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>Picker</h1>
        <p>날짜, 시간 또는 기간을 선택할 때 사용하는 컴포넌트입니다. 팝오버 형태로 표시됩니다.</p>
      </header>

      <Section
        title="Anatomy"
        description="Picker는 날짜를 선택하는 Calendar, 시·분을 선택하는 Time, 선택을 확정하는 Footer로 구성됩니다. 유형에 따라 Calendar와 Time은 각각 또는 함께 표시됩니다."
      >
        <Block>
          <div className="ds-pk-anatomy">
            <Guide className="ds-pk-a ds-pk-a--header ds-if-pin ds-if-pin--down">Header</Guide>
            <Guide className="ds-pk-a ds-pk-a--hour ds-if-pin ds-if-pin--down">Hour<br />Column</Guide>
            <Guide className="ds-pk-a ds-pk-a--min ds-if-pin ds-if-pin--down">Minute<br />Column</Guide>
            <Guide className="ds-pk-a ds-pk-a--weekday ds-if-pin ds-if-pin--right">Weekday Row</Guide>
            <Guide className="ds-pk-a ds-pk-a--grid ds-if-pin ds-if-pin--right">Date Grid</Guide>
            <Guide className="ds-pk-a ds-pk-a--footer ds-if-pin ds-if-pin--right">Footer</Guide>
            <CalendarWithTime footerText="음력 2025.12.13" />
          </div>
        </Block>
      </Section>

      <Section title="Variants">
        <Block title="DatePicker" description="날짜를 선택하면 값이 입력창에 즉시 반영되고 Picker가 닫힙니다.">
          <div className="ds-pk-grid">
            <div className="ds-pk-stack">
              <Field value="2025.05.15 (목)" width={170} />
              <DatePicker value={FOCUS_DAY} defaultMonth={FOCUS_DAY} />
            </div>
            <div className="ds-pk-stack">
              <Field value="2025.05.15 (목)" width={170} />
              <div className="ds-pk-card ds-pk-card--preset">
                <div className="ds-pk-quick">
                  <span>날짜선택</span>
                  <span className="ds-pk-quick__reset">↻ 초기화</span>
                </div>
                <div className="ds-pk-quick__chips">
                  <span className="ds-pk-chip is-active">오늘</span>
                  <span className="ds-pk-chip">지난 7일</span>
                  <span className="ds-pk-chip">지난 30일</span>
                </div>
                <DatePicker value={FOCUS_DAY} defaultMonth={FOCUS_DAY} className="ds-pk-bare" />
              </div>
            </div>
          </div>
        </Block>

        <Block title="DateRangePicker" description="시작일과 종료일을 선택한 뒤 확인 버튼을 누르면 값이 입력창에 반영됩니다. 확인하지 않고 닫으면 이전 값이 유지됩니다.">
          <div className="ds-pk-col-stack">
            <div className="ds-pk-stack">
              <Pair>
                <Field value="2026.01.21 (수)" width={150} />
                <span className="ds-pk-tilde">~</span>
                <Field placeholder="2026.02.21 (수)" width={150} disabled />
              </Pair>
              <RangeCard />
            </div>
            <div className="ds-pk-stack">
              <Pair>
                <Field value="2026.01.21 (수)" width={150} />
                <span className="ds-pk-tilde">~</span>
                <Field placeholder="2026.02.21 (수)" width={150} disabled />
              </Pair>
              <RangeCard presets />
            </div>
          </div>
        </Block>

        <Block title="TimePicker" description="시간을 선택한 뒤 확인 버튼을 누르면 값이 입력창에 반영됩니다. 확인하지 않고 닫으면 이전 값이 유지됩니다.">
          <div className="ds-pk-stack">
            <Field value="1시간 30분 소요" icon="time" width={190} />
            <div className="ds-pk-card ds-pk-card--time">
              <TimeColumns />
              <Footer text="13시간 15분소요" />
            </div>
          </div>
        </Block>

        <Block title="DateTimePicker" description="날짜와 시간을 선택한 뒤 확인 버튼을 누르면 값이 입력창에 반영됩니다. 확인하지 않고 닫으면 이전 값이 유지됩니다.">
          <div className="ds-pk-stack">
            <Field value="2026.01.21 (수) 03:20" width={190} />
            <CalendarWithTime footerText="음력 2025.12.13" />
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="1개월 Calendar의 크기는 186×180px로 고정됩니다. Footer의 높이는 44px, 프리셋 영역의 높이는 100px입니다.">
          <div className="ds-pk-spec">
            <div className="ds-pk-spec__item">
              <Guide className="ds-pk-spec__w">186</Guide>
              <DatePicker value={FOCUS_DAY} defaultMonth={D(2025, 1, 1)} />
            </div>
            <div className="ds-pk-spec__item">
              <Guide className="ds-pk-spec__w">186 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 186</Guide>
              <RangeCard />
              <Guide className="ds-pk-spec__h">44 (Footer)</Guide>
            </div>
            <div className="ds-pk-spec__item">
              <Guide className="ds-pk-spec__w">414</Guide>
              <RangeCard presets />
              <Guide className="ds-pk-spec__h">100 (Preset)</Guide>
            </div>
          </div>
        </Block>
      </Section>
    </div>
  )
}
