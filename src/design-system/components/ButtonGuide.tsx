import '../foundation/Typography.css'
import { Button } from '../../components/Button/Button'
import type { ButtonSize, ButtonType } from '../../components/Button/Button'
import { Guide, Section, Block, Dim } from './GuideParts'
import './InputField.css'
import './ButtonGuide.css'

// Figma "Button_2.0" 프레임(node 21481:64598)의 구성을 따릅니다.

const Plus = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
const Chevron = () => (
  <svg viewBox="0 0 6 10" width="6" height="10" fill="none" aria-hidden="true">
    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const PanelIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
    <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" />
    <path d="M6 3V13" stroke="currentColor" />
  </svg>
)

const noop = () => {}
type Visual = 'default' | 'hovered' | 'disabled'
const TYPES: ButtonType[] = ['Primary', 'Secondary', 'Tertiary']

function Cap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ds-bt-cap">
      <span className="ds-if-state__label">{label}</span>
      {children}
    </div>
  )
}

function Btn({ type, size = 'Medium', visual = 'default', icon = true, children = 'Button' }: { type: ButtonType; size?: ButtonSize; visual?: Visual; icon?: boolean; children?: React.ReactNode }) {
  return (
    <Button
      type={type}
      size={size}
      disabled={visual === 'disabled'}
      className={visual === 'hovered' ? 'ds-bt-hover' : undefined}
      leadingIcon={icon ? <Plus /> : undefined}
      trailingIcon={icon ? <Plus /> : undefined}
      onClick={noop}
    >
      {children}
    </Button>
  )
}

function Icon32({ visual = 'default' }: { visual?: Visual }) {
  return (
    <span className={`ds-bt-icon32 is-${visual}`}>
      <Plus />
    </span>
  )
}

function TextBtn({ visual = 'default' }: { visual?: Visual }) {
  return (
    <span className={`ds-bt-text is-${visual}`}>
      자세히보기 <Chevron />
    </span>
  )
}

function IconOnly({ state = 'default' }: { state?: 'default' | 'hovered' | 'on' | 'disabled' }) {
  return (
    <span className={`ds-bt-iconly is-${state}`}>
      <PanelIcon />
    </span>
  )
}

function Ghost({ visual = 'default' }: { visual?: Visual }) {
  return (
    <span className={`ds-bt-ghost is-${visual}`}>
      {visual !== 'disabled' && (
        <>
          <Plus /> Button <Plus />
        </>
      )}
    </span>
  )
}

const SIZES: ButtonSize[] = ['Large', 'Medium', 'Small', 'XSmall']

export default function ButtonGuidePage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>Button</h1>
        <p>사용자가 작업을 실행할 때 사용하는 기본 인터랙션 컴포넌트입니다.</p>
      </header>

      <Section title="Types">
        <div className="ds-panel ds-if-panel">
          <div className="ds-bt-types">
            <div className="ds-bt-type"><span className="ds-if-state__label">Button</span><Btn type="Primary" size="Medium" /></div>
            <div className="ds-bt-type"><span className="ds-if-state__label">ButtonIcon</span><Icon32 /></div>
            <div className="ds-bt-type"><span className="ds-if-state__label">TextButton</span><TextBtn /></div>
            <div className="ds-bt-type"><span className="ds-if-state__label">Icon</span><IconOnly /></div>
            <div className="ds-bt-type ds-bt-type--dark"><span className="ds-if-state__label">GhostButton</span><Ghost /></div>
          </div>
        </div>
      </Section>

      <Section title="Button" description="레이블을 중심으로 액션을 전달하는 기본 버튼입니다. 필요에 따라 아이콘을 함께 배치할 수 있습니다.">
        <Block title="Anatomy" description="Button은 Label을 감싸는 Container로 구성되며, 필요에 따라 의미를 보조하는 Icon을 함께 표시할 수 있습니다.">
          <div className="ds-bt-anatomy">
            <Guide className="ds-bt-a ds-bt-a--label ds-if-pin ds-if-pin--down">Label</Guide>
            <Guide className="ds-bt-a ds-bt-a--container">Container</Guide>
            <Guide className="ds-bt-a ds-bt-a--icon ds-if-pin ds-if-pin--up">Icon (Optional)</Guide>
            <Btn type="Primary" size="Large" />
          </div>
        </Block>
        <Block title="Type" description="강조 수준에 따라 Primary, Secondary, Tertiary 세 가지 타입으로 구성됩니다.">
          <div className="ds-bt-row">
            {TYPES.map((t) => <Btn key={t} type={t} size="Large" />)}
          </div>
        </Block>
        <Block title="State" description="Button은 Default, Hovered, Disabled 상태를 가집니다.">
          <div className="ds-bt-matrix">
            {(['default', 'hovered', 'disabled'] as Visual[]).map((v) => (
              <div key={v} className="ds-bt-matrix__row">
                <span className="ds-if-state__label">{v[0].toUpperCase() + v.slice(1)}</span>
                {TYPES.map((t) => <Btn key={t} type={t} size="Large" visual={v} />)}
              </div>
            ))}
          </div>
        </Block>
        <Block title="Size" description="Medium을 기본 사이즈로 제공하며 XLarge, Large, Medium, Small, XSmall의 총 5가지 사이즈로 구성됩니다.">
          <div className="ds-bt-matrix">
            {SIZES.map((s) => (
              <div key={s} className="ds-bt-matrix__row">
                <span className="ds-if-state__label">{s === 'Medium' ? '기본 사이즈 Medium(H:32px)' : s}</span>
                {TYPES.map((t) => <Btn key={t} type={t} size={s} icon={s !== 'XSmall'} />)}
              </div>
            ))}
          </div>
        </Block>
        <Block title="Gap" description="Icon과 Label 사이 간격은 Small·XSmall에서 2px, Medium·Large·XLarge에서 4px입니다.">
          <div className="ds-bt-gap">
            <span className="ds-bt-gap__pair"><Btn type="Tertiary" size="Small" icon={false}>취소</Btn><Btn type="Primary" size="Small" icon={false}>확인</Btn><Guide className="ds-bt-gap__n">2</Guide></span>
            <span className="ds-bt-gap__pair"><Btn type="Tertiary" size="Medium" icon={false}>취소</Btn><Btn type="Primary" size="Medium" icon={false}>확인</Btn><Guide className="ds-bt-gap__n">4</Guide></span>
          </div>
        </Block>
      </Section>

      <Section title="ButtonIcon" description="컨테이너(테두리·배경) 안에 아이콘만 담은 버튼입니다.">
        <Block title="State" description="ButtonIcon은 Default, Hovered, Disabled 상태를 가집니다.">
          <div className="ds-bt-row">
            <Cap label="Default"><Icon32 /></Cap>
            <Cap label="Hovered"><Icon32 visual="hovered" /></Cap>
            <Cap label="Disabled"><Icon32 visual="disabled" /></Cap>
          </div>
        </Block>
        <Block title="Size" description="ButtonIcon의 크기는 32×32px로 고정됩니다.">
          <div className="ds-bt-sizeguide">
            <Icon32 />
            <Dim height={32}><i className="ds-if-bar" style={{ height: 32 }} /><Guide>32</Guide></Dim>
          </div>
        </Block>
      </Section>

      <Section title="TextButton" description="컨테이너(테두리·배경) 없이 텍스트만으로 표현하는 버튼입니다.">
        <Block title="State" description="TextButton은 Default, Hovered, Disabled 상태를 가집니다.">
          <div className="ds-bt-row">
            <Cap label="Default"><TextBtn /></Cap>
            <Cap label="Hovered"><TextBtn visual="hovered" /></Cap>
            <Cap label="Disabled"><TextBtn visual="disabled" /></Cap>
          </div>
        </Block>
      </Section>

      <Section title="Icon" description="컨테이너 없이 아이콘 자체가 동작하는 버튼입니다.">
        <Block title="State" description="Icon은 Default, Hovered, On, Disabled 상태를 가집니다.">
          <div className="ds-bt-row">
            <Cap label="Default"><IconOnly /></Cap>
            <Cap label="Hovered"><IconOnly state="hovered" /></Cap>
            <Cap label="On"><IconOnly state="on" /></Cap>
            <Cap label="Disabled"><IconOnly state="disabled" /></Cap>
          </div>
        </Block>
        <Block title="Size" description="Icon의 크기는 24×24px로 고정됩니다.">
          <div className="ds-bt-sizeguide">
            <IconOnly />
            <Dim height={24}><i className="ds-if-bar" style={{ height: 24 }} /><Guide>24</Guide></Dim>
          </div>
        </Block>
        <Block title="Usage" description="여러 액션을 좁은 공간에 나란히 배치할 때 사용합니다.">
          <div className="ds-bt-usage">
            <span className="ds-bt-usage__name">김더존A 사원</span>
            <span className="ds-bt-usage__actions">
              <IconOnly />
              <IconOnly />
              <IconOnly />
            </span>
          </div>
        </Block>
      </Section>

      <Section title="GhostButton" description="어두운 배경 위에서 사용하는 버튼입니다.">
        <Block title="State" description="GhostButton은 Default, Hovered, Disabled 상태를 가집니다.">
          <div className="ds-bt-darkpanel">
            <Cap label="Default"><Ghost /></Cap>
            <Cap label="Hovered"><Ghost visual="hovered" /></Cap>
            <Cap label="Disabled"><Ghost visual="disabled" /></Cap>
          </div>
        </Block>
        <Block title="Usage" description="ActionBar나 FileUpload처럼 배경이 어두운 영역에서 사용됩니다.">
          <div className="ds-bt-usage-dark">
            <span>파일을 다운로드하고 있습니다.(1/5)</span>
            <Ghost />
          </div>
        </Block>
      </Section>
    </div>
  )
}
