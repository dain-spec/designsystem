import {
  bodyStyles,
  fontFamily,
  headingStyles,
  letterSpacing,
  pageDescription,
  sampleText,
  sectionDescriptions,
  textColor,
  typeface,
} from '../tokens/typography'
import type { TypeStyle } from '../tokens/typography'
import './Typography.css'

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>Typography</h1>
      <p>{pageDescription}</p>
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
        description={sectionDescriptions.typeface}
      />
      <div className="ds-panel ds-typeface-panel">
        <div className="ds-typeface-sample-wrap">
          <div className="ds-typeface-sample">
            <span
              style={{
                fontFamily,
                fontWeight: typeface.fontWeight,
                fontSize: typeface.fontSize,
                lineHeight: `${typeface.lineHeight}px`,
                letterSpacing: typeface.letterSpacing,
                whiteSpace: 'pre',
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
  group,
  name,
  fontSize,
  lineHeight,
  weights,
  sampleWeight,
  usage,
  isCoreSize,
}: TypeStyle & { group: string }) {
  return (
    <div className="ds-style-row">
      <span
        className="ds-style-row__sample"
        style={{
          fontFamily,
          fontWeight: sampleWeight,
          fontSize,
          lineHeight: `${lineHeight}px`,
          letterSpacing,
          color: textColor,
        }}
      >
        {sampleText}
      </span>
      <div className="ds-style-row__meta">
        <span className="ds-style-row__name">{group}/{name}</span>
        <span className="ds-divider" />
        <span>{weights.join(' / ')}</span>
        {usage && (
          <>
            <span className="ds-divider ds-style-row__usage" />
            <span className="ds-style-row__usage">{usage}</span>
          </>
        )}
        {isCoreSize && (
          <>
            <span className="ds-divider" />
            <span className="ds-core-badge">Core</span>
          </>
        )}
      </div>
    </div>
  )
}

function HeadingSection() {
  return (
    <section className="ds-section">
      <SectionHeading title="Heading" description={sectionDescriptions.heading} />
      <div className="ds-panel">
        {headingStyles.map((style) => (
          <StyleRow key={style.name} group="Heading" {...style} />
        ))}
      </div>
    </section>
  )
}

function BodySection() {
  return (
    <section className="ds-section">
      <SectionHeading title="Body" description={sectionDescriptions.body} />
      <div className="ds-panel">
        {bodyStyles.map((style) => (
          <StyleRow key={style.name} group="Body" {...style} />
        ))}
      </div>
    </section>
  )
}

export default function TypographyPage() {
  return (
    <div className="ds-typography-page ds-typography-page--figma">
      <PageTitle />
      <TypefaceSection />
      <HeadingSection />
      <BodySection />
    </div>
  )
}
