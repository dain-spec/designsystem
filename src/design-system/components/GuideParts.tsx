// 가이드 페이지 공통 조각(Guide/Section/Block/Dim). 스타일은 InputField.css를 함께 씁니다.
import './InputField.css'

export function Guide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`ds-if-guide ${className}`}>{children}</span>
}

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <div className="ds-section-heading">
        <h2>{title}</h2>
      </div>
      {description && <p className="ds-if-section-desc">{description}</p>}
      {children}
    </section>
  )
}

export function Block({ title, description, children, panelClass = '' }: { title?: string; description?: React.ReactNode; children: React.ReactNode; panelClass?: string }) {
  return (
    <div className="ds-if-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      <div className={`ds-panel ds-if-panel ${panelClass}`}>{children}</div>
    </div>
  )
}

export function Dim({ height, children, className = '' }: { height: number; children: React.ReactNode; className?: string }) {
  return (
    <span className={`ds-if-dim ${className}`} style={{ height }}>
      {children}
    </span>
  )
}

