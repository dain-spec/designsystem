import { bodyStyles, fontFamily, headingStyles, sampleText, typeface } from '../tokens/typography'
import './Typography.css'

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Typography</h1>
      <p>사용자가 UI 상 텍스트 입력 및 확인 시 활용되는 컴포넌트입니다.</p>
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

function TypefaceSection() {
  return (
    <section className="ds-section">
      <SectionHeading
        title="Typeface"
        description="기본 글꼴로 국문과 영문, 숫자 모두 Noto Sans CJK KR 폰트를 사용합니다."
      />
      <div className="ds-panel ds-typeface-panel">
        <div className="ds-typeface-sample-wrap">
          <div className="ds-typeface-sample">
            <span
              style={{
                fontFamily,
                fontWeight: typeface.fontWeight,
                fontSize: `clamp(28px, 6vw, ${typeface.fontSize}px)`,
                lineHeight: 1.5,
                letterSpacing: typeface.letterSpacing,
              }}
            >
              {typeface.sample}
            </span>
          </div>
          <div className="ds-typeface-guide-w" />
          <div className="ds-typeface-guide-h" />
          <span className="ds-guide-label ds-guide-label--top">{typeface.guides.letterSpacing}</span>
          <span className="ds-guide-label ds-guide-label--right">{typeface.guides.lineHeight}</span>
        </div>
      </div>
    </section>
  )
}

function StyleRow({
  name,
  fontSize,
  lineHeight,
  weights,
  usage,
  isCoreSize,
}: {
  name: string
  fontSize: number
  lineHeight: number
  weights: string[]
  usage: string
  isCoreSize?: boolean
}) {
  return (
    <div className="ds-style-row">
      <span
        className="ds-style-row__sample"
        style={{
          fontFamily,
          fontWeight: 500,
          fontSize,
          lineHeight: `${lineHeight}px`,
          letterSpacing: -0.5,
        }}
      >
        {sampleText}
      </span>
      <div className="ds-style-row__meta">
        <span className="ds-style-row__name">{name}</span>
        <span className="ds-divider" />
        <span>{weights.join(' / ')}</span>
        <span className="ds-divider" />
        <span>{fontSize}px</span>
        <span className="ds-divider ds-style-row__usage" />
        <span className="ds-style-row__usage">{usage}</span>
        {isCoreSize && (
          <>
            <span className="ds-divider" />
            <span className="ds-core-badge">Core size</span>
          </>
        )}
      </div>
    </div>
  )
}

function OverviewSection() {
  return (
    <section className="ds-section">
      <SectionHeading title="Heading" description="페이지단위 타이틀 쓰임새로 사용 권장합니다." />
      <div className="ds-panel">
        {headingStyles.map((style) => (
          <StyleRow key={style.name} {...style} />
        ))}
      </div>
    </section>
  )
}

function BodySection() {
  return (
    <section className="ds-section">
      <SectionHeading title="Body" description="페이지단위 타이틀 쓰임새로 사용 권장합니다." />
      <div className="ds-panel">
        {bodyStyles.map((style) => (
          <StyleRow key={style.name} {...style} />
        ))}
      </div>
    </section>
  )
}

export default function TypographyPage() {
  return (
    <div className="ds-typography-page">
      <PageTitle />
      <TypefaceSection />
      <OverviewSection />
      <BodySection />
    </div>
  )
}
