import type { TextareaHTMLAttributes } from 'react'
import './TextArea.css'

export type TextAreaState = 'Default' | 'Focused' | 'Typing' | 'Completed' | 'Disabled'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** 스타일 가이드/데모용 강제 상태. 지정하지 않으면 실제 focus/disabled를 따릅니다. */
  state?: TextAreaState
}

function useVisualState(state: TextAreaState | undefined, disabled: boolean | undefined) {
  if (disabled) return 'Disabled'
  return state ?? 'Default'
}

export function TextArea({ state, disabled, className, ...rest }: TextAreaProps) {
  const visualState = useVisualState(state, disabled)
  const classes = ['ta-field', `ta-field--${visualState.toLowerCase()}`, className].filter(Boolean).join(' ')

  return <textarea className={classes} disabled={disabled} {...rest} />
}

export default TextArea
