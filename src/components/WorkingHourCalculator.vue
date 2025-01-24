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
      <h3>이미 결재된 사용 예정 연차가 있는 경우 아래에 꼭 입력해 주세요!</h3>
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
        > 오늘 포함하여 계산 (퇴근 찍기 전이면 체크!)
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
      </ul>
      
      <!-- 경고 문구 추가 -->
      <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ⚠️ 본 계산기의 결과는 참고용으로만 사용해 주세요. 혹시 부정확한 계산 결과 발견 시, dohyeon.an@kakao.com으로 연락 부탁드립니다 :)
      </div>
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
      includeToday: true,
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
        '2025-01-27', // 임시공휴일
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
      this.animationKey += 1  // 계산할 때마다 key 값을 증가시킴
      
      // 목표 시간을 분으로 변환
      const targetMinutesTotal = (this.targetHours * 60) + Number(this.targetMinutes)
      
      // 실제 근무한 시간을 분으로 변환
      const workedMinutesTotal = (this.workedHours * 60) + Number(this.workedMinutes)
      
      // 휴가 시간 계산 (8시간 근무 기준)
      const leaveMinutes = (this.halfDayLeave * 240) + (this.quarterDayLeave * 120)
      const leaveDays = (this.fullDayLeave * 1)
      
      // 현재 날짜 설정 (한국 시간)
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        .toLocaleDateString('fr-CA')  // YYYY-MM-DD 형식으로 반환
      
      console.log(today)
      console.log(currentDate)
      
      // 해당 달의 첫째 날과 마지막 날 계산 (한국 시간 기준)
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      // 남은 영업일 계산
      let remainingWorkdays = 0 - leaveDays
      let isCounted = false
      let remainingMinutes = targetMinutesTotal - workedMinutesTotal + leaveMinutes

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

      const actualWorkdays = this.includeToday ? remainingWorkdays : remainingWorkdays - 1

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
  position: relative;  /* 위치 고정 */
  width: 100%;  /* 너비 설정 */
  overflow: hidden;  /* 넘치는 내용 숨김 */
}
</style> 