import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export type ButtonType = 'Primary' | 'Secondary' | 'Tertiary'
export type ButtonSize = 'Large' | 'Medium' | 'Small' | 'XSmall'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type?: ButtonType
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Button({
  type = 'Primary',
  size = 'Large',
  leadingIcon,
  trailingIcon,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${type.toLowerCase()}`,
    `btn--${size.toLowerCase()}`,
    disabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} disabled={disabled} {...rest}>
      {leadingIcon && <span className="btn__icon">{leadingIcon}</span>}
      <span className="btn__label">{children}</span>
      {trailingIcon && <span className="btn__icon">{trailingIcon}</span>}
    </button>
  )
}

export default Button
