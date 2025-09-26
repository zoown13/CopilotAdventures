/**
 * Tempora Clock Synchronization System
 * 템포라 마을의 모든 시계를 대형 시계탑 기준으로 동기화합니다.
 *
 * Copilot 프롬프트 예시:
 * "템포라 마을의 시계 시간 차이를 계산하는 함수를 만들어줘"
 */

const grandClockTime = "15:00"; // 대형 시계탑 시간
const villageClocks = ["14:45", "15:05", "15:00", "14:40"];

// 각 시계의 ASCII 아트
const clockAsciiArt = [
  `   _____\n  /     \\\n | 14:45 |
  \_____/
`,
  `   _____\n  /     \\\n | 15:05 |
  \_____/
`,
  `   _____\n  /     \\\n | 15:00 |
  \_____/
`,
  `   _____\n  /     \\\n | 14:40 |
  \_____/
`
];

/**
 * 시간 문자열(HH:MM)을 분 단위로 변환
 * @param {string} timeStr - "HH:MM" 형식의 시간 문자열
 * @returns {number} - 총 분(minute)
 * @throws {Error} - 잘못된 형식일 경우
 */
function timeToMinutes(timeStr) {
  const match = /^([0-9]{1,2}):([0-9]{2})$/.exec(timeStr);
  if (!match) throw new Error(`잘못된 시간 형식: ${timeStr}`);
  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`시간 범위 오류: ${timeStr}`);
  }
  return hour * 60 + minute;
}

/**
 * 각 시계의 시간 차이(분)를 계산
 * @param {string[]} clocks - 마을 시계 시간 배열
 * @param {string} reference - 기준 시계탑 시간
 * @returns {number[]} - 각 시계의 시간 차이(분)
 */
function calculateDifferences(clocks, reference) {
  const refMinutes = timeToMinutes(reference);
  return clocks.map(clock => {
    try {
      const clockMinutes = timeToMinutes(clock);
      return clockMinutes - refMinutes;
    } catch (err) {
      console.error(`오류: ${err.message}`);
      return null;
    }
  });
}

/**
 * 결과를 명확하게 출력
 * @param {string[]} clocks
 * @param {number[]} diffs
 * @param {string[]} asciiArts
 */
function printResults(clocks, diffs, asciiArts) {
  console.log(`\nGrand Clock Tower 기준 시간: ${grandClockTime}`);
  console.log("마을 시계 동기화 결과:");
  clocks.forEach((clock, idx) => {
    const diff = diffs[idx];
    // ASCII 아트 출력
    if (asciiArts && asciiArts[idx]) {
      console.log(asciiArts[idx]);
    }
    if (diff === null) {
      console.log(`  - 시계 ${idx + 1} (${clock}): 오류 발생`);
    } else {
      const status = diff > 0 ? "앞섬" : diff < 0 ? "뒤처짐" : "동일";
      console.log(`  - 시계 ${idx + 1} (${clock}): ${diff}분 (${status})`);
    }
    console.log("----------------------");
  });
}

// 실행
try {
  const diffs = calculateDifferences(villageClocks, grandClockTime);
  printResults(villageClocks, diffs, clockAsciiArt);
} catch (err) {
  console.error(`시스템 오류: ${err.message}`);
}

/**
 * 테스트 코드 (예시)
 * 잘못된 입력 테스트
 */
function testInvalidInput() {
  const testClocks = ["25:00", "15:60", "abc", "12:30"];
  const testAscii = [
    `   _____\n  /     \\\n | 25:00 |
  \_____/
`,
    `   _____\n  /     \\\n | 15:60 |
  \_____/
`,
    `   _____\n  /     \\\n |  abc  |
  \_____/
`,
    `   _____\n  /     \\\n | 12:30 |
  \_____/
`
  ];
  const diffs = calculateDifferences(testClocks, grandClockTime);
  printResults(testClocks, diffs, testAscii);
}
// testInvalidInput(); // 필요시 주석 해제

// 유닛 테스트: 시간 계산 로직
function runUnitTests() {
  const assert = (desc, fn) => {
    try {
      fn();
      console.log(`✅ ${desc}`);
    } catch (e) {
      console.error(`❌ ${desc}: ${e.message}`);
    }
  };

  // 정상 케이스
  assert('15:00 → 900분', () => {
    if (timeToMinutes('15:00') !== 900) throw new Error('실패');
  });
  assert('00:00 → 0분', () => {
    if (timeToMinutes('00:00') !== 0) throw new Error('실패');
  });
  assert('23:59 → 1439분', () => {
    if (timeToMinutes('23:59') !== 1439) throw new Error('실패');
  });

  // 잘못된 입력
  assert('25:00 오류', () => {
    let errorCaught = false;
    try { timeToMinutes('25:00'); } catch { errorCaught = true; }
    if (!errorCaught) throw new Error('오류 미발생');
  });
  assert('15:60 오류', () => {
    let errorCaught = false;
    try { timeToMinutes('15:60'); } catch { errorCaught = true; }
    if (!errorCaught) throw new Error('오류 미발생');
  });
  assert('abc 오류', () => {
    let errorCaught = false;
    try { timeToMinutes('abc'); } catch { errorCaught = true; }
    if (!errorCaught) throw new Error('오류 미발생');
  });
}
// runUnitTests(); // 필요시 주석 해제
