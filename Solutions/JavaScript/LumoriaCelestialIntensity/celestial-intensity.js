/**
 * Lumoria Celestial Intensity Calculator
 * --------------------------------------
 * 판타지 행성계의 각 행성이 받는 빛의 강도를 계산합니다.
 * - 행성 데이터: 이름, 거리(AU), 크기(km)
 * - 거리순 정렬, 그림자 규칙 적용
 * - 아름다운 콘솔 출력
 * - 오류 처리 및 문서 포함
 */

// 사용자 정의 행성계 입력 지원
const fs = require('fs');
let planets = [
  { name: '머큐리아', distance: 0.4, size: 4879 },
  { name: '비누시아', distance: 0.7, size: 12104 },
  { name: '어스시아', distance: 1.0, size: 12742 },
  { name: '마르시아', distance: 1.5, size: 6779 }
];

// 명령행 인자: json 파일 경로 또는 직접 입력
const args = process.argv.slice(2);
if (args.length > 0) {
  try {
    if (args[0].endsWith('.json')) {
      const jsonData = fs.readFileSync(args[0], 'utf8');
      planets = JSON.parse(jsonData);
    } else {
      // 예: node celestial-intensity.js '[{"name":"X","distance":0.3,"size":3000},...]'
      planets = JSON.parse(args[0]);
    }
  } catch (err) {
    console.error('사용자 입력 파싱 오류:', err.message);
    process.exit(1);
  }
}

const SUN_LUMINOSITY = 1.0; // 상대적 광도(단위 없음)

/**
 * 실제 물리적 조도 계산: I = L / d^2
 * @param {number} distance - AU 단위 거리
 * @returns {number} - 상대적 조도
 */
function calculateIllumination(distance) {
  return SUN_LUMINOSITY / (distance * distance);
}

/**
 * 그림자 판정(과학적 모델):
 * - 앞에 있는 행성 중, 현재 행성과 태양을 잇는 직선상에 그림자 투영이 겹치는지 판정
 * - 더 큰 행성이 앞에 있으면 Partial/None, 더 작은 행성은 영향 없음
 * - 실제로는 각도, 크기, 거리로 투영 계산 필요(여기선 근사)
 */
function calculateShadowType(sortedPlanets, idx) {
  const current = sortedPlanets[idx];
  let shadow = 'Full';
  let blockers = 0;
  for (let i = 0; i < idx; i++) {
    const other = sortedPlanets[i];
    // 앞에 있는 행성이 현재 행성보다 크고, 태양-행성-다른행성 직선상에 있다고 가정
    if (other.size > current.size) blockers++;
  }
  if (blockers === 0) shadow = 'Full';
  else if (blockers === 1) shadow = 'Partial';
  else if (blockers >= 2) shadow = 'None';
  return shadow;
}

function printCelestialBanner() {
  console.log('★━━━━━━━━ 루모리아 항성계 천체 빛 강도 ━━━━━━━━★');
}

function printPlanetResult(planet, shadowType, illumination) {
  const shadowIcons = {
    'Full': '🌞',
    'Partial': '🌗',
    'None': '🌑',
  };
  console.log(`\n${shadowIcons[shadowType] || '🌑'}  ${planet.name}`);
  console.log(`   거리: ${planet.distance} AU | 크기: ${planet.size} km`);
  console.log(`   빛의 강도: ${shadowType}`);
  console.log(`   상대적 조도: ${illumination.toFixed(3)}`);
}

function main() {
  try {
    // 거리순 정렬
    const sorted = [...planets].sort((a, b) => a.distance - b.distance);
    printCelestialBanner();
    sorted.forEach((planet, idx) => {
      const shadowType = calculateShadowType(sorted, idx);
      const illumination = calculateIllumination(planet.distance);
      printPlanetResult(planet, shadowType, illumination);
    });
    console.log('\n★━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━★');
  } catch (err) {
    console.error('오류 발생:', err.message);
  }
}

main();

/**
 * 테스트 케이스: 행성 데이터가 잘못된 경우
 * (예: 거리 또는 크기가 음수)
 */
function validatePlanets(planets) {
  planets.forEach(p => {
    if (p.distance <= 0 || p.size <= 0) {
      throw new Error(`행성 데이터 오류: ${p.name}`);
    }
  });
}

// validatePlanets(planets); // 필요시 활성화
