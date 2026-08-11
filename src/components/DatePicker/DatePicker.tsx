import { useState } from 'react'
import { MonthPanel } from './MonthPanel'
import './DatePicker.css'

export type DatePickerProps = {
  className?: string
  value?: Date | null
  onChange?: (date: Date) => void
  defaultMonth?: Date
  /** true면 하단에 취소/확인 버튼을 표시합니다(Figma Type=DefaultButton). */
  showFooter?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

export function DatePicker({ className, value, onChange, defaultMonth, showFooter, onCancel, onConfirm }: DatePickerProps) {
  const base = value ?? defaultMonth ?? new Date()
  const [year, setYear] = useState(base.getFullYear())
  const [month, setMonth] = useState(base.getMonth())

  function navigate(deltaMonths: number) {
    const next = new Date(year, month + deltaMonths, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  const classes = ['dp-card', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <MonthPanel
        year={year}
        month={month}
        onNavigate={navigate}
        selected={value}
        onSelectDate={(date) => onChange?.(date)}
      />
      {showFooter && (
        <div className="dp-footer">
          <span className="dp-footer__spacer" />
          <div className="dp-footer__buttons">
            <button type="button" className="dp-btn dp-btn--cancel" onClick={onCancel}>
              취소
            </button>
            <button type="button" className="dp-btn dp-btn--confirm" onClick={onConfirm}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
