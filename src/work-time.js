const DEFAULT_WEEKLY_WORK_MINUTES = 40 * 60

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function calculateMonthlyTargetMinutes(year, month, weeklyWorkMinutes = DEFAULT_WEEKLY_WORK_MINUTES) {
  const daysInMonth = getDaysInMonth(year, month)

  return Math.floor((weeklyWorkMinutes / 7) * daysInMonth)
}

function splitMinutesToHours(totalMinutes) {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  }
}

function formatDuration(totalMinutes) {
  const { hours, minutes } = splitMinutesToHours(totalMinutes)

  return `${hours}시간 ${minutes}분`
}

module.exports = {
  DEFAULT_WEEKLY_WORK_MINUTES,
  calculateMonthlyTargetMinutes,
  formatDuration,
  getDaysInMonth,
  splitMinutesToHours,
}
