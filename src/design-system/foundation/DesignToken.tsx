import exampleImage from '../assets/token-example.png'
import structureImage from '../assets/token-structure.png'
import flowImage from '../assets/token-flow.png'
import componentImage from '../assets/token-component.png'
import './Typography.css'
import './DesignToken.css'

// Figma "Design Token" 프레임(node 21393:60697)의 구성을 따릅니다.
// 이미지는 2배 해상도로 내보냈으므로 Figma 원본 크기(width)로 표시합니다.

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Design Token</h1>
      <p>
        디자인 토큰(Design Tokens)은 디자인 시스템에서 반복적으로 사용되는 디자인 속성을 효율적으로 관리하기 위한 일종의 추상화된 값을 변수로 정의한 코드입니다.
      </p>
    </div>
  )
}

function Diagram({ src, alt, width }: { src: string; alt: string; width: number }) {
  return (
    <div className="ds-panel ds-token-panel">
      <img className="ds-token-diagram" src={src} alt={alt} style={{ width }} />
    </div>
  )
}

export default function DesignTokenPage() {
  return (
    <div className="ds-typography-page ds-typography-page--figma ds-token-page">
      <PageTitle />

      <section className="ds-section">
        <div className="ds-section-heading">
          <h2>토큰 적용 예시</h2>
          <p>하나의 컴포넌트는 색상·간격·반경 등 여러 토큰의 조합으로 정의됩니다.</p>
        </div>
        <Diagram
          src={exampleImage}
          width={308}
          alt="Button 하나에 color/button/primary-fill, padding/5, radius/xsmall, color/text/basic-inverse 토큰이 적용된 예"
        />
      </section>

      <section className="ds-section">
        <div className="ds-section-heading">
          <h2>디자인 토큰의 구성</h2>
        </div>
        <ul className="ds-token-list">
          <li>
            디자인 토큰은 세 가지 레벨로 구분되며 기본적인 스타일 속성을 정의하는 primitive token, 구체적인 의미를 부여한 semantic token, 그리고 특정 컴포넌트에 적용되는 component token으로 정의합니다.
          </li>
          <li>
            primitive 컬렉션에는 원시값 변수가 등록됩니다. UI 요소에 직접 적용하지 않고, 다른 컬렉션이 참조하는 기준 값으로만 사용합니다.
          </li>
        </ul>
        <Diagram
          src={structureImage}
          width={632}
          alt="primitive는 color, typo, number를, semantic은 color, gap, padding, size, radius, alpha를, component는 color 하위 9개 그룹을 가진 토큰 구성"
        />
        <Diagram
          src={flowImage}
          width={692}
          alt="raw data #105AFF가 primitive token color/blue/500, semantic token color/primary/500을 거쳐 component token color/button/primary-fill로 이어지는 흐름"
        />
        <Diagram
          src={componentImage}
          width={365}
          alt="component 토큰 color 하위 background, surface, button, action, text, icon, border, element, input의 의미 정의"
        />
      </section>
    </div>
  )
}
