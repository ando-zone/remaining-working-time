<template>
  <div class="calculator-container">
    <div class="header-section">
      <h2>포그리트 식구들을 위한 근무시간 계산기</h2>
    </div>

    <!-- 이번 달 공휴일 미리보기 -->
    <div class="holiday-preview">
      <div class="holiday-panel-header">
        <h4>📅 이번 달 공휴일 현황</h4>
        <span>{{ currentMonthName }} 기준</span>
      </div>
      <div v-if="currentMonthHolidays.length > 0" class="holiday-list">
        <span
          v-for="holiday in currentMonthHolidays"
          :key="holiday.date"
          class="holiday-tag"
          :class="{ 'custom-holiday': holiday.source === 'custom' }"
        >
          {{ holiday.displayDate }} ({{ holiday.name }})
          <button
            type="button"
            class="holiday-remove-btn"
            :aria-label="`${holiday.displayDate} ${holiday.name} 제외`"
            @click="removeHoliday(holiday)"
          >
            ×
          </button>
        </span>
      </div>
      <div v-else class="no-holiday">
        이번 달에는 공휴일이 없습니다.
      </div>

      <form class="holiday-form" @submit.prevent="addCustomHoliday">
        <input
          type="date"
          v-model="customHolidayDate"
          :min="currentMonthStart"
          :max="currentMonthEnd"
        >
        <input
          type="text"
          v-model="customHolidayName"
          placeholder="공휴일 이름"
        >
        <button type="submit">추가</button>
      </form>

      <div v-if="currentMonthExcludedHolidays.length > 0" class="excluded-holidays">
        <span
          v-for="holiday in currentMonthExcludedHolidays"
          :key="holiday.date"
          class="excluded-holiday"
        >
          {{ formatHolidayDisplay(holiday.date) }} 제외됨
          <button type="button" @click="restoreHoliday(holiday.date)">복원</button>
        </span>
      </div>

      <p class="holiday-source">
        기본 공휴일은 앱에 내장된 2024~2026년 데이터 기준입니다.
      </p>
      <p class="holiday-report">
        ※ 공휴일 현황이 실제와 다르면 위에서 직접 추가하거나 제외해 주세요.
      </p>
    </div>
    
    <div class="input-group">
      <h3>이번 달 목표 근무시간</h3>
      <div class="time-input">
        <input type="number" v-model="targetHours" min="0" @input="markManualTargetTime"> 시간
        <input type="number" v-model="targetMinutes" min="0" max="59" @input="markManualTargetTime"> 분
      </div>
      <div class="target-helper">
        <span>
          자동 계산값: {{ autoTargetTimeLabel }}
          <small>(주 40시간 ÷ 7일 × {{ currentMonthDays }}일)</small>
        </span>
        <button type="button" @click="applyAutoTargetTime">자동값 입력</button>
      </div>
    </div>

    <div class="input-group">
      <h3>산정 기간 내 누적 근무시간</h3>
      <div class="time-input">
        <input type="number" v-model="workedHours" min="0"> 시간
        <input type="number" v-model="workedMinutes" min="0" max="59"> 분
      </div>
    </div>

    <div class="input-group">
      <h3><span class="highlight-red">이미 결재된</span> 사용 예정 연차가 있는 경우 아래에 꼭 입력해 주세요!</h3>
      <div class="leave-input">
        <div>
          <label>연차:</label>
          <input type="number" v-model="fullDayLeave" min="0"> 일
        </div>
        <div>
          <label>반차:</label>
          <input type="number" v-model="halfDayLeave" min="0"> 회
        </div>
        <div>
          <label>반반차:</label>
          <input type="number" v-model="quarterDayLeave" min="0"> 회
        </div>
      </div>
    </div>
    <div class="include-today" style="margin-bottom: 20px">
      <label>
        <input 
          type="checkbox" 
          v-model="includeToday"
        > 남은 근무일에 오늘 포함하기 (퇴근 찍기 전이면 체크!)
      </label>
    </div>

    <button @click="calculateRequiredTime" class="calculate-btn">계산하기</button>

    <Transition name="flash">
      <div v-if="result" :key="animationKey" class="result">
        <h3>결과</h3>
        <p v-html="result"></p>
      </div>
    </Transition>

    <!-- 구분선 추가 -->
    <hr class="my-8 border-gray-200">
    
    <!-- 업데이트 기록 섹션 -->
    <div class="update-history mt-8 p-4 bg-gray-100 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">업데이트 기록</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>2024.12.26 - 초기 버전 출시</li>
        <li>2024.12.27 - '연차 제외하기' 기능 오류 수정 + 오늘 날짜를 UTC가 아닌 KST 기준으로 수정</li>
        <li>2025.01.08 - 임시 공휴일 지정으로 인한, 공휴일 목록 수정</li>
        <li>2025.01.24 - 안내 문구 변경/ 연차,반차,반반차 계산 방식 변경/ 근무 목표 달성 조건 보완/ 결과창 깜빡임 애니메이션 추가</li>
        <li>2025.12.20 - 이번 달 공휴일 미리보기 추가/ 공휴일 데이터 외부 라이브러리 연동(2026년까지 지원)/ 주말·공휴일에 '오늘 포함하기' 체크 해제 시 버그 수정/ 방문자 수 기능 제거</li>
        <li>2026.07.01 - 외부 공휴일 라이브러리 제거/ 기본 공휴일 내장/ 공휴일 직접 추가·제외 기능 추가</li>
        <li>2026.07.01 - 월 목표 근무시간 자동 계산 및 수동 수정 기능 추가</li>
      </ul>
      
      <!-- 경고 문구 추가 -->
      <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ⚠️ 본 계산기의 결과는 참고용으로만 사용해 주세요. 혹시 부정확한 계산 결과 발견 시, dohyeon.an@kakao.com으로 연락 부탁드립니다 :)
      </div>
    </div>
  </div>
</template>

<script>
import holidayUtils from '../holidays.js'
import workTimeUtils from '../work-time.js'

const {
  DEFAULT_HOLIDAYS,
  buildEffectiveHolidays,
  filterHolidaysByMonth,
  findHoliday,
  formatYearMonth,
  isHolidayDate,
  normalizeHolidayName,
  parseExcludedHolidayDates,
  parseHolidayList,
} = holidayUtils

const {
  calculateMonthlyTargetMinutes,
  formatDuration,
  getDaysInMonth,
  splitMinutesToHours,
} = workTimeUtils

const CUSTOM_HOLIDAYS_KEY = 'customHolidays'
const EXCLUDED_HOLIDAYS_KEY = 'excludedHolidays'
const TARGET_TIME_MODE_KEY = 'targetTimeMode'

function getKstToday() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default {
  name: 'WorkingHourCalculator',
  data() {
    const today = getKstToday()
    const targetTimeMode = localStorage.getItem(TARGET_TIME_MODE_KEY) || 'auto'
    const autoTargetMinutes = calculateMonthlyTargetMinutes(
      today.getFullYear(),
      today.getMonth() + 1
    )
    const autoTargetTime = splitMinutesToHours(autoTargetMinutes)
    const storedTargetHours = Number(localStorage.getItem('targetHours')) || 0
    const storedTargetMinutes = Number(localStorage.getItem('targetMinutes')) || 0

    return {
      targetHours: targetTimeMode === 'manual' ? storedTargetHours : autoTargetTime.hours,
      targetMinutes: targetTimeMode === 'manual' ? storedTargetMinutes : autoTargetTime.minutes,
      workedHours: Number(localStorage.getItem('workedHours')) || 0,
      workedMinutes: Number(localStorage.getItem('workedMinutes')) || 0,
      fullDayLeave: Number(localStorage.getItem('fullDayLeave')) || 0,
      halfDayLeave: Number(localStorage.getItem('halfDayLeave')) || 0,
      quarterDayLeave: Number(localStorage.getItem('quarterDayLeave')) || 0,
      includeToday: true,
      result: '',
      animationKey: 0,
      customHolidays: parseHolidayList(localStorage.getItem(CUSTOM_HOLIDAYS_KEY)),
      excludedHolidayDates: parseExcludedHolidayDates(localStorage.getItem(EXCLUDED_HOLIDAYS_KEY)),
      customHolidayDate: formatDate(today),
      customHolidayName: '',
      targetTimeMode,
    }
  },
  computed: {
    currentYear() {
      return getKstToday().getFullYear()
    },
    currentMonth() {
      return getKstToday().getMonth() + 1
    },
    currentMonthDays() {
      return getDaysInMonth(this.currentYear, this.currentMonth)
    },
    currentMonthName() {
      return formatYearMonth(this.currentYear, this.currentMonth)
    },
    currentMonthStart() {
      return `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-01`
    },
    currentMonthEnd() {
      return formatDate(new Date(this.currentYear, this.currentMonth, 0))
    },
    effectiveHolidays() {
      return buildEffectiveHolidays(
        DEFAULT_HOLIDAYS,
        this.customHolidays,
        this.excludedHolidayDates
      )
    },
    currentMonthHolidays() {
      return filterHolidaysByMonth(this.effectiveHolidays, this.currentYear, this.currentMonth)
        .map((holiday) => ({
          ...holiday,
          displayDate: this.formatHolidayDisplay(holiday.date),
        }))
    },
    currentMonthExcludedHolidays() {
      return filterHolidaysByMonth(DEFAULT_HOLIDAYS, this.currentYear, this.currentMonth)
        .filter((holiday) => this.excludedHolidayDates.includes(holiday.date))
    },
    autoTargetMinutes() {
      return calculateMonthlyTargetMinutes(this.currentYear, this.currentMonth)
    },
    autoTargetTimeLabel() {
      return formatDuration(this.autoTargetMinutes)
    }
  },
  watch: {
    // 각 입력값이 변경될 때마다 localStorage에 저장
    targetHours(newVal) {
      localStorage.setItem('targetHours', newVal)
    },
    targetMinutes(newVal) {
      localStorage.setItem('targetMinutes', newVal)
    },
    workedHours(newVal) {
      localStorage.setItem('workedHours', newVal)
    },
    workedMinutes(newVal) {
      localStorage.setItem('workedMinutes', newVal)
    },
    fullDayLeave(newVal) {
      localStorage.setItem('fullDayLeave', newVal)
    },
    halfDayLeave(newVal) {
      localStorage.setItem('halfDayLeave', newVal)
    },
    quarterDayLeave(newVal) {
      localStorage.setItem('quarterDayLeave', newVal)
    }
  },
  methods: {
    isHoliday(dateStr) {
      return isHolidayDate(dateStr, this.effectiveHolidays)
    },

    findHolidayName(dateStr) {
      const holiday = findHoliday(dateStr, this.effectiveHolidays)

      return holiday ? holiday.name : ''
    },

    formatHolidayDisplay(dateStr) {
      const [, month, day] = dateStr.split('-')

      return `${Number(month)}월 ${Number(day)}일`
    },

    applyAutoTargetTime() {
      const { hours, minutes } = splitMinutesToHours(this.autoTargetMinutes)

      this.targetTimeMode = 'auto'
      localStorage.setItem(TARGET_TIME_MODE_KEY, this.targetTimeMode)
      this.targetHours = hours
      this.targetMinutes = minutes
    },

    markManualTargetTime() {
      this.targetTimeMode = 'manual'
      localStorage.setItem(TARGET_TIME_MODE_KEY, this.targetTimeMode)
    },

    saveHolidayOverrides() {
      localStorage.setItem(CUSTOM_HOLIDAYS_KEY, JSON.stringify(this.customHolidays))
      localStorage.setItem(EXCLUDED_HOLIDAYS_KEY, JSON.stringify(this.excludedHolidayDates))
    },

    addCustomHoliday() {
      const holiday = {
        date: this.customHolidayDate,
        name: normalizeHolidayName(this.customHolidayName),
        source: 'custom',
      }

      this.customHolidays = [
        ...this.customHolidays.filter((item) => item.date !== holiday.date),
        holiday,
      ].sort((left, right) => left.date.localeCompare(right.date))

      this.excludedHolidayDates = this.excludedHolidayDates
        .filter((date) => date !== holiday.date)

      this.customHolidayName = ''
      this.saveHolidayOverrides()
    },

    removeHoliday(holiday) {
      if (holiday.source === 'custom') {
        this.customHolidays = this.customHolidays
          .filter((item) => item.date !== holiday.date)
      } else if (!this.excludedHolidayDates.includes(holiday.date)) {
        this.excludedHolidayDates = [...this.excludedHolidayDates, holiday.date].sort()
      }

      this.saveHolidayOverrides()
    },

    restoreHoliday(dateStr) {
      this.excludedHolidayDates = this.excludedHolidayDates
        .filter((date) => date !== dateStr)
      this.saveHolidayOverrides()
    },

    calculateRequiredTime() {
      this.animationKey += 1  // 계산할 때마다 key 값을 증가시킴
      
      // 목표 시간을 분으로 변환
      const targetMinutesTotal = (this.targetHours * 60) + Number(this.targetMinutes)
      
      // 실제 근무한 시간을 분으로 변환
      const workedMinutesTotal = (this.workedHours * 60) + Number(this.workedMinutes)
      
      // 휴가 시간 계산 (8시간 근무 기준)
      const leaveMinutes = (this.halfDayLeave * 240) + (this.quarterDayLeave * 120)
      const leaveDays = (this.fullDayLeave * 1)
      
      // 현재 날짜 설정 (한국 시간)
      const today = getKstToday()
      const currentDate = formatDate(today)
      
      // 해당 달의 첫째 날과 마지막 날 계산 (한국 시간 기준)
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      // 남은 영업일 계산
      let remainingWorkdays = 0 - leaveDays
      let isCounted = false
      let remainingMinutes = targetMinutesTotal - workedMinutesTotal + leaveMinutes

      for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d)
        
        // 현재 날짜부터 카운트 시작
        if (dateStr === currentDate) {
          isCounted = true
        }
        
        // 평일인 경우
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          if (!this.isHoliday(dateStr) && isCounted) {
            // 공휴일이 아니고 현재 날짜 이후인 경우에만 카운트
            remainingWorkdays++
          }
          
          if (this.isHoliday(dateStr) && isCounted) {
            // 공휴일인 경우 필요 근무시간에서 하루치(480분) 차감
            remainingMinutes -= 480
          }
        }
      }
      
      // 오늘이 근무일인지 확인 (평일이고 공휴일이 아닌 경우)
      const isTodayWorkday = today.getDay() !== 0 && today.getDay() !== 6 && !this.isHoliday(currentDate)

      // 오늘이 근무일일 때만 체크박스 적용
      const actualWorkdays = (this.includeToday || !isTodayWorkday) ? remainingWorkdays : remainingWorkdays - 1

      if (actualWorkdays <= 0 || remainingMinutes <= 0) {
        let message = ''
        if (remainingMinutes <= 0) {
          message = '🎉 목표를 이미 달성하셨습니다!'
        } else {
          const remainingHours = Math.floor(remainingMinutes / 60)
          const remainingMins = Math.round(remainingMinutes % 60)
          message = `❌ 남은 근무일이 없어 목표 달성이 불가능합니다.\n(부족한 근무 시간: ${remainingHours}시간 ${remainingMins}분)`
        }
        this.result = ''
        setTimeout(() => {
          this.result = message
        }, 0)
        return
      }

      // 하루 평균 근무해야 할 시간 계산
      const minutesPerDay = remainingMinutes / actualWorkdays
      const hoursPerDay = Math.floor(minutesPerDay / 60)
      const minutesRemainder = Math.round(minutesPerDay % 60)

      // 남은 공휴일 찾기
      const remainingHolidays = []
      for (let d = new Date(today); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d)
        if (this.isHoliday(dateStr)) {
          const holidayName = this.findHolidayName(dateStr)
          const suffix = holidayName ? ` (${holidayName})` : ''
          remainingHolidays.push(`${this.formatHolidayDisplay(dateStr)}${suffix}`)
        }
      }

      const holidayText = remainingHolidays.length > 0 
        ? `\n\n이번 달 남은 공휴일: ${remainingHolidays.join(',')}`
        : `\n\n이번 달 남은 공휴일이 없습니다.`

      const includeTodayText = this.includeToday ? '오늘을 포함하여' : ''

      const resultMessage = `${today.getFullYear()}년 ${today.getMonth() + 1}월 목표 달성을 위해 \n${includeTodayText} 남은 <strong>${actualWorkdays} 근무일</strong> 동안\n매일 <strong>${hoursPerDay}시간 ${minutesRemainder}분</strong>씩 근무해야 합니다.${holidayText}`
      
      this.result = ''  // 결과를 잠시 비웠다가
      setTimeout(() => {  // 다음 틱에 다시 설정
        this.result = resultMessage
      }, 0)
    }
  }
}
</script>

<style scoped>
.calculator-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 20px;
}

.holiday-preview {
  background-color: #f0f7ff;
  border: 1px solid #b3d4fc;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 25px;
}

.holiday-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.holiday-panel-header h4 {
  margin: 0;
  color: #1565c0;
  font-size: 15px;
}

.holiday-panel-header span {
  color: #4f6f8f;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.holiday-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.holiday-tag {
  background-color: #fff;
  border: 1px solid #90caf9;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 13px;
  color: #1976d2;
}

.custom-holiday {
  border-color: #66bb6a;
  color: #2e7d32;
}

.holiday-remove-btn {
  margin-left: 6px;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.no-holiday {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.holiday-form {
  display: grid;
  grid-template-columns: 140px 1fr 54px;
  gap: 8px;
  margin-bottom: 10px;
}

.holiday-form input {
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid #b3d4fc;
  border-radius: 4px;
  font-size: 13px;
}

.holiday-form button,
.excluded-holiday button {
  border: 1px solid #90caf9;
  border-radius: 4px;
  background-color: #fff;
  color: #1565c0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.excluded-holidays {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.excluded-holiday {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px dashed #b0bec5;
  border-radius: 4px;
  color: #607d8b;
  font-size: 12px;
}

.holiday-source {
  margin: 0 0 6px 0;
  font-size: 11px;
  color: #888;
}

.holiday-source a {
  color: #1976d2;
  text-decoration: none;
}

.holiday-source a:hover {
  text-decoration: underline;
}

.holiday-report {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.holiday-report a {
  color: #1976d2;
  text-decoration: underline;
}

.highlight-red {
  color: #e53935;
  font-weight: bold;
}

.input-group {
  margin-bottom: 20px;
}

.time-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.target-helper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
  color: #555;
  font-size: 13px;
}

.target-helper span {
  min-width: 0;
}

.target-helper small {
  color: #777;
}

.target-helper button {
  flex: 0 0 auto;
  border: 1px solid #c8d6c8;
  border-radius: 4px;
  background-color: #fff;
  color: #2e7d32;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 8px;
}

.leave-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leave-input div {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.leave-input label {
  min-width: 60px;
  font-weight: bold;
}

input[type="number"] {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.calculate-btn {
  width: 100%;
  background: linear-gradient(135deg, #4CAF50 0%, #43a047 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
}

.calculate-btn:hover {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
}

.calculate-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.flash-enter-active {
  animation: flash 1s;
  position: relative;  /* 위치 고정 */
}

.flash-enter-from,
.flash-leave-to {
  position: absolute;  /* 이전 요소를 문서 흐름에서 제거 */
  opacity: 0;
  width: 100%;
  pointer-events: none;
}

.flash-leave-active {
  display: none;  /* 떠나는 요소 완전히 숨김 */
}

@keyframes flash {
  0% {
    opacity: 0.5;
    background-color: #e9ecef;
  }
  100% {
    opacity: 1;
    background-color: #f8f9fa;
  }
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  white-space: pre-line;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
