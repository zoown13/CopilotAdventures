// TemporaClockSync 시스템 테스트
const { execSync } = require('child_process');

function runMainTest() {
  try {
    const output = execSync('node TemporaClockSync.js', { encoding: 'utf8' });
    console.log('=== 정상 입력 테스트 ===');
    console.log(output);
  } catch (err) {
    console.error('실행 오류:', err.message);
  }
}

function runInvalidTest() {
  try {
    // TemporaClockSync.js의 testInvalidInput() 주석 해제 필요
    const output = execSync('node TemporaClockSync.js', { encoding: 'utf8' });
    console.log('=== 잘못된 입력 테스트 ===');
    console.log(output);
  } catch (err) {
    console.error('실행 오류:', err.message);
  }
}

runMainTest();
// runInvalidTest(); // 필요시 주석 해제 후 테스트
