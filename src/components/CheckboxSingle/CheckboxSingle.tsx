import type { InputHTMLAttributes } from 'react'
import './CheckboxSingle.css'

type CheckboxSingleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 10" width="12" height="10" fill="none" aria-hidden="true">
      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 24px 원형 단일 선택 아이콘. `Icon Library`의 `ic_check` 계열과 별개로, `--Type-Base`의 CheckboxSingle 컴포넌트를 이식한 것입니다. */
export function CheckboxSingle({ checked, disabled, className, ...rest }: CheckboxSingleProps) {
  const classes = ['cbs-circle', checked && 'cbs-circle--on', disabled && 'cbs-circle--disabled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes}>
      <input type="checkbox" className="cbs-input" checked={checked} disabled={disabled} {...rest} />
      <span className="cbs-mark">{checked ? <CheckIcon /> : null}</span>
    </label>
  )
}

export default CheckboxSingle
