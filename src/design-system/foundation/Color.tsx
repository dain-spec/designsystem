import type { CSSProperties } from 'react'
import { primitiveColors, primitiveOpacity, semanticColors, semanticAlpha, type ColorGroup } from '../tokens/color'
import './Color.css'

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Color</h1>
      <p>Figma Variables에서 추출한 primitive/semantic 색상 토큰입니다.</p>
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

function isLight(value: string) {
  let r = 255
  let g = 255
  let b = 255
  let a = 1
  const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbaMatch) {
    r = Number(rgbaMatch[1])
    g = Number(rgbaMatch[2])
    b = Number(rgbaMatch[3])
    a = rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1
    // 패널 배경(#fafafa) 위에 얹었을 때의 실제 밝기를 계산합니다.
    r = r * a + 250 * (1 - a)
    g = g * a + 250 * (1 - a)
    b = b * a + 250 * (1 - a)
  } else {
    const h = value.replace('#', '')
    r = parseInt(h.slice(0, 2), 16)
    g = parseInt(h.slice(2, 4), 16)
    b = parseInt(h.slice(4, 6), 16)
  }
  return (r * 299 + g * 587 + b * 114) / 1000 > 200
}

function contrastColor(value: string) {
  return isLight(value) ? '#000000' : '#ffffff'
}

// rgba(r, g, b, a) -> "#RRGGBB, N%", Figma의 오퍼시티 라벨 표기와 동일한 형식입니다.
function formatColorLabel(value: string) {
  const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!rgbaMatch) return value.toUpperCase()
  const [, r, g, b, a] = rgbaMatch
  const hex = [r, g, b]
    .map((c) => Number(c).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  const pct = Math.round(Number(a ?? 1) * 100)
  return `#${hex}, ${pct}%`
}

// Figma 원본처럼 카드 구분 없이 이어붙인 색상 띠로 렌더링합니다.
function PrimitiveStrip({ swatches, style }: { swatches: { name: string; value: string }[]; style?: CSSProperties }) {
  return (
    <div className="ds-prim-strip" style={style}>
      {swatches.map((s) => (
        <div key={s.name} className="ds-prim-cell" style={{ background: s.value, color: contrastColor(s.value) }}>
          <span className="ds-prim-cell__name">{s.name}</span>
          <span className="ds-prim-cell__hex">{formatColorLabel(s.value)}</span>
        </div>
      ))}
    </div>
  )
}

function PrimitiveHueGroup({ group }: { group: ColorGroup }) {
  return <PrimitiveStrip swatches={group.swatches} />
}

function PrimitiveOpacityGroup({ group }: { group: ColorGroup }) {
  const black = group.swatches.filter((s) => s.name.startsWith('black'))
  const white = group.swatches.filter((s) => s.name.startsWith('white'))
  const rest = group.swatches.filter((s) => !s.name.startsWith('black') && !s.name.startsWith('white'))
  return (
    <div className="ds-prim-opacity">
      <div className="ds-color-group__label">{group.name}</div>
      <div className="ds-prim-opacity-row">
        <PrimitiveStrip swatches={black} style={{ flexGrow: black.length }} />
        <PrimitiveStrip swatches={white} style={{ flexGrow: white.length }} />
        <PrimitiveStrip swatches={rest} style={{ flexGrow: rest.length }} />
      </div>
    </div>
  )
}

function Swatch({ name, value, ref }: { name: string; value: string; ref?: string }) {
  return (
    <div className="ds-swatch">
      <div
        className="ds-swatch__color"
        style={{ background: value, color: isLight(value) ? '#333333' : '#ffffff' }}
      >
        <span className="ds-swatch__name">{name}</span>
      </div>
      <div className="ds-swatch__meta">
        <span className="ds-swatch__value">{value}</span>
        {ref && <span className="ds-swatch__ref">{ref}</span>}
      </div>
    </div>
  )
}

function ColorGroupPanel({ group }: { group: ColorGroup }) {
  return (
    <div className="ds-color-group">
      <div className="ds-color-group__label">{group.name}</div>
      <div className="ds-swatch-grid">
        {group.swatches.map((s) => (
          <Swatch key={s.name} {...s} />
        ))}
      </div>
    </div>
  )
}

export default function ColorPage() {
  return (
    <div className="ds-typography-page ds-color-page">
      <PageTitle />
      <section className="ds-section">
        <SectionHeading title="Primitive" description="원시 색상 스케일입니다. 직접 사용하지 않고 semantic 토큰을 통해 참조합니다." />
        <div className="ds-panel ds-prim-panel">
          {primitiveColors.map((g) => (
            <PrimitiveHueGroup key={g.name} group={g} />
          ))}
          <PrimitiveOpacityGroup group={primitiveOpacity} />
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading title="Semantic" description="의미 단위로 매핑된 색상 토큰입니다. UI 구현 시 이 토큰을 사용합니다." />
        <div className="ds-panel">
          {semanticColors.map((g) => (
            <ColorGroupPanel key={g.name} group={g} />
          ))}
          <ColorGroupPanel group={semanticAlpha} />
        </div>
      </section>
    </div>
  )
}
