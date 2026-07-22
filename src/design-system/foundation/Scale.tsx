import { gapScale, paddingScale, radiusScale, shadowLevels, sizeScale, type ScaleItem } from '../tokens/scale'
import './Scale.css'

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Scale</h1>
      <p>Figma에서 추출한 radius/gap/padding/size 스케일입니다.</p>
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
    <div className="ds-scale-item ds-scale-item--radius">
      <div className="ds-scale-item__demo">
        <div className="ds-scale-radius-box" style={{ borderRadius: px }}>
          <div className="ds-scale-radius-dot" style={{ width: dotSize, height: dotSize }} />
        </div>
      </div>
      <span className="ds-scale-item__label">
        radius/{name}({px}px)
      </span>
    </div>
  )
}

function GapItem({ name, px }: ScaleItem) {
  return (
    <div className="ds-scale-item">
      <div className="ds-scale-item__demo">
        <div className="ds-scale-gap-wrap">
          <div className="ds-scale-gap-block" />
          <div className="ds-scale-gap-bar" style={{ width: px }} />
          <div className="ds-scale-gap-block" />
        </div>
      </div>
      <span className="ds-scale-item__label">
        gap/{name}({px}px)
      </span>
    </div>
  )
}

function PaddingItem({ name, px }: ScaleItem) {
  return (
    <div className="ds-scale-item">
      <div className="ds-scale-item__demo">
        <div className="ds-scale-padding-box">
          <div className="ds-scale-padding-ring" style={{ borderWidth: px }} />
        </div>
      </div>
      <span className="ds-scale-item__label">
        padding/{name}({px}px)
      </span>
    </div>
  )
}

function SizeItem({ name, px }: ScaleItem) {
  return (
    <div className="ds-scale-size-row">
      <div className="ds-scale-size-bar" style={{ height: px }} />
      <span className="ds-scale-item__label ds-scale-size-label">
        size/{name}({px}px)
      </span>
    </div>
  )
}

export default function ScalePage() {
  return (
    <div className="ds-typography-page ds-scale-page">
      <PageTitle />
      <section className="ds-section">
        <SectionHeading title="Radius" description="모서리 곡률 스케일입니다." />
        <div className="ds-panel ds-scale-grid">
          {radiusScale.map((item) => (
            <RadiusItem key={item.name} {...item} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading title="Gap" description="요소 사이 간격 스케일입니다." />
        <div
          className="ds-panel ds-scale-grid ds-scale-grid--row"
          style={{ gridTemplateColumns: `repeat(${gapScale.length}, minmax(0, 140px))` }}
        >
          {gapScale.map((item) => (
            <GapItem key={item.name} {...item} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading title="Padding" description="내부 여백 스케일입니다." />
        <div
          className="ds-panel ds-scale-grid ds-scale-grid--row"
          style={{ gridTemplateColumns: `repeat(${paddingScale.length}, minmax(0, 140px))` }}
        >
          {paddingScale.map((item) => (
            <PaddingItem key={item.name} {...item} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading title="Size" description="컴포넌트 높이/너비 스케일입니다." />
        <div className="ds-panel ds-scale-size-list">
          {sizeScale.map((item) => (
            <SizeItem key={item.name} {...item} />
          ))}
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading
          title="Shadow"
          description="Figma 플러그인이 effect(그림자) 값을 지원하지 않아 레벨 이름만 표시합니다. 실제 blur/offset/color 값은 Figma에서 직접 확인해주세요."
        />
        <div className="ds-panel">
          <ul className="ds-scale-shadow-list">
            {shadowLevels.map((level) => (
              <li key={level}>{level}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
