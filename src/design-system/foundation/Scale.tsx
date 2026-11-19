import {
  gapScale,
  paddingScale,
  radiusScale,
  shadowLevels,
  sizeScale,
  type ScaleItem,
  type ShadowLevel,
} from '../tokens/scale'
import './Typography.css'
import './Scale.css'

// Figma "Scale_2.0" 프레임(node 21428:66555)의 구성을 따릅니다.

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Scale</h1>
      <p>Scale은 요소의 둥글기, 간격, 크기, 깊이를 일관된 단계로 정의한 수치 체계입니다.</p>
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

const RADIUS_BOX_SIZE = 60

function RadiusItem({ name, px }: ScaleItem) {
  const dotSize = Math.min(px * 2, RADIUS_BOX_SIZE)
  return (
    <div className="ds-scale-radius">
      <div className="ds-scale-radius__box" style={{ borderRadius: px }}>
        <div className="ds-scale-radius__dot" style={{ width: dotSize, height: dotSize, borderRadius: px }} />
      </div>
      <span className="ds-scale-radius__label">
        radius/<wbr />
        {name}({px}px)
      </span>
    </div>
  )
}

function GapPaddingItem({ gap, padding }: { gap: ScaleItem; padding: ScaleItem }) {
  return (
    <div className="ds-scale-gap">
      <div className="ds-scale-gap__wrap">
        <div className="ds-scale-gap__block" />
        <div className="ds-scale-gap__bar" style={{ width: gap.px }} />
        <div className="ds-scale-gap__block" />
      </div>
      <span className="ds-scale-gap__label">
        gap/{gap.name}({gap.px}px)
        <br />
        padding/{padding.name}
      </span>
    </div>
  )
}

function SizeItem({ name, px }: ScaleItem) {
  return (
    <div className="ds-scale-size-row" style={{ minHeight: Math.max(px, 18) }}>
      <div className="ds-scale-size-bar" style={{ height: px }} />
      <span className="ds-scale-size-label">
        size/{name}({px}px)
      </span>
    </div>
  )
}

function ShadowItem({ name, x, y, blur, spread, color }: ShadowLevel) {
  return (
    <div className="ds-scale-shadow-item">
      <span className="ds-scale-shadow-label">{name}</span>
      <div className="ds-scale-shadow-box" style={{ boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}` }} />
    </div>
  )
}

export default function ScalePage() {
  return (
    <div className="ds-typography-page ds-typography-page--figma ds-scale-page">
      <PageTitle />
      <section className="ds-section">
        <SectionHeading
          title="Radius"
          description="Radius는 요소의 모서리 둥글기를 정의하며, 요소의 크기와 위계에 따라 단계를 선택합니다."
        />
        <div className="ds-panel ds-scale-panel ds-scale-panel--radius">
          {radiusScale.map((item) => (
            <RadiusItem key={item.name} {...item} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading
          title="Gap · Padding"
          description="Gap은 요소 사이의 간격을, Padding은 요소 내부의 여백을 정의하며 동일한 값을 공유합니다."
        />
        <div className="ds-panel ds-scale-panel ds-scale-panel--gap">
          {gapScale.map((gap, i) => (
            <GapPaddingItem key={gap.name} gap={gap} padding={paddingScale[i]} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading
          title="Size"
          description="Size는 컴포넌트의 고정 크기를 정의하며, 8px부터 88px까지 단계별로 제공합니다."
        />
        <div className="ds-panel ds-scale-panel ds-scale-panel--size">
          {sizeScale.map((item) => (
            <SizeItem key={item.name} {...item} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading
          title="Shadow"
          description="Shadow는 요소의 깊이를 표현하며, 화면 위로 떠오르는 정도에 따라 3단계로 구분합니다."
        />
        <div className="ds-panel ds-scale-panel ds-scale-panel--shadow">
          {shadowLevels.map((level) => (
            <ShadowItem key={level.name} {...level} />
          ))}
        </div>
      </section>
    </div>
  )
}
