const DEFAULT_HOLIDAYS = [
  { date: '2024-01-01', name: '신정', source: 'default' },
  { date: '2024-02-09', name: '설날', source: 'default' },
  { date: '2024-02-10', name: '설날', source: 'default' },
  { date: '2024-02-11', name: '설날', source: 'default' },
  { date: '2024-02-12', name: '대체공휴일', source: 'default' },
  { date: '2024-03-01', name: '삼일절', source: 'default' },
  { date: '2024-04-10', name: '국회의원선거', source: 'default' },
  { date: '2024-05-05', name: '어린이날', source: 'default' },
  { date: '2024-05-06', name: '대체공휴일', source: 'default' },
  { date: '2024-05-15', name: '부처님오신날', source: 'default' },
  { date: '2024-06-06', name: '현충일', source: 'default' },
  { date: '2024-08-15', name: '광복절', source: 'default' },
  { date: '2024-09-16', name: '추석', source: 'default' },
  { date: '2024-09-17', name: '추석', source: 'default' },
  { date: '2024-09-18', name: '추석', source: 'default' },
  { date: '2024-10-03', name: '개천절', source: 'default' },
  { date: '2024-10-09', name: '한글날', source: 'default' },
  { date: '2024-12-25', name: '성탄절', source: 'default' },
  { date: '2025-01-01', name: '신정', source: 'default' },
  { date: '2025-01-27', name: '임시공휴일', source: 'default' },
  { date: '2025-01-28', name: '설날', source: 'default' },
  { date: '2025-01-29', name: '설날', source: 'default' },
  { date: '2025-01-30', name: '설날', source: 'default' },
  { date: '2025-03-03', name: '대체휴일', source: 'default' },
  { date: '2025-05-05', name: '어린이날/부처님오신날', source: 'default' },
  { date: '2025-05-06', name: '대체휴일', source: 'default' },
  { date: '2025-06-06', name: '현충일', source: 'default' },
  { date: '2025-08-15', name: '광복절', source: 'default' },
  { date: '2025-10-03', name: '개천절', source: 'default' },
  { date: '2025-10-06', name: '추석', source: 'default' },
  { date: '2025-10-07', name: '추석', source: 'default' },
  { date: '2025-10-08', name: '추석 대체공휴일', source: 'default' },
  { date: '2025-10-09', name: '한글날', source: 'default' },
  { date: '2025-12-25', name: '성탄절', source: 'default' },
  { date: '2026-01-01', name: '신정', source: 'default' },
  { date: '2026-02-16', name: '설날', source: 'default' },
  { date: '2026-02-17', name: '설날', source: 'default' },
  { date: '2026-02-18', name: '설날', source: 'default' },
  { date: '2026-03-01', name: '삼일절', source: 'default' },
  { date: '2026-03-02', name: '대체공휴일', source: 'default' },
  { date: '2026-05-01', name: '노동절', source: 'default' },
  { date: '2026-05-05', name: '어린이날', source: 'default' },
  { date: '2026-05-24', name: '부처님오신날', source: 'default' },
  { date: '2026-05-25', name: '대체공휴일', source: 'default' },
  { date: '2026-06-03', name: '전국동시지방선거', source: 'default' },
  { date: '2026-06-06', name: '현충일', source: 'default' },
  { date: '2026-07-17', name: '제헌절', source: 'default' },
  { date: '2026-08-15', name: '광복절', source: 'default' },
  { date: '2026-08-17', name: '대체공휴일', source: 'default' },
  { date: '2026-09-24', name: '추석', source: 'default' },
  { date: '2026-09-25', name: '추석', source: 'default' },
  { date: '2026-09-26', name: '추석', source: 'default' },
  { date: '2026-10-03', name: '개천절', source: 'default' },
  { date: '2026-10-05', name: '대체공휴일', source: 'default' },
  { date: '2026-10-09', name: '한글날', source: 'default' },
  { date: '2026-12-25', name: '성탄절', source: 'default' },
]

function isDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function normalizeHolidayName(name) {
  const normalizedName = String(name || '').trim()
  return normalizedName || '사용자 지정 공휴일'
}

function normalizeHoliday(holiday, source) {
  if (!holiday || !isDateString(holiday.date)) {
    return null
  }

  return {
    date: holiday.date,
    name: normalizeHolidayName(holiday.name),
    source,
  }
}

function parseHolidayList(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || '[]')
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((holiday) => normalizeHoliday(holiday, 'custom'))
      .filter(Boolean)
      .sort(compareHolidayDate)
  } catch (error) {
    return []
  }
}

function parseExcludedHolidayDates(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || '[]')
    if (!Array.isArray(parsed)) {
      return []
    }

    return Array.from(new Set(parsed.filter(isDateString))).sort()
  } catch (error) {
    return []
  }
}

function compareHolidayDate(left, right) {
  return left.date.localeCompare(right.date)
}

function buildEffectiveHolidays(defaultHolidays, customHolidays, excludedDates) {
  const holidayMap = new Map()

  defaultHolidays
    .map((holiday) => normalizeHoliday(holiday, 'default'))
    .filter(Boolean)
    .forEach((holiday) => {
      holidayMap.set(holiday.date, holiday)
    })

  customHolidays
    .map((holiday) => normalizeHoliday(holiday, 'custom'))
    .filter(Boolean)
    .forEach((holiday) => {
      holidayMap.set(holiday.date, holiday)
    })

  excludedDates.forEach((date) => {
    holidayMap.delete(date)
  })

  return Array.from(holidayMap.values()).sort(compareHolidayDate)
}

function isHolidayDate(dateStr, holidays) {
  return holidays.some((holiday) => holiday.date === dateStr)
}

function findHoliday(dateStr, holidays) {
  return holidays.find((holiday) => holiday.date === dateStr) || null
}

function filterHolidaysByMonth(holidays, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return holidays.filter((holiday) => holiday.date.startsWith(prefix))
}

function formatYearMonth(year, month) {
  return `${year}년 ${month}월`
}

module.exports = {
  DEFAULT_HOLIDAYS,
  buildEffectiveHolidays,
  filterHolidaysByMonth,
  findHoliday,
  formatYearMonth,
  isHolidayDate,
  normalizeHolidayName,
  parseExcludedHolidayDates,
  parseHolidayList,
}
