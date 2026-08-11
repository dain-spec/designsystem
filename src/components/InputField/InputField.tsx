import type { InputHTMLAttributes } from 'react'
import './InputField.css'

export type InputFieldSize = 'Medium' | 'Small'
export type InputFieldState =
  | 'Default'
  | 'Focused'
  | 'Typing'
  | 'Completed'
  | 'Disabled'
  | 'ReadOnly'
  | 'Success'
  | 'Warning'
  | 'Error'

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputFieldSize
  /** 스타일 가이드/데모용 강제 상태. 지정하지 않으면 실제 focus/disabled/readOnly를 따릅니다. */
  state?: InputFieldState
}

function useVisualState(state: InputFieldState | undefined, disabled: boolean | undefined, readOnly: boolean | undefined) {
  if (disabled) return 'Disabled'
  if (readOnly) return 'ReadOnly'
  return state ?? 'Default'
}

export function InputField({ size = 'Medium', state, disabled, readOnly, className, ...rest }: InputFieldProps) {
  const visualState = useVisualState(state, disabled, readOnly)
  const classes = [
    'if-field',
    `if-field--${size.toLowerCase()}`,
    `if-field--${visualState.toLowerCase()}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <input className={classes} disabled={disabled} readOnly={readOnly} {...rest} />
}

export default InputField
