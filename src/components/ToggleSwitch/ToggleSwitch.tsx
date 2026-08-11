import type { InputHTMLAttributes } from 'react'
import './ToggleSwitch.css'

export type ToggleSwitchSize = 'Medium' | 'Small'

type ToggleSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  size?: ToggleSwitchSize
  checked?: boolean
}

export function ToggleSwitch({ size = 'Medium', checked, disabled, className, ...rest }: ToggleSwitchProps) {
  const classes = [
    'ts-track',
    `ts-track--${size.toLowerCase()}`,
    checked && 'ts-track--on',
    disabled && 'ts-track--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes}>
      <input type="checkbox" className="ts-input" checked={checked} disabled={disabled} {...rest} />
      <span className="ts-handle" />
    </label>
  )
}

export default ToggleSwitch
