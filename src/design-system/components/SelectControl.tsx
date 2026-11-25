import '../foundation/Typography.css'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { Radio } from '../../components/Radio/Radio'
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch'
import { Guide, Section, Block, Dim } from './GuideParts'
import './InputField.css'
import './SelectControl.css'

// Figma "SelectControl_2.0" 프레임(node 21470:56287)의 구성을 따릅니다.

const noop = () => {}

function Cap({ label, children, focused }: { label: string; children: React.ReactNode; focused?: boolean }) {
  return (
    <div className={`ds-if-state ds-sc-cap${focused ? ' ds-sc-focus' : ''}`}>
      <span className="ds-if-state__label">{label}</span>
      {children}
    </div>
  )
}

function Text({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return <span className={`ds-sc-text${disabled ? ' is-disabled' : ''}`}>{children}</span>
}

function CheckLabel({ checked, indeterminate, disabled, text = 'Control Label' }: { checked?: boolean; indeterminate?: boolean; disabled?: boolean; text?: React.ReactNode }) {
  return (
    <span className="ds-sc-item">
      <Checkbox checked={checked} indeterminate={indeterminate} disabled={disabled} onChange={noop} />
      <Text disabled={disabled}>{text}</Text>
    </span>
  )
}

function RadioLabel({ checked, disabled }: { checked?: boolean; disabled?: boolean }) {
  return (
    <span className="ds-sc-item">
      <Radio checked={checked} disabled={disabled} onChange={noop} />
      <Text disabled={disabled}>Control Label</Text>
    </span>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="ds-sc-row">{children}</div>
}

function SizeGuide({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-sc-size">
      <Dim height={14}>
        <Guide>14</Guide>
        <i className="ds-if-bar" style={{ height: 14 }} />
      </Dim>
      {children}
      <Guide className="ds-sc-size__w">14</Guide>
    </div>
  )
}

export default function SelectControlPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>SelectControl</h1>
        <p>옵션을 선택하거나 기능을 켜고 끌 때 사용하는 선택 컨트롤입니다.</p>
      </header>

      <Section title="Types">
        <div className="ds-panel ds-if-panel">
          <div className="ds-sc-types">
            <div className="ds-sc-type"><span className="ds-if-state__label">CheckboxLabel</span><CheckLabel checked /></div>
            <div className="ds-sc-type"><span className="ds-if-state__label">RadioLabel</span><RadioLabel checked /></div>
            <div className="ds-sc-type"><span className="ds-if-state__label">Toggle</span><ToggleSwitch checked onChange={noop} /></div>
          </div>
        </div>
      </Section>

      <Section title="Anatomy" description="SelectControl은 선택 상태를 나타내는 Control로 구성되며, 필요에 따라 항목을 설명하는 Label을 함께 표시할 수 있습니다.">
        <div className="ds-panel ds-if-panel">
          <div className="ds-sc-anatomy">
            <Guide className="ds-sc-a ds-sc-a--label ds-if-pin ds-if-pin--down">Label (Optional)</Guide>
            <Guide className="ds-sc-a ds-sc-a--control ds-if-pin ds-if-pin--right">Control</Guide>
            <CheckLabel checked />
          </div>
        </div>
      </Section>

      <Section title="CheckboxLabel" description="여러 항목 중 하나 이상을 선택할 때 사용하는 컨트롤입니다.">
        <h2 className="ds-sc-sub">Behaviors</h2>
        <Block title="State" description="CheckboxLabel은 Default, Focused, On, Indeterminate, Disabled, On·Disabled 상태를 가집니다.">
          <Row>
            <Cap label="Default"><CheckLabel /></Cap>
            <Cap label="Focused" focused><CheckLabel /></Cap>
            <Cap label="On"><CheckLabel checked /></Cap>
            <Cap label="Indeterminate"><CheckLabel indeterminate text={<><b className="ds-sc-em">2개</b> 선택/99개</>} /></Cap>
            <Cap label="Disabled"><CheckLabel disabled /></Cap>
            <Cap label="On·Disabled"><CheckLabel checked disabled /></Cap>
          </Row>
        </Block>
        <h2 className="ds-sc-sub">Spec</h2>
        <Block title="Size" description="Checkbox의 크기는 14×14px로 고정됩니다.">
          <SizeGuide><CheckLabel /></SizeGuide>
        </Block>
      </Section>

      <Section
        title="RadioLabel"
        description="상호 배타적인 옵션 중 하나를 선택할 때 사용합니다. 모든 Radio 그룹은 처음부터 항목 하나가 선택된 상태로 제공하며, 다른 항목을 선택하면 기존 선택이 해제됩니다."
      >
        <h2 className="ds-sc-sub">Behaviors</h2>
        <Block title="State" description="RadioLabel은 Default, Focused, On, Disabled, On·Disabled 상태를 가집니다.">
          <Row>
            <Cap label="Default"><RadioLabel /></Cap>
            <Cap label="Focused" focused><RadioLabel /></Cap>
            <Cap label="On"><RadioLabel checked /></Cap>
            <Cap label="Disabled"><RadioLabel disabled /></Cap>
            <Cap label="On·Disabled"><RadioLabel checked disabled /></Cap>
          </Row>
        </Block>
        <h2 className="ds-sc-sub">Spec</h2>
        <Block title="Size" description="Radio의 크기는 14×14px로 고정됩니다.">
          <SizeGuide><RadioLabel /></SizeGuide>
        </Block>
      </Section>

      <Section title="ToggleSwitch" description="특정 옵션을 켜고 끌 때 사용하는 컨트롤입니다.">
        <h2 className="ds-sc-sub">Behaviors</h2>
        <Block title="State" description="Toggle은 Default, On, Disabled, On·Disabled 상태를 가집니다.">
          <Row>
            <Cap label="Default"><ToggleSwitch onChange={noop} /></Cap>
            <Cap label="On"><ToggleSwitch checked onChange={noop} /></Cap>
            <Cap label="Disabled"><ToggleSwitch disabled onChange={noop} /></Cap>
            <Cap label="On·Disabled"><ToggleSwitch checked disabled onChange={noop} /></Cap>
          </Row>
        </Block>
        <h2 className="ds-sc-sub">Spec</h2>
        <Block title="Size" description="Toggle의 크기는 Medium 32×20px, Small 24×16px입니다.">
          <div className="ds-sc-toggles">
            <Dim height={20}>
              <Guide>20</Guide>
              <i className="ds-if-bar" style={{ height: 20 }} />
            </Dim>
            <ToggleSwitch checked onChange={noop} />
            <Dim height={16}>
              <Guide>16</Guide>
              <i className="ds-if-bar" style={{ height: 16 }} />
            </Dim>
            <ToggleSwitch size="Small" checked onChange={noop} />
          </div>
        </Block>
      </Section>
    </div>
  )
}
