import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useArrowKeyGridNav, useResizablePanelWidth } from './hooks'

export interface ExplorerItem {
  id: string
  title: string
  category: string
  tags: string[]
  keywords?: string[]
}

interface Props<T extends ExplorerItem> {
  items: T[]
  placeholder: string
  showCategoryLabels?: boolean
  flat?: boolean
  cardSize?: number
  renderCard: (item: T, active: boolean) => ReactNode
  renderDetail: (item: T, helpers: { search: (q: string) => void }) => ReactNode
}

// 검색 + 그리드 + 우측 상세 패널로 구성된 공통 탐색기입니다.
export default function IconExplorer<T extends ExplorerItem>({
  items,
  placeholder,
  showCategoryLabels = false,
  flat = false,
  cardSize = 56,
  renderCard,
  renderDetail,
}: Props<T>) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null)
  const [hoverId, setHoverId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? items.filter((i) => [i.id, i.title, i.category, ...i.tags, ...(i.keywords ?? [])].join(' ').toLowerCase().includes(q))
      : items
    // flat: 카테고리로 묶지 않고 items 순서(Figma 정렬 기준)를 그대로 유지합니다.
    if (flat) return [{ category: '', items: filtered }]
    const order = Array.from(new Set(filtered.map((i) => i.category)))
    return order.map((category) => ({ category, items: filtered.filter((i) => i.category === category) }))
  }, [items, query, flat])

  const total = grouped.reduce((n, g) => n + g.items.length, 0)
  const ids = useMemo(() => grouped.flatMap((g) => g.items.map((i) => i.id)), [grouped])
  const gridRef = useRef<HTMLDivElement>(null)
  const { width, isDragging, onPointerDown } = useResizablePanelWidth()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(true), [])

  useArrowKeyGridNav({ containerRef: gridRef, ids, selectedId, onSelect: setSelectedId })
  const selected = items.find((i) => i.id === selectedId) ?? null

  return (
    <div className="ig-explorer">
      <div className="ig-explorer__main">
        <div className="ig-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="아이콘 검색"
          />
          {query && (
            <button type="button" className="ig-search__clear" aria-label="검색어 지우기" onClick={() => setQuery('')}>
              ✕
            </button>
          )}
        </div>

        {total === 0 ? (
          <p className="ig-empty">검색 결과가 없습니다.</p>
        ) : (
          <div className="ig-groups" ref={gridRef}>
            {grouped.map((g) => (
              <div key={g.category}>
                {showCategoryLabels && <h3 className="ig-group-title">{g.category}</h3>}
                <div className="ig-grid">
                  {g.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      data-card-id={item.id}
                      title={item.title}
                      aria-label={item.title}
                      aria-pressed={item.id === selectedId}
                      className={`ig-card${item.id === selectedId ? ' ig-card--selected' : ''}`}
                      style={{ width: cardSize, height: cardSize }}
                      onClick={() => setSelectedId(item.id)}
                      onMouseEnter={() => setHoverId(item.id)}
                      onMouseLeave={() => setHoverId(null)}
                      onFocus={() => setHoverId(item.id)}
                      onBlur={() => setHoverId(null)}
                    >
                      {renderCard(item, hoverId === item.id)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <aside
          className={`ig-detail${isDragging ? ' ig-detail--dragging' : ''}`}
          style={{ width: open ? width : 0, flexBasis: open ? width : 0 }}
          aria-label="상세 정보"
        >
          <div
            className="ig-detail__handle"
            role="separator"
            aria-orientation="vertical"
            aria-label="패널 너비 조절"
            onPointerDown={onPointerDown}
          />
          <div className="ig-detail__body" style={{ width }}>
            <button type="button" className="ig-detail__close" aria-label="닫기" onClick={() => setSelectedId(null)}>
              ✕
            </button>
            {renderDetail(selected, { search: setQuery })}
          </div>
        </aside>
      )}
    </div>
  )
}
