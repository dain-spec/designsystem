import '../foundation/Typography.css'
import { Guide, Section, Block } from './GuideParts'
import './InputField.css'
import './FileUpload.css'

// Figma "FileUpload_2.0" 프레임(node 21516:58780)의 구성을 따릅니다.

const FILES = [
  'AI 에이전트 혁신 : 산업을 바꾸는 현재와 미래전망.pdf',
  'AI 기술의 발전 : 새로운 기회와 도전.pdf',
  'AI 기술의 발전 : 새로운 기회와 도전.pdf',
  'AI 기술의 발전 : 새로운 기회와 도전.pdf',
  'AI 기술의 발전 : 새로운 기회와 도전.pdf',
  'AI 기술의 발전 : 새로운 기회와 도전.pdf',
]

const PdfIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <rect x="2" y="1" width="12" height="14" rx="2" fill="#ee4b4b" />
    <path d="M5 9.5c1.5-1 3-3 3-5 0 2 1 3.5 3 4.5-2 0-4 .5-6 .5z" fill="none" stroke="#fff" strokeWidth="0.9" />
  </svg>
)
const CloseIcon = ({ light }: { light?: boolean }) => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ color: light ? '#fff' : '#999' }}>
    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
const ShareIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true" style={{ color: '#777' }}>
    <circle cx="4" cy="8" r="1.6" stroke="currentColor" /><circle cx="12" cy="4" r="1.6" stroke="currentColor" /><circle cx="12" cy="12" r="1.6" stroke="currentColor" />
    <path d="M5.4 7.2L10.6 4.8M5.4 8.8L10.6 11.2" stroke="currentColor" />
  </svg>
)
const DownIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true" style={{ color: '#777' }}>
    <path d="M8 2V10M4.5 7L8 10.5L11.5 7M3 13.5H13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function DropZone() {
  return (
    <div className="ds-fu-drop">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" style={{ color: '#999' }}>
        <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeLinejoin="round" />
        <path d="M12 11v6M9 14h6" stroke="currentColor" strokeLinecap="round" />
      </svg>
      <strong>파일을 직접 선택하거나 여기로 드래그해 업로드하세요.</strong>
      <span>(2GB 이하 파일을 최대 5개까지 첨부할 수 있습니다.)</span>
      <span className="ds-fu-drop__btns">
        <span className="ds-fu-btn">⤒ 내 PC</span>
        <span className="ds-fu-btn">☁ WE Drive</span>
      </span>
    </div>
  )
}

function FileList({ readOnly, width = 280 }: { readOnly?: boolean; width?: number }) {
  return (
    <div className="ds-fu-list" style={{ width }}>
      <ul>
        {FILES.map((f, i) => (
          <li key={i}>
            <PdfIcon />
            <span className="ds-fu-list__name">{f}</span>
            {readOnly ? (
              <>
                <ShareIcon />
                <DownIcon />
              </>
            ) : (
              <CloseIcon />
            )}
          </li>
        ))}
      </ul>
      <i className="ds-fu-list__scroll" />
    </div>
  )
}

function Progress({ expand }: { expand?: boolean }) {
  if (expand) {
    return (
      <div className="ds-fu-pb ds-fu-pb--expand">
        <div className="ds-fu-pb__text">
          <strong>파일을 다운로드하고 있습니다.(1/5)</strong>
          <span>AI 에이전트 혁신 : 산업… .pdf(12MB/24MB)</span>
        </div>
        <div className="ds-fu-pb__bar"><i style={{ width: '33%' }} /></div>
        <b>80%</b>
        <span className="ds-fu-pb__cancel">다운로드 취소</span>
      </div>
    )
  }
  return (
    <div className="ds-fu-pb">
      <div className="ds-fu-pb__top">
        <span>[260101WEHAGO.pdf]파일을 다운로드하고 있습니다.(1/5)</span>
        <CloseIcon light />
      </div>
      <div className="ds-fu-pb__row">
        <div className="ds-fu-pb__bar"><i style={{ width: '16%' }} /></div>
        <b>30%</b>
      </div>
    </div>
  )
}

function Cap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ds-fu-cap">
      <span className="ds-if-state__label">{label}</span>
      {children}
    </div>
  )
}

export default function FileUploadPage() {
  return (
    <div className="ds-typography-page ds-if-page">
      <header className="ds-if-head">
        <h1>FileUpload</h1>
        <p>파일을 첨부하고 업로드·다운로드 진행 상태를 확인할 때 사용하는 컴포넌트입니다.</p>
      </header>

      <Section title="Types">
        <div className="ds-panel ds-if-panel ds-fu-white">
          <div className="ds-fu-types">
            <Cap label="FileProgressBar"><Progress /></Cap>
            <Cap label="FileAttachment"><FileList /></Cap>
          </div>
        </div>
      </Section>

      <Section title="Anatomy" description="FileUpload는 파일을 받는 Drop Zone, 첨부 경로를 고르는 Upload Button, 첨부한 파일을 보여주는 File List로 구성됩니다.">
        <div className="ds-panel ds-if-panel ds-fu-white">
          <div className="ds-fu-anatomy">
            <Guide className="ds-fu-a ds-fu-a--drop ds-if-pin ds-if-pin--down">Drop Zone</Guide>
            <Guide className="ds-fu-a ds-fu-a--list ds-if-pin ds-if-pin--down">File List</Guide>
            <Guide className="ds-fu-a ds-fu-a--btn ds-if-pin ds-if-pin--up">Upload Button</Guide>
            <DropZone />
            <FileList readOnly width={250} />
          </div>
        </div>
      </Section>

      <Section title="FileProgressBar" description="파일을 업로드·다운로드할 때 진행률을 표시하는 바입니다.">
        <Block title="Type" description="표시하는 정보의 양에 따라 Default와 Expand 두 가지 유형으로 구분합니다.">
          <div className="ds-fu-stack">
            <Progress />
            <Progress expand />
          </div>
        </Block>
      </Section>

      <Section title="FileAttachment" description="파일을 직접 선택하거나 드래그 앤 드롭으로 첨부하는 영역입니다. 첨부한 파일은 목록으로 확인하고 관리할 수 있습니다.">
        <Block panelClass="ds-fu-white" title="State" description="FileAttachment는 Default, Completed, ReadOnly 상태를 가집니다.">
          <div className="ds-fu-stack ds-fu-stack--states">
            <Cap label="Default"><DropZone /></Cap>
            <Cap label="Completed"><FileList width={330} /></Cap>
            <Cap label="ReadOnly"><FileList readOnly width={330} /></Cap>
          </div>
        </Block>
      </Section>
    </div>
  )
}
