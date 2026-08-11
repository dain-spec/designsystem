import { useEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import './Dropdown.css'

export type DropdownSize = 'Medium' | 'Small'
export type DropdownState = 'Default' | 'Focused' | 'Completed' | 'Disabled'
export type DropdownOption = { value: string; label: string }

type DropdownProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onSelect'> & {
  size?: DropdownSize
  /** 스타일 가이드/데모용 강제 상태. 지정하지 않으면 실제 focus/disabled를 따릅니다. */
  state?: DropdownState
  placeholder?: string
  /** 선택된 값의 라벨. 없으면 placeholder를 옅은 색으로 표시합니다. */
  value?: string
  /** 지정하면 클릭 시 DropdownMenu(Figma 실제 스펙)를 열어 목록에서 선택할 수 있습니다. */
  options?: DropdownOption[]
  onSelect?: (option: DropdownOption) => void
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 10 6" width="10" height="6" fill="none" aria-hidden="true">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function resolveVisualState(state: DropdownState | undefined, disabled: boolean | undefined, open: boolean) {
  if (disabled) return 'Disabled'
  if (open) return 'Focused'
  return state ?? 'Default'
}

export function Dropdown({
  size = 'Medium',
  state,
  disabled,
  className,
  placeholder = '선택해주세요.',
  value,
  options,
  onSelect,
  onClick,
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const visualState = resolveVisualState(state, disabled, open)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const classes = [
    'dd-field',
    `dd-field--${size.toLowerCase()}`,
    `dd-field--${visualState.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="dd-wrap" ref={wrapRef}>
      <button
        type="button"
        className={classes}
        disabled={disabled}
        onClick={(e) => {
          if (options) setOpen((v) => !v)
          onClick?.(e)
        }}
        {...rest}
      >
        <span className={value ? 'dd-field__value' : 'dd-field__placeholder'}>{value ?? placeholder}</span>
        <span className="dd-field__icon">
          <ChevronIcon />
        </span>
      </button>
      {open && options && options.length > 0 && (
        <ul className="dd-menu" role="listbox">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`dd-menu__item${option.label === value ? ' dd-menu__item--selected' : ''}`}
                role="option"
                aria-selected={option.label === value}
                onClick={() => {
                  onSelect?.(option)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
