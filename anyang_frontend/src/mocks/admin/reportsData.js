import { REPORT_STATUS_STEPS } from './constants';
import { ROADS } from './roadsData';
import { MEMBERS } from './membersData';

function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1231120260);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];

function shuffledStatusPlan(total, counts) {
  const plan = [];
  Object.entries(counts).forEach(([status, count]) => {
    for (let i = 0; i < count; i += 1) plan.push(status);
  });
  // Fisher-Yates shuffle (시드 고정이라 항상 같은 배치 결과)
  for (let i = plan.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [plan[i], plan[j]] = [plan[j], plan[i]];
  }
  return plan;
}

const TOTAL_REPORTS = 328;
// 미처리(접수/배정/현장점검) 42건 + 처리완료 286건 = 처리율 87%
const STATUS_PLAN = shuffledStatusPlan(TOTAL_REPORTS, {
  received: 16,
  assigned: 14,
  inspecting: 12,
  done: 286,
});

const TYPE_POOL = [
  ...Array(120).fill('pothole'),
  ...Array(85).fill('crack'),
  ...Array(45).fill('manhole'),
  ...Array(40).fill('sign'),
  ...Array(25).fill('subsidence'),
  ...Array(13).fill('lane'),
];
for (let i = TYPE_POOL.length - 1; i > 0; i -= 1) {
  const j = randInt(0, i);
  [TYPE_POOL[i], TYPE_POOL[j]] = [TYPE_POOL[j], TYPE_POOL[i]];
}

const DEPARTMENTS = ['도로관리과', '시설물안전과', '교통행정과'];

function randomDateIn2026() {
  // 2026-01-01 ~ 2026-09-11(오늘) 사이 임의 시각
  const start = new Date('2026-01-01T08:00:00');
  const end = new Date('2026-09-11T18:00:00');
  const t = start.getTime() + rand() * (end.getTime() - start.getTime());
  return new Date(t);
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function buildTimeline(status, createdAt) {
  const stageIndex = REPORT_STATUS_STEPS.findIndex((s) => s.key === status);
  let cursor = new Date(createdAt);

  return REPORT_STATUS_STEPS.map((step, i) => {
    if (i > stageIndex) {
      return { key: step.key, label: step.label, at: null, done: false };
    }
    if (i > 0) {
      cursor = new Date(cursor.getTime() + randInt(3, 30) * 60 * 60 * 1000);
    }
    return { key: step.key, label: step.label, at: formatDateTime(cursor), done: true };
  });
}

function severityFromConfidenceAndType() {
  return pick(['minor', 'minor', 'moderate', 'moderate', 'moderate', 'severe']);
}

function jitterCoordinate(coordinate) {
  const jitter = () => (rand() - 0.5) * 0.01;
  return {
    lat: Number((coordinate.lat + jitter()).toFixed(5)),
    lng: Number((coordinate.lng + jitter()).toFixed(5)),
  };
}

export const REPORTS = STATUS_PLAN.map((status, i) => {
  const id = String(10001 + i);
  const road = pick(ROADS);
  const reporter = pick(MEMBERS);
  const createdAt = randomDateIn2026();
  const aiConfidence = Number((randInt(78, 99) + rand()).toFixed(1));
  const type = TYPE_POOL[i % TYPE_POOL.length];
  const department = status === 'received' ? null : pick(DEPARTMENTS);

  return {
    id,
    type,
    severity: severityFromConfidenceAndType(),
    aiConfidence,
    address: `안양시 ${road.district} ${road.name} ${randInt(1, 300)}`,
    roadId: road.id,
    coordinate: jitterCoordinate(road.coordinate),
    status,
    department,
    reporterId: reporter.id,
    createdAt: formatDateTime(createdAt),
    timeline: buildTimeline(status, createdAt),
    manualOverride: null, // 관리자가 AI 판정을 수정하면 { type, severity, note, at } 형태로 채워짐
  };
});

// 상세 페이지 데모용 고정 시나리오: 대시보드 1순위 도로(평촌대로)와 이어지는 스토리라인
const demoReport = REPORTS.find((r) => r.id === '10231');
if (demoReport) {
  const priorityRoad = ROADS.find((r) => r.name === '평촌대로');
  demoReport.type = 'pothole';
  demoReport.severity = 'severe';
  demoReport.aiConfidence = 92.4;
  demoReport.status = 'assigned';
  demoReport.department = '도로관리과';
  demoReport.roadId = priorityRoad?.id ?? demoReport.roadId;
  demoReport.address = '안양시 동안구 평촌대로 58';
  demoReport.createdAt = '2026-09-05 09:12';
  demoReport.timeline = buildTimeline('assigned', new Date('2026-09-05T09:12:00'));
}

export function getReports() {
  return REPORTS;
}

export function getReportById(id) {
  return REPORTS.find((r) => r.id === id) ?? null;
}

export function getReportStats() {
  const total = REPORTS.length;
  const done = REPORTS.filter((r) => r.status === 'done').length;
  const unresolved = total - done;
  const resolutionRate = Math.round((done / total) * 100);
  return { total, unresolved, done, resolutionRate };
}
