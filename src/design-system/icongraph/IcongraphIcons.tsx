import { useEffect, useRef, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import rawManifest from './manifest.json'
import { withBase } from './assetUrl'
import IconExplorer from './IconExplorer'
import { ActionButton, CodeBlock, DetailHeader, DownloadLink, Preview, SubTabs } from './DetailParts'
import LottieSvg from './LottieSvg'
import { copyImageToClipboard, useCopyState } from './hooks'
import { serializeSvgForFigma } from './svgForFigma'
import {
  applyHexToGroup,
  collectStaticLottieColorCKs,
  groupLottieColorRefs,
  rgb01ToHex,
  type LottieColorGroup,
} from './lottieColor'

const manifest = withBase(rawManifest)

const FIGMA_FILE_KEY = manifest.figmaFileKey
const figmaLink = (nodeId: string) =>
  `https://www.figma.com/design/${FIGMA_FILE_KEY}?node-id=${nodeId.replace(':', '-')}`

function toComponentName(id: string) {
  return id
    .split('_')
    .map((s) => (s === 'ic' ? 'icon' : s))
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

/* ───────── MultiColor ───────── */

const multicolor = manifest.multicolor.map((i) => ({ ...i, title: i.id }))
type McItem = (typeof multicolor)[number]

function McDetail({ icon, search }: { icon: McItem; search: (q: string) => void }) {
  const [tab, setTab] = useState<'react' | 'figma'>('react')
  const name = toComponentName(icon.id)
  return (
    <>
      <DetailHeader title={icon.id} tags={icon.tags} onTag={search} />
      <Preview large={<span className="ig-svg ig-svg--48" dangerouslySetInnerHTML={{ __html: icon.svg }} />}>
        <span className="ig-svg ig-svg--48" dangerouslySetInnerHTML={{ __html: icon.svg }} />
      </Preview>
      <DownloadLink href={icon.src} filename={`${icon.id}.svg`} />
      <SubTabs
        tabs={[
          { key: 'react', label: 'React' },
          ...(icon.figmaNodeId ? [{ key: 'figma' as const, label: 'Figma' }] : []),
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'react' || !icon.figmaNodeId ? (
        <>
          <CodeBlock
            label={name}
            code={`import { ${name} } from "@/components/icon"\n\n<${name} name="${icon.id}" />`}
          />
          <CodeBlock label="SVG" code={icon.svg} />
        </>
      ) : (
        <>
          <a className="ig-download" href={figmaLink(icon.figmaNodeId)} target="_blank" rel="noopener noreferrer">
            Figma에서 열기
          </a>
          <CodeBlock label="SVG" code={icon.svg.replace(/^<svg /, `<svg id="${icon.id}" `)} />
        </>
      )}
    </>
  )
}

export function MultiColorTab() {
  return (
    <IconExplorer
      items={multicolor}
      placeholder="이름, 태그로 검색 (예: 문서, money, list)"
      renderCard={(i) => <span className="ig-svg ig-svg--24" dangerouslySetInnerHTML={{ __html: i.svg }} />}
      renderDetail={(i, h) => <McDetail key={i.id} icon={i} search={h.search} />}
    />
  )
}

/* ───────── Monochrome ───────── */

const monochrome = manifest.monochrome.map((i) => ({ ...i, title: i.id }))
type MonoItem = (typeof monochrome)[number]

function MonoDetail({ icon, search }: { icon: MonoItem; search: (q: string) => void }) {
  const [tab, setTab] = useState<'react' | 'figma'>('react')
  const name = toComponentName(icon.id)
  return (
    <>
      <DetailHeader title={icon.id} tags={icon.tags} onTag={search} />
      <Preview large={<span className="ig-svg ig-svg--mono ig-svg--48" dangerouslySetInnerHTML={{ __html: icon.svg }} />}>
        <span className="ig-svg ig-svg--mono ig-svg--48" dangerouslySetInnerHTML={{ __html: icon.svg }} />
      </Preview>
      <DownloadLink href={icon.src} filename={`${icon.id}.svg`} />
      <SubTabs
        tabs={[
          { key: 'react', label: 'React' },
          ...(icon.figmaNodeId ? [{ key: 'figma' as const, label: 'Figma' }] : []),
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'react' || !icon.figmaNodeId ? (
        <>
          <CodeBlock
            label={name}
            code={`import { ${name} } from "@/components/icon"\n\n<${name} name="${icon.id}" />`}
          />
          <CodeBlock label="SVG" code={icon.svg} />
        </>
      ) : (
        <>
          <a className="ig-download" href={figmaLink(icon.figmaNodeId)} target="_blank" rel="noopener noreferrer">
            Figma에서 열기
          </a>
          <CodeBlock label="SVG" code={icon.svg.replace(/^<svg /, `<svg id="${icon.id}" `)} />
        </>
      )}
    </>
  )
}

export function MonochromeTab() {
  return (
    <IconExplorer
      items={monochrome}
      showCategoryLabels
      placeholder="이름, 태그로 검색 (예: 화살표, 메일, arrow)"
      renderCard={(i) => <span className="ig-svg ig-svg--mono ig-svg--24" dangerouslySetInnerHTML={{ __html: i.svg }} />}
      renderDetail={(i, h) => <MonoDetail key={i.id} icon={i} search={h.search} />}
    />
  )
}

/* ───────── 3D ───────── */

type D3Item = (typeof manifest.icons3d)[number]

function D3Detail({ icon, search }: { icon: D3Item; search: (q: string) => void }) {
  const [tab, setTab] = useState<'react' | 'figma'>('react')
  const { state, flash } = useCopyState()
  const file = decodeURIComponent(icon.src.split('/').pop() ?? '')
  const link = 'figmaNodeId' in icon && icon.figmaNodeId ? figmaLink(icon.figmaNodeId) : ''
  return (
    <>
      <DetailHeader title={icon.title} tags={icon.tags} onTag={search} />
      <Preview large={<img src={icon.src} alt={icon.title} className="ig-img-lg" />}>
        <img src={icon.src} alt={icon.title} className="ig-img-lg" />
      </Preview>
      <DownloadLink href={icon.src} filename={file} />
      <SubTabs
        tabs={[
          { key: 'react', label: 'React' },
          ...(link ? [{ key: 'figma' as const, label: 'Figma' }] : []),
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'react' || !link ? (
        <CodeBlock label="IMG" code={`<img src="${icon.src}" alt="${icon.title}" />`} />
      ) : (
        <>
          <a className="ig-download" href={link} target="_blank" rel="noopener noreferrer">
            Figma에서 열기
          </a>
          <p className="ig-hint">이미지를 복사한 뒤 Figma에 붙여넣기(Cmd+V) 하세요.</p>
          <ActionButton onClick={async () => flash((await copyImageToClipboard(icon.src)) ? 'copied' : 'error')}>
            🖼️ {state === 'copied' ? '이미지 복사됨' : state === 'error' ? '복사 실패' : '이미지 복사'}
          </ActionButton>
        </>
      )}
    </>
  )
}

export function Icon3DTab() {
  return (
    <IconExplorer
      items={manifest.icons3d}
      cardSize={64}
      placeholder="이름, 태그로 검색 (예: 날씨, 비, snow)"
      renderCard={(i) => <img src={i.src} alt={i.title} className="ig-img-fit" loading="lazy" />}
      renderDetail={(i, h) => <D3Detail key={i.id} icon={i} search={h.search} />}
    />
  )
}

/* ───────── Motion ───────── */

type MotionItem = (typeof manifest.motion)[number]

function MotionCardView({ asset, active }: { asset: MotionItem; active: boolean }) {
  // 카드에서는 정적 썸네일을 쓰고, hover/focus일 때만 원본을 불러옵니다.
  if (!asset.thumb && asset.type === 'image') return <img src={asset.src} alt={asset.title} className="ig-img-fit" />
  if (active && asset.type !== 'image') return <DotLottieReact src={asset.src} loop autoplay className="ig-img-fit" />
  return asset.thumb ? <img src={asset.thumb} alt={asset.title} loading="lazy" className="ig-img-fit" /> : null
}

function useLottieJson(src: string) {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    if (!src) return
    let cancelled = false
    fetch(src)
      .then((r) => r.json())
      .then((j) => !cancelled && setData(j))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [src])
  return data
}

const clone = (d: object) => JSON.parse(JSON.stringify(d))

function MotionDetail({ asset, search }: { asset: MotionItem; search: (q: string) => void }) {
  const raw = useLottieJson(asset.type === 'json' ? asset.src : '')
  const [working, setWorking] = useState<Record<string, unknown> | null>(null)
  const [groups, setGroups] = useState<LottieColorGroup[]>([])
  const previewRef = useRef<HTMLDivElement>(null)
  const { state, flash } = useCopyState()
  const file = decodeURIComponent(asset.src.split('/').pop() ?? asset.id)

  function load() {
    if (!raw) return
    const c = clone(raw)
    setWorking(c)
    setGroups(groupLottieColorRefs(collectStaticLottieColorCKs(c)))
  }
  useEffect(load, [raw]) // eslint-disable-line react-hooks/exhaustive-deps

  function changeColor(group: LottieColorGroup, hex: string) {
    applyHexToGroup(group, hex)
    setWorking((prev) => (prev ? { ...prev } : prev))
  }

  async function copyFigmaSvg() {
    const svg = previewRef.current?.querySelector('svg')
    if (!svg) return flash('error')
    let markup: string
    try {
      markup = await serializeSvgForFigma(svg)
    } catch {
      markup = svg.outerHTML
    }
    if (!/\sxmlns\s*=/.test(markup)) markup = markup.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
    try {
      await navigator.clipboard.writeText(markup)
      flash('copied')
    } catch {
      flash('error')
    }
  }

  async function copyCanvasFrame() {
    const canvas = previewRef.current?.querySelector('canvas')
    if (!canvas) return flash('error')
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
      if (!blob) throw new Error('no blob')
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      flash('copied')
    } catch {
      flash('error')
    }
  }

  const player = (cls: string) =>
    asset.type === 'image' ? (
      <img src={asset.src} alt={asset.title} className={cls} />
    ) : asset.type === 'lottie' ? (
      <DotLottieReact src={asset.src} loop autoplay className={cls} />
    ) : working ? (
      <LottieSvg data={working} className={cls} />
    ) : null

  const label = (idle: string, done: string) => (state === 'copied' ? done : state === 'error' ? '복사 실패' : idle)

  return (
    <>
      <DetailHeader title={asset.title} tags={asset.tags} onTag={search} />
      {asset.note && <p className="ig-note">{asset.note}</p>}
      <Preview dark innerRef={previewRef} large={player('ig-lottie ig-img-lg')}>
        {player('ig-lottie ig-img-lg')}
      </Preview>

      {groups.length > 0 && (
        <div className="ig-colors">
          {groups.map((g, i) => {
            const [r, gg, b] = g.refs[0].k
            return (
              <input
                key={i}
                type="color"
                value={rgb01ToHex(r, gg, b)}
                aria-label={`색상 ${i + 1}`}
                onChange={(e) => changeColor(g, e.target.value)}
              />
            )
          })}
          <button type="button" className="ig-colors__reset" title="원래 색상으로 되돌리기" aria-label="원래 색상으로 되돌리기" onClick={load}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 2.6-6.4" strokeLinecap="round" />
              <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="ig-actions">
        <DownloadLink href={asset.src} filename={file} />
        {asset.type === 'json' ? (
          <ActionButton onClick={copyFigmaSvg}>🎨 {label('Figma로 SVG 복사', 'SVG 복사됨')}</ActionButton>
        ) : asset.type === 'lottie' ? (
          <ActionButton onClick={copyCanvasFrame}>🖼️ {label('이미지 복사', '이미지 복사됨')}</ActionButton>
        ) : (
          <ActionButton onClick={async () => flash((await copyImageToClipboard(asset.src)) ? 'copied' : 'error')}>
            🖼️ {label('이미지 복사', '이미지 복사됨')}
          </ActionButton>
        )}
      </div>
    </>
  )
}

const MOTION_ORDER = ['Loader', '기본', '3d', 'character']
const motionItems = [...manifest.motion].sort(
  (a, b) => (MOTION_ORDER.indexOf(a.category) + 1 || 99) - (MOTION_ORDER.indexOf(b.category) + 1 || 99),
)

export function MotionTab() {
  return (
    <IconExplorer
      items={motionItems}
      cardSize={64}
      showCategoryLabels
      placeholder="이름, 태그로 검색 (예: loader, 로딩, dobi)"
      renderCard={(a, active) => <MotionCardView asset={a} active={active} />}
      renderDetail={(a, h) => <MotionDetail key={a.id} asset={a} search={h.search} />}
    />
  )
}
