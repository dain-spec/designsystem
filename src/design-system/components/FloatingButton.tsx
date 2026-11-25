import '../foundation/Typography.css'
import { Guide, Section, Block, Dim } from './GuideParts'
import './InputField.css'
import './FloatingButton.css'

// Figma "FloatingButton_2.0" 프레임(node 21524:66011)의 구성을 따릅니다.

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M10 16V4M4.5 9.5L10 4L15.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Fab({ hovered }: { hovered?: boolean }) {
  return (
    <span className={`ds-fb${hovered ? ' is-hovered' : ''}`}>
      <Arrow />
    </span>
  )
}

export default function FloatingButtonPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>FloatingButton</h1>
        <p>화면 위에 떠 있으며 주요 액션을 실행하는 버튼입니다.</p>
      </header>

      <Section title="Anatomy" description="FloatingButton은 액션을 나타내는 Icon과 이를 감싸는 Container로 구성됩니다.">
        <div className="ds-panel ds-if-panel">
          <div className="ds-fb-anatomy">
            <Guide className="ds-fb-a ds-fb-a--icon ds-if-pin ds-if-pin--down">Icon</Guide>
            <Guide className="ds-fb-a ds-fb-a--container">Container</Guide>
            <i className="ds-if-bar ds-fb-a--bar" style={{ height: 48 }} />
            <Fab />
          </div>
        </div>
      </Section>

      <Section title="Behaviors">
        <Block title="State" description="FloatingButton은 Default, Hovered 상태를 가집니다.">
          <div className="ds-fb-states">
            <div className="ds-if-state"><span className="ds-if-state__label">Default</span><Fab /></div>
            <div className="ds-if-state"><span className="ds-if-state__label">Hovered</span><Fab hovered /></div>
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="Container의 크기는 48×48px로 고정됩니다.">
          <div className="ds-fb-spec">
            <Guide className="ds-fb-spec__w">48</Guide>
            <Dim height={48}>
              <Guide>48</Guide>
              <i className="ds-if-bar" style={{ height: 48 }} />
            </Dim>
            <Fab />
          </div>
        </Block>
      </Section>

      <Section title="Usage">
        <Block
          title="Position"
          description={
            <>
              화면의 주요 액션으로 한 화면에 하나만 배치합니다.
              <br />
              오른쪽 가장자리에서 20px, 아래쪽 가장자리에서 28px 떨어진 우측 하단에 고정합니다.
            </>
          }
        >
          <div className="ds-fb-screen">
            <div className="ds-fb-screen__gnb" />
            <div className="ds-fb-screen__body">
              <span className="ds-fb-screen__fab"><Fab /></span>
              <Guide className="ds-fb-screen__r">20</Guide>
              <Guide className="ds-fb-screen__b">28</Guide>
            </div>
          </div>
        </Block>
      </Section>
    </div>
  )
}
