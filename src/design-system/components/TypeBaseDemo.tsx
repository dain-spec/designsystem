import { useState } from 'react'
import { InputField } from '../../components/InputField/InputField'
import type { InputFieldSize, InputFieldState } from '../../components/InputField/InputField'
import { TextArea } from '../../components/TextArea/TextArea'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import type { DropdownSize } from '../../components/Dropdown/Dropdown'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { CheckboxSingle } from '../../components/CheckboxSingle/CheckboxSingle'
import { Radio } from '../../components/Radio/Radio'
import { Button } from '../../components/Button/Button'
import type { ButtonSize, ButtonType } from '../../components/Button/Button'
import '../foundation/Typography.css'
import './TypeBaseDemo.css'

const FIELD_SIZES: InputFieldSize[] = ['Medium', 'Small']
const FIELD_STATES: InputFieldState[] = [
  'Default',
  'Focused',
  'Typing',
  'Completed',
  'Disabled',
  'ReadOnly',
  'Success',
  'Warning',
  'Error',
]
const DROPDOWN_SIZES: DropdownSize[] = ['Medium', 'Small']
const BUTTON_TYPES: ButtonType[] = ['Primary', 'Secondary', 'Tertiary']
const BUTTON_SIZES: ButtonSize[] = ['Large', 'Medium', 'Small', 'XSmall']

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>--Type-Base</h1>
      <p>다른 --Type-* 패턴이 조합해 쓰는 최소 단위 컴포넌트 모음입니다.</p>
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

export default function TypeBaseDemo() {
  const [toggleOn, setToggleOn] = useState(true)
  const [checked, setChecked] = useState(true)
  const [singleChecked, setSingleChecked] = useState(true)
  const [radioValue, setRadioValue] = useState('a')

  return (
    <div className="ds-typography-page">
      <PageTitle />

      <section className="ds-section">
        <SectionHeading title="Button" description="Type: Primary, Secondary, Tertiary / Size: Large, Medium, Small, XSmall" />
        <div className="ds-panel tb-demo-col">
          {BUTTON_TYPES.map((type) => (
            <div key={type} className="tb-demo-row">
              <div className="tb-demo-row__label">{type}</div>
              {BUTTON_SIZES.map((size) => (
                <Button key={size} type={type} size={size}>
                  Button
                </Button>
              ))}
              <Button type={type} size="Medium" disabled>
                Disabled
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="InputField" description="Size: Medium, Small / State 9종" />
        <div className="ds-panel tb-demo-grid">
          {FIELD_SIZES.map((size) => (
            <div key={size} className="tb-demo-fieldcol">
              <div className="tb-demo-col__label">{size}</div>
              {FIELD_STATES.map((state) => (
                <div key={state} className="tb-demo-row">
                  <InputField
                    size={size}
                    state={state}
                    disabled={state === 'Disabled'}
                    readOnly={state === 'ReadOnly'}
                    placeholder="내용을 입력하세요."
                    defaultValue={state === 'Completed' ? '입력된 값' : undefined}
                  />
                  <span className="tb-demo-row__label">{state}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="Dropdown" description="Size: Medium, Small / State: Default, Focused, Completed, Disabled" />
        <div className="ds-panel tb-demo-row">
          {DROPDOWN_SIZES.map((size) => (
            <Dropdown key={size} size={size} />
          ))}
          <Dropdown value="옵션 1" />
          <Dropdown disabled />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="TextArea" description="State: Default, Focused, Completed, Disabled" />
        <div className="ds-panel tb-demo-row">
          <TextArea placeholder="내용을 입력하세요." style={{ width: 280 }} />
          <TextArea defaultValue="입력된 값" style={{ width: 280 }} state="Completed" />
          <TextArea placeholder="비활성" style={{ width: 280 }} disabled />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="Search" description="Searchbar, SearchbarFilter" />
        <div className="ds-panel tb-demo-row">
          <SearchBar />
          <SearchBar withFilter />
          <SearchBar disabled />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="SelectControl" description="ToggleSwitch, CheckboxSingle, Checkbox, Radio" />
        <div className="ds-panel tb-demo-row">
          <ToggleSwitch size="Medium" checked={toggleOn} onChange={(e) => setToggleOn(e.target.checked)} />
          <ToggleSwitch size="Small" checked={!toggleOn} readOnly />
          <ToggleSwitch checked disabled />
          <CheckboxSingle checked={singleChecked} onChange={(e) => setSingleChecked(e.target.checked)} />
          <CheckboxSingle checked={false} readOnly />
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <Checkbox indeterminate readOnly />
          <Checkbox disabled />
          <Radio checked={radioValue === 'a'} onChange={() => setRadioValue('a')} name="tb-demo-radio" />
          <Radio checked={radioValue === 'b'} onChange={() => setRadioValue('b')} name="tb-demo-radio" />
          <Radio checked disabled />
        </div>
      </section>
    </div>
  )
}
