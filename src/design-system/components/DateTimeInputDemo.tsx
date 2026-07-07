import { DateInput, TimeInput } from '../../components/DateTimeInput/DateTimeInput'
import type { DateTimeInputSize, DateTimeInputState } from '../../components/DateTimeInput/DateTimeInput'
import '../foundation/Typography.css'
import './DateTimeInputDemo.css'

const SIZES: DateTimeInputSize[] = ['Medium', 'Small']
const STATES: DateTimeInputState[] = ['Default', 'Focused', 'Completed', 'Disabled']

const VALUES: Record<DateTimeInputState, { date: string; time: string }> = {
  Default: { date: '', time: '' },
  Focused: { date: '2025.05.15 (목)', time: '오전 10:09' },
  Completed: { date: '2025.05.15 (목)', time: '오전 10:09' },
  Disabled: { date: '2025.05.15 (목)', time: '오전 10:09' },
}

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>DateTimeInput</h1>
      <p>날짜/시간을 입력받는 컴포넌트입니다.</p>
    </div>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="ds-section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default function DateTimeInputDemo() {
  return (
    <div className="ds-typography-page">
      <PageTitle />
      <section className="ds-section">
        <SectionHeading title="DateInput" description="Size: Medium, Small / State: Default, Focused, Completed, Disabled" />
        <div className="ds-panel dt-demo-grid">
          {SIZES.map((size) => (
            <div key={size} className="dt-demo-col">
              <div className="dt-demo-col__label">{size}</div>
              {STATES.map((state) => (
                <div key={state} className="dt-demo-row">
                  <DateInput
                    size={size}
                    state={state}
                    disabled={state === 'Disabled'}
                    defaultValue={VALUES[state].date || undefined}
                  />
                  <span className="dt-demo-row__label">{state}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading title="TimeInput" description="Size: Medium, Small / State: Default, Focused, Completed, Disabled" />
        <div className="ds-panel dt-demo-grid">
          {SIZES.map((size) => (
            <div key={size} className="dt-demo-col">
              <div className="dt-demo-col__label">{size}</div>
              {STATES.map((state) => (
                <div key={state} className="dt-demo-row">
                  <TimeInput
                    size={size}
                    state={state}
                    disabled={state === 'Disabled'}
                    defaultValue={VALUES[state].time || undefined}
                  />
                  <span className="dt-demo-row__label">{state}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
