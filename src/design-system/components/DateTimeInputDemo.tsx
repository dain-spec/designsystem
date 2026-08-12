import { useState } from 'react'
import { DateInput, TimeInput } from '../../components/DateTimeInput/DateTimeInput'
import type { DateTimeInputSize, DateTimeInputState } from '../../components/DateTimeInput/DateTimeInput'
import { CodePanel } from './CodePanel'
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

type Selection = { size: DateTimeInputSize; state: DateTimeInputState }

function generateCode(component: 'DateInput' | 'TimeInput', { size, state }: Selection, value: string) {
  const props = [`size="${size}"`]
  if (state !== 'Default') props.push(`state="${state}"`)
  if (state === 'Disabled') props.push('disabled')
  if (value) props.push(`defaultValue="${value}"`)
  return `import { ${component} } from './components/DateTimeInput/DateTimeInput'\n\n<${component} ${props.join(' ')} />`
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
  const [dateSelection, setDateSelection] = useState<Selection>({ size: 'Medium', state: 'Default' })
  const [timeSelection, setTimeSelection] = useState<Selection>({ size: 'Medium', state: 'Default' })

  const isSelected = (selection: Selection, size: DateTimeInputSize, state: DateTimeInputState) =>
    selection.size === size && selection.state === state

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
                <div
                  key={state}
                  role="button"
                  tabIndex={0}
                  className={`dt-demo-row${isSelected(dateSelection, size, state) ? ' dt-demo-row--active' : ''}`}
                  onClick={() => setDateSelection({ size, state })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setDateSelection({ size, state })
                  }}
                >
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
        <CodePanel code={generateCode('DateInput', dateSelection, VALUES[dateSelection.state].date)} />
      </section>
      <section className="ds-section">
        <SectionHeading title="TimeInput" description="Size: Medium, Small / State: Default, Focused, Completed, Disabled" />
        <div className="ds-panel dt-demo-grid">
          {SIZES.map((size) => (
            <div key={size} className="dt-demo-col">
              <div className="dt-demo-col__label">{size}</div>
              {STATES.map((state) => (
                <div
                  key={state}
                  role="button"
                  tabIndex={0}
                  className={`dt-demo-row${isSelected(timeSelection, size, state) ? ' dt-demo-row--active' : ''}`}
                  onClick={() => setTimeSelection({ size, state })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setTimeSelection({ size, state })
                  }}
                >
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
        <CodePanel code={generateCode('TimeInput', timeSelection, VALUES[timeSelection.state].time)} />
      </section>
    </div>
  )
}
