import { Calendar } from './Calendar'

function ChevronLeft() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" fill="none" aria-hidden="true">
      <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" fill="none" aria-hidden="true">
      <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DoubleChevronLeft() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M9 1L5 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 1L1 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DoubleChevronRight() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M3 1L7 6L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 1L11 6L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type MonthPanelProps = {
  year: number
  month: number
  onNavigate: (deltaMonths: number) => void
  selected?: Date | null
  rangeStart?: Date | null
  rangeEnd?: Date | null
  onSelectDate: (date: Date) => void
}

export function MonthPanel({ year, month, onNavigate, selected, rangeStart, rangeEnd, onSelectDate }: MonthPanelProps) {
  return (
    <div className="dp-panel">
      <div className="dp-panel__header">
        <button type="button" className="dp-panel__nav" aria-label="1년 전" onClick={() => onNavigate(-12)}>
          <DoubleChevronLeft />
        </button>
        <button type="button" className="dp-panel__nav" aria-label="전달" onClick={() => onNavigate(-1)}>
          <ChevronLeft />
        </button>
        <span className="dp-panel__title">
          {year}년 {month + 1}월
        </span>
        <button type="button" className="dp-panel__nav" aria-label="다음달" onClick={() => onNavigate(1)}>
          <ChevronRight />
        </button>
        <button type="button" className="dp-panel__nav" aria-label="1년 후" onClick={() => onNavigate(12)}>
          <DoubleChevronRight />
        </button>
      </div>
      <Calendar
        year={year}
        month={month}
        selected={selected}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onSelectDate={onSelectDate}
      />
    </div>
  )
}

export default MonthPanel
