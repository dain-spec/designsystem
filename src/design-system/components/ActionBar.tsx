import '../foundation/Typography.css'
import { Guide, Section, Block } from './GuideParts'
import './InputField.css'
import './ActionBar.css'

// Figma "ActionBar_2.0" 프레임(node 21516:61415)의 구성을 따릅니다.

const Plus = () => (
  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true">
    <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
const Warn = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M8 1.5L15 14H1z" fill="#f5a623" />
    <path d="M8 6v4M8 11.5v.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

function Bar({ mode = 'buttons', width, small }: { mode?: 'buttons' | 'text'; width?: number | string; small?: boolean }) {
  return (
    <div className={`ds-ab${small ? ' ds-ab--small' : ''}`} style={{ width }}>
      <span className="ds-ab__count"><em>1개</em> 선택됨</span>
      <span className="ds-ab__spacer" />
      {mode === 'text' ? (
        <>
          <span className="ds-ab__guide"><Warn />안내 문구를 입력해주세요.</span>
          <span className="ds-ab__btn ds-ab__btn--text">Button</span>
        </>
      ) : (
        <>
          <span className="ds-ab__btn ds-ab__btn--text">Button</span>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="ds-ab__btn">
              <Plus /> Button <Plus />
            </span>
          ))}
        </>
      )}
    </div>
  )
}

function Screen({ placement }: { placement: 'content' | 'full' | 'panel' }) {
  return (
    <div className="ds-ab-screen">
      <div className="ds-ab-screen__gnb" />
      <div className="ds-ab-screen__main">
        <div className="ds-ab-screen__top" />
        <div className="ds-ab-screen__body">
          <div className="ds-ab-screen__side" />
          <div className={`ds-ab-screen__area${placement === 'panel' ? ' is-split' : ''}`}>
            <div className="ds-ab-screen__bar">
              <Bar small />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActionBarPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>ActionBar</h1>
        <p>리스트나 테이블에서 항목을 선택하면 하단에 나타나며, 선택한 항목에 적용할 액션을 모아 제공합니다.</p>
      </header>

      <Section
        title="Anatomy"
        description="ActionBar는 선택 상태를 나타내는 Selection Count와 선택 항목에 적용할 Button으로 구성되며, 필요에 따라 안내 문구인 Guide Text를 표시할 수 있습니다."
      >
        <div className="ds-panel ds-if-panel">
          <div className="ds-ab-anatomy">
            <Guide className="ds-ab-a ds-ab-a--count ds-if-pin ds-if-pin--down">Selection Count</Guide>
            <Guide className="ds-ab-a ds-ab-a--guide ds-if-pin ds-if-pin--down">Guide Text (Optional)</Guide>
            <Guide className="ds-ab-a ds-ab-a--btn ds-if-pin ds-if-pin--down">Button</Guide>
            <Bar mode="text" width="100%" />
          </div>
        </div>
      </Section>

      <Section title="Variants">
        <Block title="Type" description="구성 방식에 따라 버튼형과 버튼·텍스트 혼합형으로 구분합니다.">
          <div className="ds-ab-stack">
            <Bar width="100%" />
            <Bar mode="text" width="100%" />
          </div>
        </Block>
      </Section>

      <Section title="Usage">
        <Block title="Layout" description="ActionBar는 콘텐츠 영역 하단에 고정되어 표시됩니다. 화면 전체 폭 또는 특정 패널·영역의 하단에 배치할 수 있습니다.">
          <div className="ds-ab-stack ds-ab-stack--screens">
            <Screen placement="content" />
            <Screen placement="full" />
            <Screen placement="panel" />
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="ActionBar의 높이는 48px이며, 너비는 배치되는 Container에 맞춰 달라집니다.">
          <div className="ds-ab-spec">
            <Guide className="ds-ab-spec__w">영역에 맞춰 가변</Guide>
            <Guide className="ds-ab-spec__h">48</Guide>
            <Bar width="100%" />
          </div>
        </Block>
      </Section>
    </div>
  )
}
