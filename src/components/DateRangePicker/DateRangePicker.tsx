import { useState } from 'react'
import { MonthPanel } from '../DatePicker/MonthPanel'
import '../DatePicker/DatePicker.css'
import './DateRangePicker.css'

export type DateRange = { start: Date | null; end: Date | null }

export type DateRangePickerProps = {
  className?: string
  value?: DateRange
  onChange?: (range: DateRange) => void
  defaultMonth?: Date
  onCancel?: () => void
  onConfirm?: () => void
}

function daysBetween(a: Date, b: Date) {
  const ms = 24 * 60 * 60 * 1000
  return Math.round((b.getTime() - a.getTime()) / ms) + 1
}

export function DateRangePicker({ className, value, onChange, defaultMonth, onCancel, onConfirm }: DateRangePickerProps) {
  const base = defaultMonth ?? value?.start ?? new Date()
  const [year, setYear] = useState(base.getFullYear())
  const [month, setMonth] = useState(base.getMonth())
  const range = value ?? { start: null, end: null }

  function navigate(deltaMonths: number) {
    const next = new Date(year, month + deltaMonths, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  function handleSelectDate(date: Date) {
    if (!range.start || (range.start && range.end)) {
      onChange?.({ start: date, end: null })
      return
    }
    if (date < range.start) {
      onChange?.({ start: date, end: range.start })
    } else {
      onChange?.({ start: range.start, end: date })
    }
  }

  const next = new Date(year, month + 1, 1)
  const classes = ['dp-card', 'drp-card', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="drp-row">
        <MonthPanel
          year={year}
          month={month}
          onNavigate={navigate}
          rangeStart={range.start}
          rangeEnd={range.end}
          onSelectDate={handleSelectDate}
        />
        <div className="drp-divider" />
        <MonthPanel
          year={next.getFullYear()}
          month={next.getMonth()}
          onNavigate={navigate}
          rangeStart={range.start}
          rangeEnd={range.end}
          onSelectDate={handleSelectDate}
        />
      </div>
      <div className="dp-footer">
        <span className="dp-footer__text">
          선택기간 <strong>{range.start && range.end ? daysBetween(range.start, range.end) : 0}</strong>일
        </span>
        <div className="dp-footer__buttons">
          <button type="button" className="dp-btn dp-btn--cancel" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="dp-btn dp-btn--confirm" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
