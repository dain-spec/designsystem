import type { ButtonHTMLAttributes } from 'react'
import './Dropdown.css'

export type DropdownSize = 'Medium' | 'Small'
export type DropdownState = 'Default' | 'Focused' | 'Completed' | 'Disabled'

type DropdownProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & {
  size?: DropdownSize
  /** 스타일 가이드/데모용 강제 상태. 지정하지 않으면 실제 focus/disabled를 따릅니다. */
  state?: DropdownState
  placeholder?: string
  /** 선택된 값의 라벨. 없으면 placeholder를 옅은 색으로 표시합니다. */
  value?: string
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 10 6" width="10" height="6" fill="none" aria-hidden="true">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function useVisualState(state: DropdownState | undefined, disabled: boolean | undefined) {
  if (disabled) return 'Disabled'
  return state ?? 'Default'
}

export function Dropdown({
  size = 'Medium',
  state,
  disabled,
  className,
  placeholder = '선택해주세요.',
  value,
  ...rest
}: DropdownProps) {
  const visualState = useVisualState(state, disabled)
  const classes = [
    'dd-field',
    `dd-field--${size.toLowerCase()}`,
    `dd-field--${visualState.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} disabled={disabled} {...rest}>
      <span className={value ? 'dd-field__value' : 'dd-field__placeholder'}>{value ?? placeholder}</span>
      <span className="dd-field__icon">
        <ChevronIcon />
      </span>
    </button>
  )
}

export default Dropdown
