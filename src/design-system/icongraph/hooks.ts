import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'

const DEFAULT_WIDTH = 448
const MIN_WIDTH = 320
const MAX_WIDTH = 720

// 상세 패널 좌측 경계를 드래그해 너비를 조절합니다.
export function useResizablePanelWidth() {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(DEFAULT_WIDTH)

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      startX.current = e.clientX
      startWidth.current = width
      setIsDragging(true)
    },
    [width],
  )

  useEffect(() => {
    if (!isDragging) return
    const move = (e: globalThis.PointerEvent) =>
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + startX.current - e.clientX)))
    const up = () => setIsDragging(false)
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
  }, [isDragging])

  return { width, isDragging, onPointerDown }
}

const ARROWS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

function isTyping(el: Element | null) {
  if (!el) return false
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable
}

// 카드가 줄바꿈되는 flex 그리드이므로 상하 이동은 DOM 위치로 판단합니다.
export function useArrowKeyGridNav({
  containerRef,
  ids,
  selectedId,
  onSelect,
}: {
  containerRef: RefObject<HTMLElement | null>
  ids: string[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  useEffect(() => {
    type N = { id: string; el: HTMLElement }
    const reveal = (n: N) => {
      n.el.focus({ preventScroll: true })
      n.el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      onSelect(n.id)
    }
    const onKey = (e: KeyboardEvent) => {
      if (!ARROWS.has(e.key) || isTyping(document.activeElement)) return
      const box = containerRef.current
      if (!box || ids.length === 0) return
      const nodes = ids
        .map((id) => ({ id, el: box.querySelector<HTMLElement>(`[data-card-id="${CSS.escape(id)}"]`) }))
        .filter((n): n is N => !!n.el)
      if (nodes.length === 0) return
      e.preventDefault()
      const cur = selectedId ? nodes.findIndex((n) => n.id === selectedId) : -1
      if (cur === -1) return reveal(nodes[0])
      if (e.key === 'ArrowRight') return reveal(nodes[Math.min(cur + 1, nodes.length - 1)])
      if (e.key === 'ArrowLeft') return reveal(nodes[Math.max(cur - 1, 0)])
      const r0 = nodes[cur].el.getBoundingClientRect()
      let best: N | null = null
      let bestScore = Infinity
      for (const n of nodes) {
        if (n.id === selectedId) continue
        const r = n.el.getBoundingClientRect()
        if (e.key === 'ArrowDown' && r.top <= r0.top + 1) continue
        if (e.key === 'ArrowUp' && r.top >= r0.top - 1) continue
        const score = Math.abs(r.top - r0.top) * 1000 + Math.abs(r.left - r0.left)
        if (score < bestScore) {
          bestScore = score
          best = n
        }
      }
      if (best) reveal(best)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [containerRef, ids, selectedId, onSelect])
}

export async function copyImageToClipboard(src: string): Promise<boolean> {
  try {
    const blob = await (await fetch(src)).blob()
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    return true
  } catch {
    return false
  }
}

export type CopyState = 'idle' | 'copied' | 'error'

// 버튼 라벨용 복사 결과 상태입니다. 1.6초 뒤 idle로 돌아갑니다.
export function useCopyState() {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const flash = useCallback((next: CopyState) => {
    setState(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 1600)
  }, [])
  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setState('idle')
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return { state, flash, reset }
}
