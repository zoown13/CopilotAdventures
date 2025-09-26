# Tempora Clock Synchronization System

템포라 마을의 모든 시계를 대형 시계탑(Grand Clock Tower) 기준으로 동기화하는 콘솔 애플리케이션입니다.

## 주요 기능
- 대형 시계탑 시간(15:00) 기준으로 4개 시계의 시간 차이(분)를 계산
- 각 시계를 ASCII 아트로 시각적으로 출력
- 앞선 시계는 양수, 뒤처진 시계는 음수로 표시
- 명확한 콘솔 출력 및 오류 처리
- 시간 계산 로직에 대한 유닛 테스트 포함

## 실행 방법
```bash
node TemporaClockSync.js
```

## ASCII 아트 예시
```
   _____
  /     \
 | 14:45 |
  \_____/
```

## 유닛 테스트 실행
- `TemporaClockSync.js`에서 `runUnitTests();` 주석을 해제 후 실행

## 잘못된 입력 테스트
- `testInvalidInput();` 주석을 해제 후 실행

## 시스템 설계 문서
- 자세한 구조와 흐름은 `DESIGN.md` 참고

---
