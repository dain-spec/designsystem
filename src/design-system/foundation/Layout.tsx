import anatomyImage from '../assets/layout-anatomy.png'
import pcImage1 from '../assets/layout-pc-1.png'
import pcImage2 from '../assets/layout-pc-2.png'
import pcImage3 from '../assets/layout-pc-3.png'
import tabletImage from '../assets/layout-tablet.png'
import phoneImage from '../assets/layout-phone.png'
import './Typography.css'
import './Layout.css'

// Figma "Layout_2.0" 프레임(node 21099:75994)의 구성을 따릅니다.

const breakpointRows = [
  ['Layout', 'Fixed', 'Fluid (max 960)', 'Fluid'],
  ['Viewport', '1440px +', '768~1439px', '360~767px'],
  ['Content Width', '960px', 'Viewport - Margin(96px)', 'Viewport - Margin(32px)'],
  ['Margin', 'Auto', '48px (min)', '16px'],
  ['Column', '12Columns', '8Columns', '4Columns'],
  ['Gutter', '16px', '16px', '16px'],
]

const typographyRows = [
  ['PC', '14px', 'Regular/Bold'],
  ['Tablet', '15px', 'Regular/Bold'],
  ['Phone', '15px', 'Regular/Bold'],
]

const uiBehaviorRows = [
  ['블록 Toolbar', 'Menu', 'Panel', 'Panel'],
  ['텍스트 Toolbar', 'Toolbar', 'Panel', 'Panel'],
  ['Option Menu', 'Toolbar', 'Bottom Sheet', 'Bottom Sheet'],
]

const contentBehaviorRows = [
  ['텍스트 · 제목 · 목록 · 인용', '영역 너비에 따라 줄바꿈'],
  ['표 · 수식 · 코드', '영역 초과 시 가로 스크롤'],
  ['이미지 · 비디오', 'Content 영역에 맞춰 비율 유지'],
  ['오디오', 'Content 영역에 맞춰 축소'],
  ['파일 · 링크 · 북마크', '영역 너비에 따라 말줄임'],
]

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Layout</h1>
      <p className="ds-multiline">
        {'레이아웃은 제품의 콘텐츠를 구조화하고 일관된 사용자 경험을 제공하기 위한 시각적 뼈대입니다.\n다양한 화면 밀도와 디바이스 환경에 대응할 수 있도록 유연한 그리드 시스템과 중단점(Breakpoint)을 제공합니다.'}
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
    <div className="ds-layout-sub">
      <h3>{title}</h3>
      <p className="ds-multiline">{description}</p>
    </div>
  )
}

// 이미지는 2배 해상도로 내보냈으므로 Figma 원본 크기(width)로 표시합니다.
function Diagram({ src, alt, width }: { src: string; alt: string; width: number }) {
  return (
    <div className="ds-panel ds-diagram-panel">
      <img className="ds-diagram" src={src} alt={alt} style={{ width }} />
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="ds-layout-table">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function LayoutPage() {
  return (
    <div className="ds-typography-page ds-typography-page--figma ds-layout-page">
      <PageTitle />

      <section className="ds-section">
        <SectionHeading title="Grid anatomy" description="그리드 시스템을 구성하는 핵심 요소입니다." />
        <ul className="ds-layout-list">
          <li>Column : 콘텐츠를 배치하는 영역</li>
          <li>Gutter : Column과 Column 사이의 간격</li>
          <li>Margin : Content Area와 화면 가장자리 사이의 간격</li>
          <li>Content Area : 콘텐츠가 배치되는 전체 영역으로 Column과 Gutter가 포함</li>
        </ul>
        <p className="ds-layout-note">
          ※ Content Area = (Column × N) + (Gutter × (N-1)) 이며, Margin은 포함되지 않습니다. Margin과 Gutter는 고정값, Column은 가변값입니다.
        </p>
        <Diagram src={anatomyImage} width={554} alt="Content Area 안에 Column, Gutter가 배치되고 양쪽에 Margin이 있는 그리드 구조" />
      </section>

      <section className="ds-section">
        <SectionHeading
          title="Breakpoint"
          description={
            'Breakpoint는 디바이스가 아닌 Viewport 너비를 기준으로 정의하며, 각 구간에 따라 Layout과 Grid 구조가 변경됩니다.\nContent Width는 Margin을 제외한 순수 콘텐츠 영역의 너비로, 최대 960px까지 확장되며 960px에 도달한 이후 남는 공간은 좌우 Margin에 균등 분배됩니다. SNB·사이드패널 등으로 Content 영역이 분할된 경우에는 Viewport와 관계없이 Content 영역에 4 Column Grid를 적용합니다.'
          }
        />
        <Table head={['구분', 'PC', 'Tablet', 'Phone']} rows={breakpointRows} />
        <p className="ds-layout-note ds-layout-note--small">
          ※ SNB·사이드패널 노출로 Content 영역이 분할된 경우에는 Viewport와 관계없이 4 Column을 적용하며, 좌우 Margin 20px과 Gutter 16px을 사용합니다.
        </p>
      </section>

      <section className="ds-section">
        <SectionHeading
          title="Grid Layout"
          description="Breakpoint 구간별 Layout 기준에 따라 Column, Gutter, Margin을 적용하여 콘텐츠를 일관된 구조로 배치합니다."
        />

        <SubHeading
          title="1. PC Grid"
          description="PC는 960px 고정 Content Area를 기준으로 12 Columns와 16px Gutter를 사용합니다. Viewport가 1440px인 경우 Content Area 양쪽에 240px의 여백이 발생합니다. Column Width = (Content Width - Gutter × 11) ÷ 12 로, 960px 기준 65.33px의 소수점이 발생합니다."
        />
        <Diagram src={pcImage1} width={500} alt="PC 화면에서 좌우 여백은 가변이고 가운데 960px 고정 영역에 12 Column이 배치된 예" />
        <Diagram src={pcImage2} width={504} alt="SNB가 있는 PC 화면에서 960px 고정 영역에 12 Column이 배치된 예" />
        <Diagram src={pcImage3} width={500} alt="SNB와 사이드패널이 함께 노출되어 Content 영역에 4 Column이 배치된 예" />
        <p className="ds-layout-sub-note ds-multiline">
          {'SNB와 사이드패널 노출 시에는 Viewport가 아닌 Content 영역을 기준으로 Grid를 적용합니다.\nContent 영역 너비와 관계없이 4 Column을 사용하며, 좌우 Margin 20px과 Gutter 16px을 유지합니다.'}
        </p>

        <SubHeading
          title="2. Tablet Grid"
          description={
            'Tablet은 화면 너비에 따라 Content 영역이 유동적으로 변경됩니다. 좌우 48px Margin을 유지하며 8 Column Grid를 사용합니다.\nViewport 768px 기준 Content Area는 672px이며, Viewport 1056px에서 최대 960px에 도달한 후 남는 공간은 좌우 Margin에 균등 분배됩니다.'
          }
        />
        <Diagram src={tabletImage} width={505} alt="Tablet 화면에서 좌우 48px Margin을 두고 8 Column이 배치된 예" />

        <SubHeading
          title="3. Phone Grid"
          description={
            'Phone은 화면 너비에 따라 Content 영역이 유동적으로 변경됩니다. 좌우 16px Margin을 유지하며 4 Column Grid를 사용합니다.\n최소 지원 Viewport는 360px이며, 이때 Content Area는 328px입니다.'
          }
        />
        <Diagram src={phoneImage} width={371} alt="Phone 화면에서 좌우 16px Margin을 두고 4 Column이 배치된 예" />
      </section>

      <section className="ds-section">
        <SectionHeading
          title="Typography"
          description="PC는 14px, Tablet과 Phone은 15px을 기본 폰트 크기로 사용합니다. Font Weight는 Regular와 Bold 두 가지로 제한하여 일관된 타이포그래피 체계를 유지합니다. 표의 값은 본문(Body) 기준이며, 제목·캡션 등 나머지 스케일은 Typography 문서를 따릅니다."
        />
        <p className="ds-layout-note">※ Amaranth 10 에 사용된 사이즈를 고려한 폰트 크기입니다.</p>
        <Table head={['구분', 'Font Size', 'Font Weight']} rows={typographyRows} />
      </section>

      <section className="ds-section">
        <SectionHeading
          title="UI Behavior"
          description={
            '화면 크기에 따라 UI의 노출 방식과 인터랙션 패턴을 변경합니다.\n표의 값은 에디터를 기준으로 PC는 Menu를 기본으로 사용하며, Tablet과 Phone은 화면 크기와 사용 맥락에 따라 Panel, Bottom Sheet 등의 UI를 적용합니다. Tablet은 기본적으로 Phone UI를 따르되, 화면 크기와 사용 맥락에 따라 Tablet 전용 UI로 확장할 수 있습니다.'
          }
        />
        <Table head={['구분', 'PC', 'Tablet', 'Phone']} rows={uiBehaviorRows} />
      </section>

      <section className="ds-section">
        <SectionHeading
          title="Content Behavior"
          description={
            '콘텐츠 유형별로 Content 영역 너비 변화에 대응하는 방식을 정의합니다.\n모든 콘텐츠는 Content 영역을 벗어나지 않으며, 가로 스크롤은 블록 내부에서만 발생하고 Margin을 침범하지 않습니다.'
          }
        />
        <Table head={['구분', '반응방식']} rows={contentBehaviorRows} />
      </section>
    </div>
  )
}
