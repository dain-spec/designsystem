import { useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const OVERLAY = 512
const MARGIN = 8

// 확대 버튼에 마우스를 올리면 큰 미리보기를 띄웁니다.
export default function ZoomPreview({ large, children }: { large: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  function enter() {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({
      top: Math.min(Math.max(r.top + r.height / 2 - OVERLAY / 2, MARGIN), window.innerHeight - OVERLAY - MARGIN),
      left: Math.min(Math.max(r.left + r.width / 2 - OVERLAY / 2, MARGIN), window.innerWidth - OVERLAY - MARGIN),
    })
    setHovered(true)
  }

  return (
    <div ref={ref} className="ig-zoom">
      {children}
      <button
        type="button"
        className="ig-zoom__btn"
        aria-label="크게 보기"
        onMouseEnter={enter}
        onMouseLeave={() => setHovered(false)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </button>
      {hovered &&
        createPortal(
          <div
            className="ig-zoom__overlay"
            style={{ top: pos.top, left: pos.left, width: OVERLAY, height: OVERLAY }}
            onMouseEnter={enter}
            onMouseLeave={() => setHovered(false)}
          >
            {large}
          </div>,
          document.body,
        )}
    </div>
  )
}
