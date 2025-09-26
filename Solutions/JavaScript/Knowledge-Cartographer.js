/**
 * Knowledge Cartographer CLI
 * MCP 구조화 지식 베이스 탐색기 (Mystical Theme)
 *
 * 사용법: node Knowledge-Cartographer.js
 *
 * MCP가 생성한 ./akashic-archives-demo 디렉터리의 JSON 파일을 읽고,
 * 엔터티, 관계, 출처를 분석하며, 대화형 CLI로 탐색을 지원합니다.
 * 외부 라이브러리 없이 Node.js 내장 모듈만 사용합니다.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BASE_DIR = '/workspaces/CopilotAdventures/akashic-archives-demo';
const TOPICS_INDEX = path.join(BASE_DIR, 'indexes/topics-index.json');
const METADATA = path.join(BASE_DIR, 'indexes/metadata.json');

function mysticalPrint(text) {
  // 신비로운 테마의 콘솔 출력
  console.log(`\x1b[36m★ ${text} \x1b[0m`);
}

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    mysticalPrint(`파일 읽기 오류: ${filePath}`);
    return null;
  }
}

function listTopics() {
  const topics = loadJSON(TOPICS_INDEX);
  if (!topics) return [];
  topics.forEach(t => mysticalPrint(`[${t.id}] ${t.title} - ${t.description}`));
  return topics.map(t => t.id);
}


function loadDomain(domainId) {
  const dir = path.join(BASE_DIR, 'topics', domainId);
  return {
    entities: loadJSON(path.join(dir, 'entities.json')) || [],
    relationships: loadJSON(path.join(dir, 'relationships.json')) || [],
    sources: loadJSON(path.join(dir, 'sources.json')) || []
  };
}

function mergeDomains(domainIds) {
  // 여러 도메인 id를 받아 병합된 그래프 반환
  let merged = { entities: [], relationships: [], sources: [] };
  let entityIds = new Set();
  let relSet = new Set();
  let srcSet = new Set();
  domainIds.forEach(id => {
    const d = loadDomain(id);
    d.entities.forEach(e => {
      if (!entityIds.has(e.id)) {
        merged.entities.push(e);
        entityIds.add(e.id);
      }
    });
    d.relationships.forEach(r => {
      const relKey = `${r.source}->${r.target}:${r.type}`;
      if (!relSet.has(relKey)) {
        merged.relationships.push(r);
        relSet.add(relKey);
      }
    });
    d.sources.forEach(s => {
      if (!srcSet.has(s.id)) {
        merged.sources.push(s);
        srcSet.add(s.id);
      }
    });
  });
  return merged;
}

function showEntities(domain) {
  mysticalPrint('◆ 엔터티 목록 ◆');
  domain.entities.forEach(e => {
    console.log(`- [${e.id}] ${e.name} (${e.type}): ${e.description}`);
  });
}

function showRelationships(domain) {
  mysticalPrint('◆ 관계 목록 ◆');
  domain.relationships.forEach(r => {
    console.log(`- ${r.source} → ${r.target} [${r.type}]: ${r.description}`);
  });
}

function showSources(domain) {
  mysticalPrint('◆ 출처 목록 ◆');
  domain.sources.forEach(s => {
    console.log(`- ${s.title} (${s.trust})\n  ${s.url}`);
  });
}

function analyzeGraph(domain) {
  mysticalPrint('◆ 지식 그래프 분석 ◆');
  // 엔터티 연결 강도 및 클러스터 탐색
  const entityMap = {};
  domain.entities.forEach(e => entityMap[e.id] = e.name);
  const connectionCount = {};
  domain.relationships.forEach(r => {
    connectionCount[r.source] = (connectionCount[r.source] || 0) + 1;
    connectionCount[r.target] = (connectionCount[r.target] || 0) + 1;
  });
  Object.entries(connectionCount).forEach(([id, count]) => {
    console.log(`- ${entityMap[id] || id}: 연결 ${count}회`);
  });
  // 클러스터: 연결 많은 엔터티 강조
  const maxConn = Math.max(...Object.values(connectionCount));
  Object.entries(connectionCount).forEach(([id, count]) => {
    if (count === maxConn) mysticalPrint(`★ 클러스터 중심: ${entityMap[id] || id}`);
  });
}


function showMenu() {
  console.log('\n\x1b[35m=== Akashic Archives Mystical CLI ===\x1b[0m');
  console.log('1. 지식 도메인 목록 보기');
  console.log('2. 도메인 로드 및 탐색');
  console.log('3. 다중 도메인 병합 탐색');
  console.log('4. 종료');
}

function domainMenu(domainId, domain) {
  console.log(`\n\x1b[34m--- [${domainId}] Mystical Domain Explorer ---\x1b[0m`);
  console.log('1. 엔터티 보기');
  console.log('2. 관계 보기');
  console.log('3. 출처 보기');
  console.log('4. 그래프 분석');
  console.log('5. 뒤로가기');
}


async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  mysticalPrint('Knowledge Cartographer에 오신 것을 환영합니다!');
  const metadata = loadJSON(METADATA);
  if (metadata) mysticalPrint(`데이터 생성일: ${metadata.created}, 도메인: ${metadata.domains.join(', ')}`);

  let running = true;
  while (running) {
    showMenu();
    const answer = await new Promise(res => rl.question('명령 선택 > ', res));
    if (answer === '1') {
      listTopics();
    } else if (answer === '2') {
      const topicIds = listTopics();
      const topic = await new Promise(res => rl.question('탐색할 도메인 id 입력 > ', res));
      if (!topicIds.includes(topic)) {
        mysticalPrint('존재하지 않는 도메인입니다.');
        continue;
      }
      const domain = loadDomain(topic);
      let exploring = true;
      while (exploring) {
        domainMenu(topic, domain);
        const sub = await new Promise(res => rl.question('서브 명령 선택 > ', res));
        if (sub === '1') showEntities(domain);
        else if (sub === '2') showRelationships(domain);
        else if (sub === '3') showSources(domain);
        else if (sub === '4') analyzeGraph(domain);
        else if (sub === '5') exploring = false;
        else mysticalPrint('알 수 없는 명령입니다.');
      }
    } else if (answer === '3') {
      // 다중 도메인 병합 탐색
      const topicIds = listTopics();
      mysticalPrint('병합할 도메인 id들을 쉼표로 입력하세요 (예: quantum-computing,artificial-intelligence)');
      const input = await new Promise(res => rl.question('도메인 id들 > ', res));
      const ids = input.split(',').map(s => s.trim()).filter(s => topicIds.includes(s));
      if (ids.length < 2) {
        mysticalPrint('2개 이상의 유효한 도메인 id가 필요합니다.');
        continue;
      }
      const merged = mergeDomains(ids);
      mysticalPrint(`병합된 도메인: ${ids.join(', ')}`);
      let exploring = true;
      while (exploring) {
        domainMenu('병합', merged);
        const sub = await new Promise(res => rl.question('서브 명령 선택 > ', res));
        if (sub === '1') showEntities(merged);
        else if (sub === '2') showRelationships(merged);
        else if (sub === '3') showSources(merged);
        else if (sub === '4') analyzeGraph(merged);
        else if (sub === '5') exploring = false;
        else mysticalPrint('알 수 없는 명령입니다.');
      }
    } else if (answer === '4') {
      mysticalPrint('신비로운 탐험을 마칩니다.');
      running = false;
    } else {
      mysticalPrint('알 수 없는 명령입니다.');
    }
  }
  rl.close();
}

if (require.main === module) {
  main();
}
