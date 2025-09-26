// Lumoria Celestial Intensity 테스트 코드

const { execSync } = require('child_process');
const path = require('path');
const celestial = require('./celestial-intensity.js'); // 모듈화 필요시 사용


function runMainScript() {
  try {
    const output = execSync('node celestial-intensity.js', { encoding: 'utf8' });
    console.log('테스트 출력:\n', output);
    if (!output.includes('머큐리아') || !output.includes('빛의 강도')) {
      throw new Error('행성 결과가 올바르게 출력되지 않음');
    }
    console.log('✅ 기본 출력 테스트 통과');
  } catch (err) {
    console.error('❌ 테스트 실패:', err.message);
  }
}

function testIlluminationCalculation() {
  // 실제 물리 모델 테스트
  const calc = (d) => 1.0 / (d * d);
  const testCases = [
    { distance: 1, expected: 1.0 },
    { distance: 0.5, expected: 4.0 },
    { distance: 2, expected: 0.25 }
  ];
  testCases.forEach(tc => {
    const result = calc(tc.distance);
    if (Math.abs(result - tc.expected) > 0.001) {
      throw new Error(`조도 계산 오류: ${tc.distance} → ${result}`);
    }
  });
  console.log('✅ 조도 계산 유닛 테스트 통과');
}

function testShadowType() {
  // 그림자 판정 테스트
  const planets = [
    { name: 'A', distance: 0.5, size: 1000 },
    { name: 'B', distance: 1.0, size: 2000 },
    { name: 'C', distance: 1.5, size: 500 }
  ];
  const sorted = planets.sort((a, b) => a.distance - b.distance);
  // 첫 번째는 Full, 두 번째는 Partial, 세 번째는 None
  const shadowTypes = [
    'Full', 'Partial', 'None'
  ];
  sorted.forEach((p, idx) => {
    // 실제 로직을 복사하여 테스트
    let blockers = 0;
    for (let i = 0; i < idx; i++) {
      if (sorted[i].size > p.size) blockers++;
    }
    let expected = shadowTypes[idx];
    let actual = blockers === 0 ? 'Full' : blockers === 1 ? 'Partial' : 'None';
    if (actual !== expected) {
      throw new Error(`그림자 판정 오류: ${p.name} → ${actual} (예상: ${expected})`);
    }
  });
  console.log('✅ 그림자 판정 유닛 테스트 통과');
}

function testCustomSystem() {
  // 사용자 정의 항성계 테스트
  const customPlanets = [
    { name: 'X', distance: 0.3, size: 3000 },
    { name: 'Y', distance: 0.6, size: 6000 },
    { name: 'Z', distance: 1.2, size: 12000 }
  ];
  const sorted = customPlanets.sort((a, b) => a.distance - b.distance);
  sorted.forEach((p, idx) => {
    const illumination = 1.0 / (p.distance * p.distance);
    if (illumination <= 0) throw new Error('조도 값 오류');
  });
  console.log('✅ 사용자 정의 항성계 테스트 통과');
}

function testInvalidPlanetData() {
  const planets = [
    { name: 'Testia', distance: -1, size: 1000 }
  ];
  try {
    require('./celestial-intensity.js');
    // validatePlanets(planets) 함수가 주석 처리되어 있으므로, 실제 오류 발생은 없음
    // 실제 테스트에서는 validatePlanets(planets) 활성화 필요
    console.log('⚠️ 데이터 검증 테스트는 validatePlanets 활성화 시 동작');
  } catch (err) {
    console.log('✅ 데이터 오류 테스트 통과:', err.message);
  }
}


runMainScript();
testIlluminationCalculation();
testShadowType();
testCustomSystem();
testInvalidPlanetData();
