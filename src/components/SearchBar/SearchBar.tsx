import type { InputHTMLAttributes } from 'react'
import './SearchBar.css'

export type SearchBarState = 'Default' | 'Focused' | 'Typing' | 'Completed' | 'Disabled' | 'Error'

type SearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** 스타일 가이드/데모용 강제 상태. 지정하지 않으면 실제 focus/disabled를 따릅니다. */
  state?: SearchBarState
  /** true면 SearchbarFilter 변형 — 우측에 필터 버튼을 표시합니다. */
  withFilter?: boolean
  onFilterClick?: () => void
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M2 3H14" stroke="currentColor" strokeLinecap="round" />
      <path d="M4.5 8H11.5" stroke="currentColor" strokeLinecap="round" />
      <path d="M7 13H9" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}

function useVisualState(state: SearchBarState | undefined, disabled: boolean | undefined) {
  if (disabled) return 'Disabled'
  return state ?? 'Default'
}

export function SearchBar({
  state,
  disabled,
  className,
  withFilter,
  onFilterClick,
  placeholder = '검색어를 입력해주세요.',
  ...rest
}: SearchBarProps) {
  const visualState = useVisualState(state, disabled)
  const classes = ['sb-field', `sb-field--${visualState.toLowerCase()}`, className].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      <span className="sb-field__icon">
        <SearchIcon />
      </span>
      <input className="sb-field__input" disabled={disabled} placeholder={placeholder} {...rest} />
      {withFilter && (
        <button
          type="button"
          className="sb-field__filter"
          disabled={disabled}
          onClick={onFilterClick}
          aria-label="필터"
        >
          <FilterIcon />
        </button>
      )}
    </span>
  )
}

export default SearchBar
