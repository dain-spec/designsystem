import { useState } from 'react'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import { DatePicker } from '../../components/DatePicker/DatePicker'
import { DateRangePicker } from '../../components/DateRangePicker/DateRangePicker'
import type { DateRange } from '../../components/DateRangePicker/DateRangePicker'
import '../foundation/Typography.css'
import './TypeBaseDemo.css'

const DROPDOWN_OPTIONS = [
  { value: '1', label: '옵션 1' },
  { value: '2', label: '옵션 2' },
  { value: '3', label: '옵션 3' },
]

function PageTitle() {
  return (
    <div className="ds-page-title">
      <h1>--Type-Form</h1>
      <p>--Type-Base 컴포넌트를 조합한 입력 폼 패턴입니다.</p>
    </div>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="ds-section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default function TypeFormDemo() {
  const [selected, setSelected] = useState('옵션 1')
  const [date, setDate] = useState<Date | null>(null)
  const [range, setRange] = useState<DateRange>({ start: null, end: null })

  return (
    <div className="ds-typography-page">
      <PageTitle />

      <section className="ds-section">
        <SectionHeading title="Dropdown (DropdownMenu)" description="옵션 클릭 시 실제 목록이 열립니다." />
        <div className="ds-panel tb-demo-row">
          <Dropdown options={DROPDOWN_OPTIONS} value={selected} onSelect={(o) => setSelected(o.label)} />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="DatePicker" description="Type: Default, DefaultButton(취소/확인)" />
        <div className="ds-panel tb-demo-row">
          <DatePicker value={date} onChange={setDate} />
          <DatePicker value={date} onChange={setDate} showFooter onCancel={() => setDate(null)} />
        </div>
      </section>

      <section className="ds-section">
        <SectionHeading title="DateRangePicker" description="달력 2개 + 선택기간 표시" />
        <div className="ds-panel tb-demo-row">
          <DateRangePicker value={range} onChange={setRange} onCancel={() => setRange({ start: null, end: null })} />
        </div>
      </section>
    </div>
  )
}
