import '../foundation/Typography.css'
import '../../components/SearchBar/SearchBar.css'
import '../../components/Dropdown/Dropdown.css'
import './InputField.css'
import './Searchbar.css'

// Figma "Searchbar_2.0" 프레임(node 21433:60865)의 구성을 따릅니다.
// 페이지 공통 스타일(제목, 섹션, 패널, 가이드선)은 InputField.css를 함께 씁니다.

type SbState = 'default' | 'focused' | 'typing' | 'completed' | 'disabled' | 'error'

function Guide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`ds-if-guide ${className}`}>{children}</span>
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <div className="ds-section-heading">
        <h2>{title}</h2>
      </div>
      {description && <p className="ds-if-section-desc">{description}</p>}
      {children}
    </section>
  )
}

function Block({ title, description, children }: { title?: string; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ds-if-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      <div className="ds-panel ds-if-panel">{children}</div>
    </div>
  )
}

function Dim({ height, children, className = '' }: { height: number; children: React.ReactNode; className?: string }) {
  return (
    <span className={`ds-if-dim ${className}`} style={{ height }}>
      {children}
    </span>
  )
}


function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon({ size = 16 }: { size?: number }) {
  // Figma ic_filter (icongraph monochrome ic_filter)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.75 2C8.16421 2 8.5 2.33579 8.5 2.75V4.07422C10.2118 4.42161 11.5 5.93573 11.5 7.75C11.5 9.56487 10.2106 11.0781 8.49805 11.4248V21.25C8.49805 21.6642 8.16226 22 7.74805 22C7.33383 22 6.99805 21.6642 6.99805 21.25V11.4238C5.28741 11.0756 4 9.56348 4 7.75C4 5.93573 5.28824 4.42161 7 4.07422V2.75C7 2.33579 7.33579 2 7.75 2ZM7.75 5.5C6.50736 5.5 5.5 6.50736 5.5 7.75C5.5 8.99264 6.50736 10 7.75 10C8.99264 10 10 8.99264 10 7.75C10 6.50736 8.99264 5.5 7.75 5.5Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.248 2C16.6623 2 16.998 2.33579 16.998 2.75V12.5742C18.7107 12.9209 20 14.4351 20 16.25C20 18.0642 18.7117 19.5773 17 19.9248V21.25C17 21.6642 16.6642 22 16.25 22C15.8358 22 15.5 21.6642 15.5 21.25V19.9248C13.7883 19.5773 12.5 18.0642 12.5 16.25C12.5 14.4365 13.7873 12.9234 15.498 12.5752V2.75C15.498 2.33579 15.8338 2 16.248 2ZM16.25 14C15.0074 14 14 15.0074 14 16.25C14 17.4926 15.0074 18.5 16.25 18.5C17.4926 18.5 18.5 17.4926 18.5 16.25C18.5 15.0074 17.4926 14 16.25 14Z" />
    </svg>
  )
}

function ClearIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#b4b4b4" />
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function Sb({
  state = 'default',
  value,
  count,
  filter,
  width = 190,
}: {
  state?: SbState
  value?: string
  count?: string
  filter?: boolean
  width?: number
}) {
  const clear = state === 'typing' || state === 'error'
  const ico = filter ? 18 : 16
  return (
    <span className={`sb-field ds-sb sb-field--${state}${filter ? ' ds-sb--f' : ''}`} style={{ width: filter && width === 190 ? 200 : width }}>
      <span className="ds-sb__text">
        {state === 'focused' && filter && <i className="ds-sb__caret" />}
        {value ? <span className="ds-sb__value">{value}</span> : <span className="ds-sb__placeholder">검색어를 입력해주세요.</span>}
        {state === 'focused' && !filter && <i className="ds-sb__caret" />}
        {state === 'typing' && <i className="ds-sb__caret" />}
      </span>
      {count && <span className="ds-sb__count">{count}</span>}
      {clear && <ClearIcon size={filter ? 18 : 14} />}
      <span className="sb-field__icon">
        <SearchIcon size={ico} />
      </span>
      {filter && (
        <span className="ds-sb__filter">
          <FilterIcon size={ico} />
        </span>
      )}
    </span>
  )
}

const STATES: { label: string; state: SbState; value?: string; count?: string }[] = [
  { label: 'Default', state: 'default' },
  { label: 'Focused', state: 'focused' },
  { label: 'Typing', state: 'typing', value: '검색어 입력중' },
  { label: 'Completed', state: 'completed', value: '입력한 검색어', count: '10/99' },
  { label: 'Disabled', state: 'disabled' },
  { label: 'Error', state: 'error', value: 'e!@' },
]

function States({ filter }: { filter?: boolean }) {
  return (
    <div className="ds-sb-states">
      {STATES.filter((s) => !(filter && s.count)).map(({ label, state, value, count }) => (
        <div key={label} className="ds-if-state ds-sb-state">
          <span className="ds-if-state__label">{label}</span>
          <Sb state={state} value={value} count={count} filter={filter} />
        </div>
      ))}
    </div>
  )
}

function Segment({ items, active }: { items: string[]; active: string }) {
  return (
    <span className="ds-sb-seg">
      {items.map((t) => (
        <span key={t} className={t === active ? 'is-active' : ''}>
          {t}
        </span>
      ))}
    </span>
  )
}

function Plain({ placeholder, width, search }: { placeholder: string; width?: number | string; search?: boolean }) {
  return (
    <span className="ds-sb-input" style={{ width }}>
      <span className="ds-sb-input__text">{placeholder}</span>
      {search && <SearchIcon size={18} />}
    </span>
  )
}

function DropdownMock({ value, open }: { value: string; open?: boolean }) {
  return (
    <div className="ds-sb-dd">
      <span className={`dd-field dd-field--medium${open ? ' dd-field--focused' : ' dd-field--completed'}`} style={{ width: '100%' }}>
        <span className="dd-field__value">{value}</span>
        <span className="dd-field__icon">
          <svg viewBox="0 0 10 6" width="10" height="6" fill="none" aria-hidden="true">
            <path d={open ? 'M1 5L5 1L9 5' : 'M1 1L5 5L9 1'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      {open && (
        <ul className="dd-menu" style={{ position: 'static', marginTop: 4 }}>
          {['전체 메일함', '리스트 항목', '리스트 항목', '리스트 항목', '리스트 항목'].map((t, i) => (
            <li key={i}>
              <span className={`dd-menu__item${i === 0 ? ' dd-menu__item--selected' : ''}`}>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DateRange() {
  return (
    <div className="ds-sb-drp">
      <div className="ds-sb-drp__cal">
        {['2024.01', '2024.02'].map((m) => (
          <div key={m} className="ds-sb-drp__month">
            <span className="ds-sb-drp__title">{m}</span>
            <span className="ds-sb-drp__grid" />
          </div>
        ))}
      </div>
      <div className="ds-sb-drp__bottom">
        <span className="ds-sb-drp__text">기간을 선택하세요.</span>
        <span className="ds-sb-btn">취소</span>
        <span className="ds-sb-btn ds-sb-btn--primary">적용</span>
      </div>
    </div>
  )
}

function FilterPanel({ period = '전체', dropdownOpen }: { period?: string; dropdownOpen?: boolean }) {
  const rows: [string, React.ReactNode][] = [
    ['기간', <>
      <Segment items={['전체', '1주', '1개월', '3개월', '6개월', '직접입력']} active={period} />
      <span className="ds-sb-hint">조회기간: 전체</span>
    </>],
    ['메일함', <DropdownMock value="전체 메일함" open={dropdownOpen} />],
    ['보낸사람', <Plain placeholder="내용을 입력하세요." />],
    ['받는사람', <span className="ds-sb-pair"><span className="ds-sb-sel">받는 사람 <i /></span><Plain placeholder="내용을 입력하세요." /></span>],
    ['내용', <span className="ds-sb-pair"><span className="ds-sb-sel">제목+본문 <i /></span><Plain placeholder="내용을 입력하세요." /></span>],
    ['담당자', <Plain placeholder="내용을 입력하세요." />],
    ['검색', <Plain placeholder="이름을 검색하세요." search />],
  ]
  return (
    <div className="ds-sb-filter">
      <Sb filter width={260} />
      <div className="ds-sb-pop">
        {rows.map(([label, node]) => (
          <div key={label} className="ds-sb-row">
            <span className="ds-sb-row__label">{label}</span>
            <div className="ds-sb-row__body">{node}</div>
          </div>
        ))}
        <div className="ds-sb-foot">
          <label className="ds-sb-check">
            <i>
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M3.5 7.2L6 9.6L10.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
            첨부파일
          </label>
          <span className="ds-sb-foot__btns">
            <span className="ds-sb-btn">초기화</span>
            <span className="ds-sb-btn ds-sb-btn--primary">조회</span>
          </span>
        </div>
      </div>
      {period === '직접입력' && <DateRange />}
    </div>
  )
}

export default function SearchbarPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>Searchbar</h1>
        <p>검색어를 입력해 원하는 정보를 찾을 때 사용하는 폼 컴포넌트입니다.</p>
      </header>

      <Section title="Types">
        <div className="ds-panel ds-if-panel">
          <div className="ds-sb-types">
            <div className="ds-if-state">
              <span className="ds-if-state__label">Searchbar</span>
              <Sb />
            </div>
            <div className="ds-if-state">
              <span className="ds-if-state__label">Searchbar Filter</span>
              <Sb filter />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Anatomy"
        description="Searchbar는 검색어를 입력하는 Container와 Search Icon으로 구성되며, 필요에 따라 결과 수를 표시할 수 있습니다. Filter 타입은 Filter Icon이 추가됩니다."
      >
        <Block>
          <div className="ds-sb-anatomy">
            <Guide className="ds-sb-a ds-sb-a--count ds-if-pin ds-if-pin--down">Result Count (Optional)</Guide>
            <Guide className="ds-sb-a ds-sb-a--icon ds-if-pin ds-if-pin--down">Search Icon</Guide>
            <Guide className="ds-sb-a ds-sb-a--filter ds-if-pin ds-if-pin--right">Filter Icon (Filter 타입 전용)</Guide>
            <Guide className="ds-sb-a ds-sb-a--container">Container</Guide>
            <Sb state="completed" value="입력한 검색어" count="10/99" filter />
          </div>
        </Block>
      </Section>

      <Section title="Searchbar" description="검색어를 입력하고 검색할 때 사용하는 컴포넌트로, 입력 중 자동완성을 제공합니다.">
        <h2 className="ds-sb-sub">Behaviors</h2>
        <Block title="State" description="Searchbar는 Default, Focused, Typing, Completed, Disabled, Error 상태를 가집니다.">
          <States />
        </Block>
        <Block title="Typing" description="입력 중 하단에 자동완성 Dropdown이 나타날 경우, 세로 간격은 4px로 둡니다.">
          <div className="ds-sb-typing">
            <Sb state="typing" value="kim" />
            <ul className="dd-menu ds-sb-auto">
              <li><span className="dd-menu__item ds-sb-auto__group">카테고리명 <b>99건</b></span></li>
              {['douzonekim', 'douzonekim', 'douzonekim', 'douzonekim', 'douzonekim'].map((t, i) => (
                <li key={i}><span className="dd-menu__item">{t.replace('kim', '')}<b>kim</b></span></li>
              ))}
            </ul>
            <Guide className="ds-sb-note">상단 타이틀 있는 경우<br />타이틀 리스트 고정, border 추가</Guide>
          </div>
        </Block>
      </Section>

      <Section title="Searchbar Filter" description="상세 검색 조건을 지정해 검색할 때 사용하는 폼 컴포넌트입니다. 검색 필터는 팝오버로 표시됩니다.">
        <h2 className="ds-sb-sub">Behaviors</h2>
        <Block title="State" description="Searchbar Filter는 Default, Focused, Typing, Completed, Disabled, Error 상태를 가집니다.">
          <States filter />
        </Block>
        <Block title="Filter" description="Dropdown, Button 등 입력 속성의 컴포넌트와 조합 시, 간격 4입니다.">
          <div className="ds-sb-filters">
            <FilterPanel />
            <FilterPanel period="직접입력" />
            <FilterPanel dropdownOpen />
          </div>
        </Block>
      </Section>

      <Section title="Spec">
        <Block title="Size" description="Container의 높이는 32px로 단일 사이즈입니다.">
          <div className="ds-sb-size">
            <Dim height={32}>
              <Guide>32</Guide>
              <i className="ds-if-bar" style={{ height: 32 }} />
            </Dim>
            <Sb filter />
          </div>
        </Block>
      </Section>
    </div>
  )
}
