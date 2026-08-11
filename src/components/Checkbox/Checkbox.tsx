import type { InputHTMLAttributes } from 'react'
import './Checkbox.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  indeterminate?: boolean
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 10 8" width="10" height="8" fill="none" aria-hidden="true">
      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Checkbox({ checked, indeterminate, disabled, className, ...rest }: CheckboxProps) {
  const classes = [
    'cb-box',
    checked && 'cb-box--on',
    indeterminate && 'cb-box--indeterminate',
    disabled && 'cb-box--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes}>
      <input
        type="checkbox"
        className="cb-input"
        checked={checked}
        disabled={disabled}
        ref={(el) => {
          if (el) el.indeterminate = Boolean(indeterminate)
        }}
        {...rest}
      />
      <span className="cb-mark">
        {indeterminate ? <span className="cb-dash" /> : checked ? <CheckIcon /> : null}
      </span>
    </label>
  )
}

export default Checkbox
