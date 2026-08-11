import type { InputHTMLAttributes } from 'react'
import './Radio.css'

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function Radio({ checked, disabled, className, ...rest }: RadioProps) {
  const classes = ['rd-circle', checked && 'rd-circle--on', disabled && 'rd-circle--disabled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes}>
      <input type="radio" className="rd-input" checked={checked} disabled={disabled} {...rest} />
      <span className="rd-mark" />
    </label>
  )
}

export default Radio
