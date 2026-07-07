import type { InputHTMLAttributes } from 'react'
import './DateTimeInput.css'

export type DateTimeInputSize = 'Medium' | 'Small'
export type DateTimeInputState = 'Default' | 'Focused' | 'Completed' | 'Disabled'

type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: DateTimeInputSize
  /** 스타일 가이드/데모용 강제 상태. 지정하지 않으면 실제 focus/disabled 상태를 따릅니다. */
  state?: DateTimeInputState
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" />
      <path d="M2.5 6.5H13.5" stroke="currentColor" />
      <path d="M5 2V4.5" stroke="currentColor" strokeLinecap="round" />
      <path d="M11 2V4.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" />
      <path d="M8 5V8L10 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function useVisualState(state: DateTimeInputState | undefined, disabled: boolean | undefined) {
  if (disabled) return 'Disabled'
  return state ?? 'Default'
}

function Field({
  size = 'Medium',
  state,
  disabled,
  className,
  icon,
  ...rest
}: BaseProps & { icon: React.ReactNode }) {
  const visualState = useVisualState(state, disabled)
  const classes = [
    'dt-input',
    `dt-input--${size.toLowerCase()}`,
    `dt-input--${visualState.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      <input className="dt-input__field" disabled={disabled} {...rest} />
      <span className="dt-input__icon">{icon}</span>
    </span>
  )
}

export function DateInput({ placeholder = 'YYYY.MM.DD', ...rest }: BaseProps) {
  return <Field {...rest} placeholder={placeholder} icon={<CalendarIcon />} />
}

export function TimeInput({ placeholder = '오전 hh:mm', ...rest }: BaseProps) {
  return <Field {...rest} placeholder={placeholder} icon={<ClockIcon />} />
}

export default { Date: DateInput, Time: TimeInput }
