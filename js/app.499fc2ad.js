(function(){"use strict";var e={4413:function(e,t,a){var n=a(5130),o=a(6768);const l={id:"app"};function r(e,t,a,n,r,u){const i=(0,o.g2)("WorkingHourCalculator");return(0,o.uX)(),(0,o.CE)("div",l,[(0,o.bF)(i)])}const u={class:"calculator-container"},i={class:"input-group"},s={class:"time-input"},c={class:"input-group"},d={class:"time-input"},g={class:"input-group"},v={class:"leave-input"},m={class:"include-today",style:{"margin-bottom":"20px"}},p={key:0,class:"result"},f=["innerHTML"];function h(e,t,a,l,r,h){return(0,o.uX)(),(0,o.CE)("div",u,[t[24]||(t[24]=(0,o.Lk)("h2",null,"포그리트 식구들을 위한 근무시간 계산기",-1)),(0,o.Lk)("div",i,[t[11]||(t[11]=(0,o.Lk)("h3",null,"이번 달 목표 근무시간",-1)),(0,o.Lk)("div",s,[(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[0]||(t[0]=e=>r.targetHours=e),min:"0"},null,512),[[n.Jo,r.targetHours]]),t[9]||(t[9]=(0,o.eW)(" 시간 ")),(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[1]||(t[1]=e=>r.targetMinutes=e),min:"0",max:"59"},null,512),[[n.Jo,r.targetMinutes]]),t[10]||(t[10]=(0,o.eW)(" 분 "))])]),(0,o.Lk)("div",c,[t[14]||(t[14]=(0,o.Lk)("h3",null,"산정 기간 내 누적 근무시간",-1)),(0,o.Lk)("div",d,[(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[2]||(t[2]=e=>r.workedHours=e),min:"0"},null,512),[[n.Jo,r.workedHours]]),t[12]||(t[12]=(0,o.eW)(" 시간 ")),(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[3]||(t[3]=e=>r.workedMinutes=e),min:"0",max:"59"},null,512),[[n.Jo,r.workedMinutes]]),t[13]||(t[13]=(0,o.eW)(" 분 "))])]),(0,o.Lk)("div",g,[t[21]||(t[21]=(0,o.Lk)("h3",null,"누적 근무시간에 이미 포함된 연차 제외하기 (사용 예정인 연차만)",-1)),(0,o.Lk)("div",v,[(0,o.Lk)("div",null,[t[15]||(t[15]=(0,o.Lk)("label",null,"연차:",-1)),(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[4]||(t[4]=e=>r.fullDayLeave=e),min:"0"},null,512),[[n.Jo,r.fullDayLeave]]),t[16]||(t[16]=(0,o.eW)(" 일 "))]),(0,o.Lk)("div",null,[t[17]||(t[17]=(0,o.Lk)("label",null,"반차:",-1)),(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[5]||(t[5]=e=>r.halfDayLeave=e),min:"0"},null,512),[[n.Jo,r.halfDayLeave]]),t[18]||(t[18]=(0,o.eW)(" 회 "))]),(0,o.Lk)("div",null,[t[19]||(t[19]=(0,o.Lk)("label",null,"반반차:",-1)),(0,o.bo)((0,o.Lk)("input",{type:"number","onUpdate:modelValue":t[6]||(t[6]=e=>r.quarterDayLeave=e),min:"0"},null,512),[[n.Jo,r.quarterDayLeave]]),t[20]||(t[20]=(0,o.eW)(" 회 "))])])]),(0,o.Lk)("div",m,[(0,o.Lk)("label",null,[(0,o.bo)((0,o.Lk)("input",{type:"checkbox","onUpdate:modelValue":t[7]||(t[7]=e=>r.includeToday=e)},null,512),[[n.lH,r.includeToday]]),t[22]||(t[22]=(0,o.eW)(" 오늘 포함하여 계산하기 "))])]),(0,o.Lk)("button",{onClick:t[8]||(t[8]=(...e)=>h.calculateRequiredTime&&h.calculateRequiredTime(...e)),class:"calculate-btn"},"계산하기"),r.result?((0,o.uX)(),(0,o.CE)("div",p,[t[23]||(t[23]=(0,o.Lk)("h3",null,"결과",-1)),(0,o.Lk)("p",{innerHTML:r.result},null,8,f)])):(0,o.Q3)("",!0),t[25]||(t[25]=(0,o.Fv)('<hr class="my-8 border-gray-200" data-v-42b1a443><div class="update-history mt-8 p-4 bg-gray-100 rounded-lg" data-v-42b1a443><h3 class="text-lg font-semibold mb-4" data-v-42b1a443>업데이트 기록</h3><ul class="list-disc pl-5 space-y-2" data-v-42b1a443><li data-v-42b1a443>2024.12.26 - 초기 버전 출시</li><li data-v-42b1a443>2024.12.27 - &#39;연차 제외하기&#39; 기능 오류 수정 + 오늘 날짜를 UTC가 아닌 KST 기준으로 수정</li><li data-v-42b1a443>2025.01.08 - 임시 공휴일 지정으로 인한, 공휴일 목록 수정</li></ul><div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800" data-v-42b1a443> ⚠️ 본 계산기의 결과는 참고용으로만 사용해 주세요. 혹시 부정확한 계산 결과 발견 시, dohyeon.an@kakao.com으로 연락 부탁드립니다 :) </div></div>',2))])}a(4114);var y={name:"WorkingHourCalculator",data(){return{targetHours:Number(localStorage.getItem("targetHours"))||0,targetMinutes:Number(localStorage.getItem("targetMinutes"))||0,workedHours:Number(localStorage.getItem("workedHours"))||0,workedMinutes:Number(localStorage.getItem("workedMinutes"))||0,fullDayLeave:Number(localStorage.getItem("fullDayLeave"))||0,halfDayLeave:Number(localStorage.getItem("halfDayLeave"))||0,quarterDayLeave:Number(localStorage.getItem("quarterDayLeave"))||0,includeToday:!0,result:""}},watch:{targetHours(e){localStorage.setItem("targetHours",e)},targetMinutes(e){localStorage.setItem("targetMinutes",e)},workedHours(e){localStorage.setItem("workedHours",e)},workedMinutes(e){localStorage.setItem("workedMinutes",e)},fullDayLeave(e){localStorage.setItem("fullDayLeave",e)},halfDayLeave(e){localStorage.setItem("halfDayLeave",e)},quarterDayLeave(e){localStorage.setItem("quarterDayLeave",e)}},methods:{isHoliday(e){const t=["2024-01-01","2024-02-09","2024-02-10","2024-02-11","2024-02-12","2024-03-01","2024-04-10","2024-05-05","2024-05-06","2024-05-15","2024-06-06","2024-08-15","2024-09-16","2024-09-17","2024-09-18","2024-10-03","2024-10-09","2024-12-25","2025-01-01","2025-01-27","2025-01-28","2025-01-29","2025-01-30","2025-03-03","2025-05-05","2025-05-06","2025-06-06","2025-08-15","2025-10-03","2025-10-06","2025-10-07","2025-10-08","2025-10-09","2025-12-25"];return t.includes(e)},calculateRequiredTime(){const e=60*this.targetHours+Number(this.targetMinutes),t=60*this.workedHours+Number(this.workedMinutes),a=480*this.fullDayLeave+240*this.halfDayLeave+120*this.quarterDayLeave,n=new Date((new Date).toLocaleString("en-US",{timeZone:"Asia/Seoul"})),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()).toLocaleDateString("fr-CA");console.log(n),console.log(o);const l=new Date(n.getFullYear(),n.getMonth(),1),r=new Date(n.getFullYear(),n.getMonth()+1,0);let u=0,i=!1,s=e-t+a;for(let y=l;y<=r;y.setDate(y.getDate()+1)){const e=new Date(y.getTime()+324e5).toISOString().split("T")[0];e===o&&(i=!0),0!==y.getDay()&&6!==y.getDay()&&(!this.isHoliday(e)&&i&&u++,this.isHoliday(e)&&i&&(s-=480))}if(console.log(u),console.log(s),0===u)return void(this.result="이번 달 남은 근무일이 없습니다.");const c=this.includeToday?u:u-1,d=s/c,g=Math.floor(d/60),v=Math.round(d%60),m=[];for(let y=new Date(n);y<=r;y.setDate(y.getDate()+1)){const e=new Date(y.getTime()+324e5).toISOString().split("T")[0];if(this.isHoliday(e)){const t=new Date(e),a=t.getMonth()+1,n=t.getDate();m.push(`${a}월 ${n}일`)}}const p=[];this.fullDayLeave>0&&p.push(`연차 ${this.fullDayLeave}일`),this.halfDayLeave>0&&p.push(`반차 ${this.halfDayLeave}회`),this.quarterDayLeave>0&&p.push(`반반차 ${this.quarterDayLeave}회`);const f=m.length>0?`\n\n이번 달 남은 공휴일: ${m.join(",")}`:"\n\n이번 달 남은 공휴일이 없습니다.",h=this.includeToday?"오늘을 포함하여":"";this.result=`${n.getFullYear()}년 ${n.getMonth()+1}월 목표 달성을 위해 \n${h} 남은 <strong>${c} 근무일</strong> 동안\n매일 <strong>${g}시간 ${v}분</strong>씩 근무해야 합니다.${f}`}}},b=a(1241);const L=(0,b.A)(y,[["render",h],["__scopeId","data-v-42b1a443"]]);var k=L,D={name:"App",components:{WorkingHourCalculator:k}};const w=(0,b.A)(D,[["render",r]]);var H=w;(0,n.Ef)(H).mount("#app")}},t={};function a(n){var o=t[n];if(void 0!==o)return o.exports;var l=t[n]={exports:{}};return e[n].call(l.exports,l,l.exports,a),l.exports}a.m=e,function(){var e=[];a.O=function(t,n,o,l){if(!n){var r=1/0;for(c=0;c<e.length;c++){n=e[c][0],o=e[c][1],l=e[c][2];for(var u=!0,i=0;i<n.length;i++)(!1&l||r>=l)&&Object.keys(a.O).every((function(e){return a.O[e](n[i])}))?n.splice(i--,1):(u=!1,l<r&&(r=l));if(u){e.splice(c--,1);var s=o();void 0!==s&&(t=s)}}return t}l=l||0;for(var c=e.length;c>0&&e[c-1][2]>l;c--)e[c]=e[c-1];e[c]=[n,o,l]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={524:0};a.O.j=function(t){return 0===e[t]};var t=function(t,n){var o,l,r=n[0],u=n[1],i=n[2],s=0;if(r.some((function(t){return 0!==e[t]}))){for(o in u)a.o(u,o)&&(a.m[o]=u[o]);if(i)var c=i(a)}for(t&&t(n);s<r.length;s++)l=r[s],a.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return a.O(c)},n=self["webpackChunkremaining_work_time"]=self["webpackChunkremaining_work_time"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=a.O(void 0,[504],(function(){return a(4413)}));n=a.O(n)})();
//# sourceMappingURL=app.499fc2ad.js.map