const assert = require('assert')

const {
  DEFAULT_HOLIDAYS,
  buildEffectiveHolidays,
  filterHolidaysByMonth,
  formatYearMonth,
  isHolidayDate,
  normalizeHolidayName,
  parseExcludedHolidayDates,
  parseHolidayList,
} = require('../src/holidays')

function testDefaultConstitutionDayIsHoliday() {
  const holidays = filterHolidaysByMonth(DEFAULT_HOLIDAYS, 2026, 7)

  assert.deepStrictEqual(
    holidays.find((holiday) => holiday.date === '2026-07-17'),
    { date: '2026-07-17', name: '제헌절', source: 'default' }
  )
}

function testUserOverridesAddAndExcludeHolidays() {
  const effectiveHolidays = buildEffectiveHolidays(
    DEFAULT_HOLIDAYS,
    [{ date: '2026-07-31', name: '회사 휴무일' }],
    ['2026-07-17']
  )

  assert.strictEqual(isHolidayDate('2026-07-17', effectiveHolidays), false)
  assert.strictEqual(isHolidayDate('2026-07-31', effectiveHolidays), true)
  assert.deepStrictEqual(
    effectiveHolidays.find((holiday) => holiday.date === '2026-07-31'),
    { date: '2026-07-31', name: '회사 휴무일', source: 'custom' }
  )
}

function testStoredHolidayDataIsSanitized() {
  assert.deepStrictEqual(
    parseHolidayList(JSON.stringify([
      { date: '2026-07-31', name: ' 회사 휴무일 ' },
      { date: '2026-7-1', name: '잘못된 날짜' },
      { date: '2026-08-03', name: '' },
    ])),
    [
      { date: '2026-07-31', name: '회사 휴무일', source: 'custom' },
      { date: '2026-08-03', name: '사용자 지정 공휴일', source: 'custom' },
    ]
  )

  assert.deepStrictEqual(
    parseExcludedHolidayDates(JSON.stringify(['2026-07-17', '2026-7-1', 1])),
    ['2026-07-17']
  )
}

function testCurrentMonthLabel() {
  assert.strictEqual(formatYearMonth(2026, 7), '2026년 7월')
  assert.strictEqual(normalizeHolidayName('  '), '사용자 지정 공휴일')
}

testDefaultConstitutionDayIsHoliday()
testUserOverridesAddAndExcludeHolidays()
testStoredHolidayDataIsSanitized()
testCurrentMonthLabel()

console.log('holidays.test.js passed')
