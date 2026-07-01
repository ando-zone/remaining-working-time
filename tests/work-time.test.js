const assert = require('assert')

const {
  calculateMonthlyTargetMinutes,
  formatDuration,
  splitMinutesToHours,
} = require('../src/work-time')

function testMonthlyTargetUsesCalendarDays() {
  assert.strictEqual(calculateMonthlyTargetMinutes(2026, 7), 10628)
  assert.deepStrictEqual(splitMinutesToHours(10628), { hours: 177, minutes: 8 })
  assert.strictEqual(formatDuration(10628), '177시간 8분')
}

function testMonthlyTargetSupportsOtherMonthLengths() {
  assert.strictEqual(calculateMonthlyTargetMinutes(2026, 2), 9600)
  assert.strictEqual(formatDuration(calculateMonthlyTargetMinutes(2026, 2)), '160시간 0분')
  assert.strictEqual(formatDuration(calculateMonthlyTargetMinutes(2026, 6)), '171시간 25분')
}

function testMonthlyTargetCanUseDifferentWeeklyMinutes() {
  assert.strictEqual(calculateMonthlyTargetMinutes(2026, 7, 2100), 9300)
  assert.strictEqual(formatDuration(9300), '155시간 0분')
}

testMonthlyTargetUsesCalendarDays()
testMonthlyTargetSupportsOtherMonthLengths()
testMonthlyTargetCanUseDifferentWeeklyMinutes()

console.log('work-time.test.js passed')
