import { useState } from 'react'
import { InputField } from '../../components/InputField/InputField'
import type { InputFieldSize, InputFieldState } from '../../components/InputField/InputField'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import { Button } from '../../components/Button/Button'
import { CodePanel } from './CodePanel'
import '../foundation/Typography.css'
import './InputFieldDemo.css'

const SIZES: InputFieldSize[] = ['Medium', 'Small']

const STATES: { state: InputFieldState; value: string; helper?: string }[] = [
  { state: 'Default', value: '' },
  { state: 'Focused', value: '' },
  { state: 'Typing', value: '내용 입력' },
  { state: 'Completed', value: '내용 입력완료' },
  { state: 'Disabled', value: '' },
  { state: 'ReadOnly', value: '내용 입력완료' },
  { state: 'Success', value: '내용 입력완료', helper: '사용 가능합니다.' },
  { state: 'Warning', value: '내용 입력완료', helper: '사용을 권장하지 않습니다.' },
  { state: 'Error', value: '내용 입력완료', helper: '필수입력 항목입니다.' },
]

const DROPDOWN_OPTIONS = [
  { value: '1', label: '소속 1' },
  { value: '2', label: '소속 2' },
  { value: '3', label: '소속 3' },
]

function generateCode(size: InputFieldSize, state: InputFieldState, value: string) {
  const props = [`size="${size}"`]
  if (state !== 'Default') props.push(`state="${state}"`)
  if (state === 'Disabled') props.push('disabled')
  if (state === 'ReadOnly') props.push('readOnly')
  props.push(value ? `defaultValue="${value}"` : 'placeholder="내용을 입력하세요."')
  return `import { InputField } from './components/InputField/InputField'\n\n<InputField ${props.join(' ')} />`
}

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>InputField</h1>
      <p>한 줄의 텍스트를 입력하거나 입력된 값을 확인할 때 사용하는 기본 폼 컴포넌트입니다.</p>
    </div>
  )
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="ds-section-heading">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function SubHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="if-demo-sub">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default function InputFieldDemo() {
  const [size, setSize] = useState<InputFieldSize>('Medium')
  const [state, setState] = useState<InputFieldState>('Default')
  const [dropdown, setDropdown] = useState('')
  const current = STATES.find((s) => s.state === state)!

  return (
    <div className="ds-typography-page">
      <PageTitle />

      <section className="ds-section">
        <SectionHeading
          title="Anatomy"
          description="InputField는 입력 영역인 Container로 구성되며, 필요에 따라 Label, Helper Text를 함께 표시할 수 있습니다."
        />
        <div className="ds-panel if-demo-center">
          <div className="if-demo-field">
            <label className="if-demo-label">
              이름<span className="if-demo-required">*</span>
            </label>
            <InputField state="Success" defaultValue="내용 입력완료" />
            <span className="if-demo-helper if-demo-helper--success">사용 가능합니다.</span>
          </div>
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="Variants" />
        <SubHeading title="Label" description="Label을 입력 영역 위에 배치할 때는 두 요소 사이에 6px의 간격을 둡니다." />
        <div className="ds-panel if-demo-center">
          <div className="if-demo-field">
            <label className="if-demo-label">
              이름<span className="if-demo-required">*</span>
            </label>
            <InputField placeholder="이름을 입력하세요." />
          </div>
        </div>

        <SubHeading
          title="Dropdown + Button"
          description="Dropdown이나 Button 등 다른 컴포넌트와 가로로 배치할 때는 간격을 4px로 둡니다."
        />
        <div className="ds-panel if-demo-center">
          <div className="if-demo-inline">
            <InputField placeholder="이름을 입력하세요." />
            <Dropdown
              placeholder="소속을 선택해주세요."
              options={DROPDOWN_OPTIONS}
              value={dropdown}
              onSelect={(o) => setDropdown(o.label)}
            />
            <Button type="Secondary" size="Medium">
              저장
            </Button>
          </div>
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="Behaviors" />
        <SubHeading
          title="State"
          description="InputField는 Default, Focused, Typing, Completed, Disabled, ReadOnly, Success, Warning, Error 상태를 가집니다."
        />
        <div className="ds-panel if-demo-states">
          {STATES.map(({ state: s, value, helper }) => (
            <button
              key={s}
              type="button"
              className={`if-demo-state${state === s ? ' if-demo-state--active' : ''}`}
              onClick={() => setState(s)}
            >
              <span className="if-demo-state__name">{s}</span>
              <InputField
                size={size}
                state={s}
                defaultValue={value}
                placeholder="내용을 입력하세요."
                disabled={s === 'Disabled'}
                readOnly={s === 'ReadOnly'}
                tabIndex={-1}
              />
              {helper && <span className={`if-demo-helper if-demo-helper--${s.toLowerCase()}`}>{helper}</span>}
            </button>
          ))}
        </div>
        <CodePanel code={generateCode(size, state, current.value)} />
      </section>

      <section className="ds-section">
        <SectionHeading title="Spec" />
        <SubHeading title="Size" description="Container의 높이는 Medium 32px, Small 28px입니다." />
        <div className="ds-panel if-demo-sizes">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={`if-demo-state${size === s ? ' if-demo-state--active' : ''}`}
              onClick={() => setSize(s)}
            >
              <span className="if-demo-state__name">
                {s} ({s === 'Medium' ? 32 : 28}px)
              </span>
              <InputField size={s} placeholder="내용을 입력하세요." tabIndex={-1} />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
