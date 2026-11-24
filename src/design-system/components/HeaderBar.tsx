import { assetUrl } from '../icongraph/assetUrl'
import './HeaderBar.css'

// Figma Header_2.0 의 Header 컴포넌트(node 21613:66079)를 따릅니다.
// 높이 54px, 좌우 padding 20px, gap 8px. Path는 남는 폭을 차지하고 Right는 내용 폭만큼 차지합니다.

export type HeaderLogo = 'wehago' | 'wehago-ai' | 'wehago-t' | 'wehago-t-ai'

export interface HeaderBarProps {
  logo?: HeaderLogo
  /** 로고 옆 회사명 칩 */
  company?: string
  /** 경로 항목. dropdownLast가 true면 마지막 항목에 아래 화살표를 붙입니다. */
  path?: string[]
  dropdownLast?: boolean
  name?: string
  rank?: string
  dark?: boolean
  /** Hovered 상태를 고정 표시합니다. */
  hovered?: 'icons' | 'path'
  hoveredProfile?: boolean
}

const a = (file: string, dark?: boolean) => assetUrl(`/header/${dark ? 'dark/' : ''}${file}`)

const ICONS: { id: string; file: string; inset: string; badge?: string }[] = [
  { id: 'search', file: 'ic-search.svg', inset: '10% 13.54% 13.54% 10%' },
  { id: 'alarm', file: 'ic-alarm.svg', inset: '8.33% 13.54% 8.79% 13.54%', badge: '99+' },
  { id: 'note', file: 'ic-note.svg', inset: '12.5%' },
  { id: 'bookmark', file: 'ic-bookmark.svg', inset: '8.33% 16.67% 9.37% 16.67%' },
  { id: 'video', file: 'ic-video.svg', inset: '19.79% 5.21% 19.79% 8.33%' },
  { id: 'chat', file: 'ic-chat.svg', inset: '9.38% 9.38% 8.76% 8.21%' },
  { id: 'inbox', file: 'ic-inbox.svg', inset: '12.5%' },
  { id: 'tree', file: 'ic-tree.svg', inset: '8.33%' },
  { id: 'question', file: 'ic-question.svg', inset: '8.33%' },
]

function Logo({ logo, dark }: { logo: HeaderLogo; dark?: boolean }) {
  const isT = logo === 'wehago-t' || logo === 'wehago-t-ai'
  const hasAi = logo === 'wehago-ai' || logo === 'wehago-t-ai'
  return (
    <div className="hd-logo">
      {isT ? (
        <div className="hd-logo__t">
          <img src={a('logo-t.svg')} alt="WEHAGO T" style={{ position: 'absolute', inset: '14.41% 1.39%', width: 'auto', height: 'auto' }} />
        </div>
      ) : (
        <img
          className="hd-logo__img"
          src={dark ? a('logo-wehago.svg', true) : a(hasAi ? 'logo-wehago-b.svg' : 'logo-wehago.svg')}
          alt="WEHAGO"
        />
      )}
      {hasAi && (
        <img
          className={isT ? 'hd-logo__badge hd-logo__badge--t' : 'hd-logo__badge'}
          src={dark ? a('badge-ai.svg', true) : a(isT ? 'badge-ai-t.svg' : 'badge-ai.svg')}
          alt="AI Edition"
        />
      )}
    </div>
  )
}

function WEbot({ dark }: { dark?: boolean }) {
  return (
    <div className="hd-webot">
      <img className="hd-webot__bg" src={a('webot-bg.svg', dark)} alt="" />
      <div className="hd-webot__char" style={{ maskImage: `url("${a('webot-mask.svg', dark)}")`, WebkitMaskImage: `url("${a('webot-mask.svg', dark)}")` }}>
        <img src={a('webot-char.png', dark)} alt="" />
      </div>
      <img className="hd-webot__star" src={a('webot-star.svg', dark)} alt="" />
    </div>
  )
}

function OneAi() {
  return (
    <div className="hd-oneai">
      <img className="hd-oneai__fill" src={assetUrl('/header/oneai-base.svg')} alt="" />
      <img className="hd-oneai__btn" src={assetUrl('/header/oneai-btn.svg')} alt="" />
      <div className="hd-oneai__origin">
        <img src={assetUrl('/header/oneai-origin.png')} alt="" />
      </div>
      <img className="hd-oneai__union" src={assetUrl('/header/oneai-union.svg')} alt="ONE AI" />
    </div>
  )
}

export default function HeaderBar({
  logo = 'wehago',
  company,
  path,
  dropdownLast,
  name = '김더존',
  rank = '대리',
  dark,
  hovered,
  hoveredProfile,
}: HeaderBarProps) {
  const cls = ['hd', dark ? 'hd--dark' : ''].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      <div className="hd__left">
        <Logo logo={logo} dark={dark} />
        {company && (
          <span className="hd-company">
            <img src={assetUrl('/header/company-dot.svg')} alt="" />
            {company}
          </span>
        )}
      </div>
      <div className="hd__path">
        {path?.map((label, i) => (
          <span key={label + i} className="hd__path-wrap">
            {i > 0 && (
              <span className="hd-chev">
                <img src={a('chev-right.svg', dark)} alt="" />
              </span>
            )}
            <span className={`hd-pathitem${hovered === 'path' || dark ? ' is-hover' : ''}`}>
              <span className="hd-pathitem__label">{label}</span>
              {dropdownLast && i === path.length - 1 && (
                <span className="hd-chevdown">
                  <img src={assetUrl('/header/chev-down.svg')} alt="" />
                </span>
              )}
            </span>
          </span>
        ))}
      </div>
      <div className="hd__right">
        <OneAi />
        <div className="hd-iwrap">
          {ICONS.map((ic) => (
            <span key={ic.id} className={`hd-icon${hovered === 'icons' ? ' is-hover' : ''}`}>
              <span className="hd-icon__box">
                <img src={a(ic.file, dark)} alt="" style={{ position: 'absolute', inset: ic.inset, width: 'auto', height: 'auto' }} />
              </span>
              {ic.badge && <span className="hd-icon__badge">{ic.badge}</span>}
            </span>
          ))}
          <WEbot dark={dark} />
        </div>
        <span className="hd-divider" />
        <div className="hd-profile">
          <span className={`hd-name${hoveredProfile || dark ? ' is-hover' : ''}`}>
            <span className="hd-name__a">{name}</span>
            <span className="hd-name__b">{rank}</span>
          </span>
          <span className="hd-avatar">
            <img src={a('avatar.png', dark)} alt="" />
          </span>
        </div>
      </div>
    </div>
  )
}
