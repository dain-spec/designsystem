const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export type CalendarDay = { date: Date; inMonth: boolean }

export function getMonthMatrix(year: number, month: number): CalendarDay[][] {
  const first = new Date(year, month, 1)
  const cursor = new Date(year, month, 1 - first.getDay())
  const weeks: CalendarDay[][] = []
  for (let w = 0; w < 6; w++) {
    const week: CalendarDay[] = []
    for (let d = 0; d < 7; d++) {
      week.push({ date: new Date(cursor), inMonth: cursor.getMonth() === month })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export function isSameDay(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

type CalendarProps = {
  year: number
  month: number
  selected?: Date | null
  rangeStart?: Date | null
  rangeEnd?: Date | null
  onSelectDate: (date: Date) => void
}

export function Calendar({ year, month, selected, rangeStart, rangeEnd, onSelectDate }: CalendarProps) {
  const weeks = getMonthMatrix(year, month)
  const today = new Date()

  return (
    <div className="cal">
      <div className="cal__row cal__row--weekday">
        {WEEKDAYS.map((label) => (
          <span key={label} className="cal__weekday">
            {label}
          </span>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="cal__row">
          {week.map(({ date, inMonth }) => {
            const isSunday = date.getDay() === 0
            const isSelected = isSameDay(date, selected) || isSameDay(date, rangeStart) || isSameDay(date, rangeEnd)
            const isInRange =
              !isSelected && rangeStart && rangeEnd ? date > rangeStart && date < rangeEnd : false
            const isToday = !isSelected && isSameDay(date, today)

            const classes = [
              'cal__day',
              !inMonth && 'cal__day--muted',
              isSunday && 'cal__day--sunday',
              isToday && 'cal__day--today',
              isSelected && 'cal__day--selected',
              isInRange && 'cal__day--inrange',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={classes}
                onClick={() => onSelectDate(date)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Calendar
