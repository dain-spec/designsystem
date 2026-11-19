import type { CSSProperties, ReactNode } from 'react'
import { primitiveColors, primitiveOpacity, semanticColors, semanticAlpha, type ColorGroup } from '../tokens/color'
import './Color.css'

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Color</h1>
      <p>색상 시스템은 역할 기반 색상과 팔레트 색상으로 구성되어 있으며, 모두를 위한 글로벌 접근성 충족을 목표로 설계되었습니다. 이를 통해 인터페이스 내에서 충분한 명도 대비를 보장하고, 명확성과 가시성을 확보할 수 있습니다.</p>
    </div>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="ds-section-heading">
      <h2>{title}</h2>
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
function PrimitiveStrip({
  swatches,
  style,
  showValue = false,
  className = '',
}: {
  swatches: { name: string; value: string }[]
  style?: CSSProperties
  showValue?: boolean
  className?: string
}) {
  return (
    <div className={`ds-prim-strip ${className}`} style={style}>
      {swatches.map((s) => (
        <div key={s.name} className="ds-prim-cell" style={{ background: s.value, color: contrastColor(s.value) }}>
          <span className="ds-prim-cell__name">{s.name}</span>
          {showValue && <span className="ds-prim-cell__hex">{formatColorLabel(s.value)}</span>}
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
      <h3 className="ds-color-group__label">{group.name}</h3>
      <div className="ds-prim-opacity-row">
        <PrimitiveStrip swatches={black} showValue className="ds-prim-strip--opacity" />
        <PrimitiveStrip swatches={white} showValue className="ds-prim-strip--opacity" />
        <PrimitiveStrip swatches={rest} showValue className="ds-prim-strip--opacity" />
      </div>
    </div>
  )
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="ds-swatch" style={{ backgroundColor: value }}>
      <span className="ds-swatch__caption">{name}</span>
    </div>
  )
}

function ColorGroupPanel({ group }: { group: ColorGroup }) {
  return (
    <div className="ds-color-group">
      <h3 className="ds-color-group__label">{group.name}</h3>
      <div className="ds-swatch-grid">
        {group.swatches.map((s) => (
          <Swatch key={s.name} name={s.name} value={s.value} />
        ))}
      </div>
    </div>
  )
}

// Alpha는 Figma처럼 검정 기반, 흰색 기반(inverse), 기타 순서로 줄을 나눠 보여줍니다.
function AlphaGroupPanel({ group }: { group: ColorGroup }) {
  const inverse = group.swatches.filter((s) => s.name.endsWith('-inverse'))
  const rest = group.swatches.filter((s) => s.name.includes('primary'))
  const base = group.swatches.filter((s) => !inverse.includes(s) && !rest.includes(s))
  return (
    <div className="ds-color-group">
      <h3 className="ds-color-group__label">{group.name}</h3>
      {[base, inverse, rest].map((row, i) => (
        <div key={i} className="ds-swatch-grid ds-swatch-grid--alpha">
          {row.map((s) => (
            <Swatch key={s.name} name={s.name} value={s.value} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ColorPage({ afterTitle }: { afterTitle?: ReactNode }) {
  return (
    <div className="ds-typography-page ds-typography-page--figma ds-color-page">
      <PageTitle />
      {afterTitle}
      <section className="ds-section">
        <SectionHeading title="Primitive" />
        <div className="ds-prim-panel">
          <h3 className="ds-color-group__label">Color</h3>
          <div className="ds-prim-rows">
            {primitiveColors.map((g) => (
              <PrimitiveHueGroup key={g.name} group={g} />
            ))}
          </div>
          <PrimitiveOpacityGroup group={primitiveOpacity} />
        </div>
      </section>
      <section className="ds-section">
        <SectionHeading title="Semantic" />
        {semanticColors.map((g) => (
          <ColorGroupPanel key={g.name} group={g} />
        ))}
        <AlphaGroupPanel group={semanticAlpha} />
      </section>
    </div>
  )
}
