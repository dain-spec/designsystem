import colorUpdatesImage from '../assets/color-updates.png'
import colorThemeImage from '../assets/color-theme.png'
import './Typography.css'
import './Color.css'

// Figma "Color01_2.0" 프레임(node 21395:61784)에서 추출한 구성입니다.

const semanticRoles = [
  { name: 'primary', description: '주요 행동과 선택·활성 상태', color: '#105aff' },
  { name: 'success', description: '작업 완료와 성공 결과 전달', color: '#27c36f' },
  { name: 'warning', description: '주의 환기와 확인 필요 상태', color: '#ffa000' },
  { name: 'danger/point', description: '오류·위험 알림과 강조 표시', color: '#fa4553' },
]

const componentColors = [
  { token: 'background', description: 'Frame 전체, Snb, Dim 등 화면 단위 영역의 배경 색상' },
  { token: 'surface', description: 'Card, Dialog, Infobox 등 구성 요소의 배경 색상' },
  { token: 'button', description: 'Button에 사용되는 색상' },
  { token: 'action', description: 'Tab, Picker 등 상호작용 요소에 사용되는 색상' },
  { token: 'text', description: '텍스트에 사용되는 색상' },
  { token: 'icon', description: '아이콘에 사용되는 색상' },
  { token: 'border', description: 'Stroke 속성, divider 등에 사용되는 색상' },
  { token: 'element', description: 'Badge, Toggle, Checkbox 등에 사용되는 색상' },
  { token: 'input', description: 'Input, Dropdown, Search 등에 사용되는 색상' },
]

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Color</h1>
      <p className="ds-multiline">
        {'색상 시스템은 primitive, semantic, component 세 레벨로 구성됩니다.\n모두를 위한 글로벌 접근성을 목표로 설계되어, 충분한 명도 대비와 가시성을 확보합니다.'}
      </p>
    </div>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="ds-section-heading">
      <h2>{title}</h2>
      <p className="ds-multiline">{description}</p>
    </div>
  )
}

function SubHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="ds-color-sub">
      <h3>{title}</h3>
      <p className="ds-multiline">{description}</p>
    </div>
  )
}

export default function ColorOverviewPage() {
  return (
    <div className="ds-typography-page ds-typography-page--figma ds-color-page">
      <PageTitle />

      <section className="ds-section">
        <SectionHeading
          title="Color Role"
          description={
            '색상 역할은 시각적 요소와 기능의 관계를 명확히 하여 직관적이고 예측 가능한 UI를 제공합니다.\n임의의 색상값 대신, 각 색상은 인터페이스 내에서 특정한 목적과 의미를 가집니다.\nprimitive는 UI에 직접 쓰지 않고 semantic·component가 참조하는 기준 값입니다.'
          }
        />

        <SubHeading
          title="Semantic Color"
          description={
            'Semantic Color는 UI 요소의 기능이나 정보 유형에 따라 의미를 강조해 전달하는 컬러입니다.\n목적과 적용 상황에 따라 색상을 일관되게 사용하면 인지 부하를 낮추고 통합된 사용자 경험을 제공합니다.'
          }
        />
        <div className="ds-panel ds-role-panel">
          {semanticRoles.map((r) => (
            <div key={r.name} className="ds-role-chip" style={{ background: r.color }}>
              <strong>{r.name}</strong>
              <span>{r.description}</span>
            </div>
          ))}
        </div>

        <SubHeading
          title="Component Color"
          description={
            'Component Color는 버튼, 텍스트, 배경처럼 적용되는 UI 요소에 따라 구분한 컬러입니다.\n9개 그룹으로 나뉘며, 각 그룹의 토큰 목록은 Design Token 페이지를 참고하세요.'
          }
        />
        <table className="ds-color-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            {componentColors.map((c) => (
              <tr key={c.token}>
                <td>{c.token}</td>
                <td>{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="ds-section">
        <SectionHeading
          title="Color Updates"
          description={
            '색상은 값이 아닌 의미를 기준으로 업데이트하며, 같은 값이라도 의미가 다르면 따로 관리합니다.\n변경은 semantic·component 레벨에서 하며, primitive는 팔레트를 재정의할 때만 수정합니다.\n전체 시스템의 일관성을 보장하면서 지속적으로 UI 색상을 개선할 수 있는 기반을 제공합니다.'
          }
        />
        <div className="ds-panel ds-diagram-panel">
          <img
            className="ds-diagram"
            src={colorUpdatesImage}
            alt="Primary 색상 스케일 12단계와 이를 참조하는 surface, button, action 컴포넌트 색상 토큰의 관계"
          />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading
          title="Theme"
          description={
            '역할 기반 색상은 라이트 모드와 다크 모드를 포함한 여러 테마를 지원하는 기반을 제공합니다.\n특정 색상 대신 역할을 정의해, 적절한 대비와 시각적 계층을 유지하며 테마에 자동으로 적응합니다.\n테마에 따라 달라지는 것은 component 레벨이며, primitive와 semantic은 단일 값을 유지합니다.'
          }
        />
        <div className="ds-panel ds-diagram-panel">
          <img
            className="ds-diagram"
            src={colorThemeImage}
            alt="라이트와 다크 테마의 알림창에서 surface.basic, text.subtle, surface.subtler 토큰이 같은 역할로 적용되는 예"
          />
        </div>
      </section>
    </div>
  )
}
