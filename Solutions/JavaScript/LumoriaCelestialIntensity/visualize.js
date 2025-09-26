/**
 * Lumoria 행성 정렬 SVG 시각화 및 그림자 애니메이션 생성기
 * - 행성 배열을 SVG로 시각화
 * - 정렬 과정별 그림자 변화 애니메이션 프레임 생성
 * - SVG 파일로 저장
 */
const fs = require('fs');

function generateSVG(planets, sortedPlanets, shadowFrames) {
  const width = 800, height = 300;
  const planetY = 150;
  const sunX = 50;
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `<circle cx="${sunX}" cy="${planetY}" r="30" fill="gold" />\n`;
  svg += `<text x="${sunX-20}" y="${planetY+50}" font-size="18">태양</text>`;
  // 행성 그리기
  sortedPlanets.forEach((p, i) => {
    const x = sunX + 100 + i * 150;
    svg += `<circle cx="${x}" cy="${planetY}" r="${Math.max(15, p.size/1000)}" fill="#6faaff" stroke="#333" stroke-width="2" />\n`;
    svg += `<text x="${x-20}" y="${planetY+40}" font-size="16">${p.name}</text>`;
    // 그림자 표시
    svg += `<text x="${x-20}" y="${planetY-40}" font-size="14">${shadowFrames[i]}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

function saveSVG(svg, filename) {
  fs.writeFileSync(filename, svg, 'utf8');
}

// 예시: 정렬 및 그림자 프레임
const planets = [
  { name: '머큐리아', distance: 0.4, size: 4879 },
  { name: '비누시아', distance: 0.7, size: 12104 },
  { name: '어스시아', distance: 1.0, size: 12742 },
  { name: '마르시아', distance: 1.5, size: 6779 }
];
const sorted = [...planets].sort((a, b) => a.distance - b.distance);
const shadowFrames = ['🌞', '🌗', '🌑', '🌑']; // 실제 그림자 계산 결과로 대체 가능
const svg = generateSVG(planets, sorted, shadowFrames);
saveSVG(svg, 'visualization.svg');

console.log('SVG 시각화가 생성되었습니다: visualization.svg');
