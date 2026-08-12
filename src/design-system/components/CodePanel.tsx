import { useState } from 'react'
import './CodePanel.css'

export function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="ds-code-panel">
      <div className="ds-code-panel__header">
        <span className="ds-code-panel__label">Code</span>
        <button type="button" className="ds-code-panel__copy" onClick={handleCopy}>
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className="ds-code-panel__body">
        <code>{code}</code>
      </pre>
    </div>
  )
}
