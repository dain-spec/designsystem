import { useState, type ReactNode, type Ref } from 'react'
import ZoomPreview from './ZoomPreview'

export function CopyButton({ text, label = '복사' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="ig-copy"
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setDone(true)
            setTimeout(() => setDone(false), 1200)
          })
          .catch(() => {})
      }}
    >
      {done ? '복사됨' : label}
    </button>
  )
}

export function DetailHeader({ title, tags, onTag }: { title: string; tags: string[]; onTag: (t: string) => void }) {
  const uniq = Array.from(new Map(tags.map((t) => [t.toLowerCase(), t])).values())
  return (
    <>
      <div className="ig-detail__title">
        <h2>{title}</h2>
        <CopyButton text={title} />
      </div>
      {uniq.length > 0 && (
        <div className="ig-tags">
          {uniq.map((t) => (
            <button key={t} type="button" className="ig-tag" onClick={() => onTag(t)}>
              {t}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export function Preview({
  children,
  large,
  dark = false,
  innerRef,
}: {
  children: ReactNode
  large: ReactNode
  dark?: boolean
  innerRef?: Ref<HTMLDivElement>
}) {
  return (
    <ZoomPreview large={large}>
      <div ref={innerRef} className={`ig-preview${dark ? ' ig-preview--dark' : ''}`}>
        {children}
      </div>
    </ZoomPreview>
  )
}

export function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="ig-download ig-download-btn" onClick={onClick}>
      {children}
    </button>
  )
}

export function DownloadLink({ href, filename }: { href: string; filename: string }) {
  return (
    <a className="ig-download" href={href} download={filename}>
      {filename} 다운로드
    </a>
  )
}

export function CodeBlock({ label, code }: { label?: string; code: string }) {
  return (
    <div className="ig-code">
      {label && <p className="ig-code__label">{label}</p>}
      <div className="ig-code__box">
        <pre>{code}</pre>
        <CopyButton text={code} />
      </div>
    </div>
  )
}

export function SubTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[]
  active: T
  onChange: (k: T) => void
}) {
  return (
    <div className="ig-subtabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          className={`ig-subtabs__tab${active === t.key ? ' ig-subtabs__tab--active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
