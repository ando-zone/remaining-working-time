<template>
  <div class="calculator-container">
    <h2>포그리트 식구들을 위한 근무시간 계산기</h2>
    
    <div class="input-group">
      <h3>이번 달 목표 근무시간</h3>
      <div class="time-input">
        <input type="number" v-model="targetHours" min="0"> 시간
        <input type="number" v-model="targetMinutes" min="0" max="59"> 분
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
      <h3>누적 근무시간에 이미 포함된 연차 제외하기 (사용 예정인 연차만)</h3>
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

    <button @click="calculateRequiredTime" class="calculate-btn">계산하기</button>

    <div v-if="result" class="result">
      <h3>결과</h3>
      <p v-html="result"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkingHourCalculator',
  data() {
    return {
      targetHours: Number(localStorage.getItem('targetHours')) || 0,
      targetMinutes: Number(localStorage.getItem('targetMinutes')) || 0,
      workedHours: Number(localStorage.getItem('workedHours')) || 0,
      workedMinutes: Number(localStorage.getItem('workedMinutes')) || 0,
      fullDayLeave: Number(localStorage.getItem('fullDayLeave')) || 0,
      halfDayLeave: Number(localStorage.getItem('halfDayLeave')) || 0,
      quarterDayLeave: Number(localStorage.getItem('quarterDayLeave')) || 0,
      result: '',
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
      // 2024년 공휴일 목록
      const holidays = [
        '2024-01-01', // 신정
        '2024-02-09', // 설날
        '2024-02-10', // 설날
        '2024-02-11', // 설날
        '2024-02-12', // 대체공휴일
        '2024-03-01', // 삼일절
        '2024-04-10', // 국회의원선거
        '2024-05-05', // 어린이날
        '2024-05-06', // 대체공휴일
        '2024-05-15', // 부처님오신날
        '2024-06-06', // 현충일
        '2024-08-15', // 광복절
        '2024-09-16', // 추석
        '2024-09-17', // 추석
        '2024-09-18', // 추석
        '2024-10-03', // 개천절
        '2024-10-09', // 한글날
        '2024-12-25', // 성탄절
        '2025-01-01', // 신정
        '2025-01-28', // 설날
        '2025-01-29', // 설날
        '2025-01-30', // 설날
        '2025-03-03', // 대체휴일
        '2025-05-05', // 어린이날
        '2025-05-06', // 대체휴일
        '2025-06-06', // 현충일
        '2025-08-15', // 광복절
        '2025-10-03', // 개천절
        '2025-10-06', // 추석
        '2025-10-07', // 추석
        '2025-10-08', // 추석
        '2025-10-09', // 한글날
        '2025-12-25', // 성탄절
      ]
      return holidays.includes(dateStr)
    },

    calculateRequiredTime() {
      // 목표 시간을 분으로 변환
      const targetMinutesTotal = (this.targetHours * 60) + Number(this.targetMinutes)
      
      // 실제 근무한 시간을 분으로 변환
      const workedMinutesTotal = (this.workedHours * 60) + Number(this.workedMinutes)
      
      // 휴가 시간 계산 (8시간 근무 기준)
      const leaveMinutes = (this.fullDayLeave * 480) + (this.halfDayLeave * 240) + (this.quarterDayLeave * 120)
      
      // 현재 날짜 설정 (한국 시간)
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      const currentDate = today.toISOString().split('T')[0]
      
      // 해당 달의 첫째 날과 마지막 날 계산 (한국 시간 기준)
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      // 남은 영업일 계산
      let remainingWorkdays = 0
      let isCounted = false
      let remainingMinutes = targetMinutesTotal - workedMinutesTotal - leaveMinutes

      for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateStr = new Date(d.getTime() + (9 * 60 * 60 * 1000))
          .toISOString()
          .split('T')[0]
        
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
      
      console.log(remainingWorkdays)
      console.log(remainingMinutes)

      if (remainingWorkdays === 0) {
        this.result = '이번 달 남은 영업일이 없습니다.'
        return
      }

      // 하루 평균 근무해야 할 시간 계산
      const minutesPerDay = remainingMinutes / remainingWorkdays
      const hoursPerDay = Math.floor(minutesPerDay / 60)
      const minutesRemainder = Math.round(minutesPerDay % 60)

      // 남은 공휴일 찾기
      const remainingHolidays = []
      for (let d = new Date(today); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateStr = new Date(d.getTime() + (9 * 60 * 60 * 1000))
          .toISOString()
          .split('T')[0]
        if (this.isHoliday(dateStr)) {
          const holidayDate = new Date(dateStr)
          const month = holidayDate.getMonth() + 1
          const day = holidayDate.getDate()
          remainingHolidays.push(`${month}월 ${day}일`)
        }
      }

      // 연차 정보 문자열 생성
      const leaveInfo = []
      if (this.fullDayLeave > 0) leaveInfo.push(`연차 ${this.fullDayLeave}일`)
      if (this.halfDayLeave > 0) leaveInfo.push(`반차 ${this.halfDayLeave}회`)
      if (this.quarterDayLeave > 0) leaveInfo.push(`반반차 ${this.quarterDayLeave}회`)
      
      const holidayText = remainingHolidays.length > 0 
        ? `\n\n이번 달 남은 공휴일: ${remainingHolidays.join(',')}`
        : `\n\n이번 달 남은 공휴일이 없습니다.`

      this.result = `${today.getFullYear()}년 ${today.getMonth() + 1}월 목표 달성을 위해 \n오늘을 포함하여 남은 <strong>${remainingWorkdays} 근무일</strong> 동안\n매일 <strong>${hoursPerDay}시간 ${minutesRemainder}분</strong>씩 근무해야 합니다.${holidayText}`
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

.input-group {
  margin-bottom: 20px;
}

.time-input {
  display: flex;
  gap: 10px;
  align-items: center;
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
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.calculate-btn:hover {
  background-color: #45a049;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  white-space: pre-line;
}
</style> 