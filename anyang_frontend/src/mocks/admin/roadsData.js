import { ANYANG_BOUNDS } from './constants';

// 시드 고정 PRNG: 새로고침해도 데모 수치가 흔들리지 않도록 고정된 값을 만든다.
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

const rand = mulberry32(20260911);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];

// 도로 구간 목록: 앞쪽일수록 고위험군으로 배치해 우선순위 페이지에서 바로 상위에 노출되게 한다.
const ROAD_DEFS = [
  { name: '평촌대로', district: '동안구', tier: 'high', score: 94 },
  { name: '시민대로', district: '동안구', tier: 'high', score: 89 },
  { name: '관악대로', district: '동안구', tier: 'high', score: 86 },
  { name: '안양로', district: '만안구', tier: 'high', score: 84 },
  { name: '흥안대로', district: '만안구', tier: 'high', score: 83 },
  { name: '경수대로', district: '만안구', tier: 'high', score: 81 },
  { name: '인덕원로', district: '동안구', tier: 'high', score: 80 },
  { name: '박달로', district: '만안구', tier: 'high', score: 79 },
  { name: '범계로', district: '동안구', tier: 'high', score: 78 },
  { name: '비산로', district: '만안구', tier: 'high', score: 77 },
  { name: '관양로', district: '동안구', tier: 'high', score: 75 },
  { name: '냉천로', district: '만안구', tier: 'high', score: 74 },
  { name: '안양판교로', district: '동안구', tier: 'high', score: 73 },
  { name: '자유공원로', district: '만안구', tier: 'high', score: 72 },
  { name: '수리산로', district: '만안구', tier: 'high', score: 71 },
  { name: '벌말로', district: '동안구', tier: 'high', score: 70 },
  { name: '향촌로', district: '동안구', tier: 'high', score: 68 },
  { name: '만안로', district: '만안구', tier: 'mid', score: 62 },
  { name: '삼덕로', district: '만안구', tier: 'mid', score: 58 },
  { name: '덕천로', district: '동안구', tier: 'mid', score: 54 },
  { name: '임곡로', district: '동안구', tier: 'mid', score: 49 },
  { name: '안양사덕로', district: '만안구', tier: 'mid', score: 45 },
  { name: '예술공원로', district: '만안구', tier: 'low', score: 31 },
  { name: '물레방아로', district: '동안구', tier: 'low', score: 24 },
];

const TIER_DAMAGE_LEVEL = {
  high: () => pick(['severe', 'severe', 'moderate']),
  mid: () => pick(['moderate', 'minor']),
  low: () => 'minor',
};

const TIER_TRAFFIC = {
  high: () => ({ level: 'high', volume: randInt(11500, 16800) }),
  mid: () => ({ level: 'mid', volume: randInt(6800, 10500) }),
  low: () => ({ level: 'low', volume: randInt(3200, 6200) }),
};

const TIER_CONGESTION = {
  high: () => pick(['delay', 'delay', 'jam', 'slow']),
  mid: () => pick(['slow', 'slow', 'smooth']),
  low: () => 'smooth',
};

function causeAnalysisFor(tier) {
  // 고위험 구간일수록 교통량/사고이력 기여도가, 저위험 구간일수록 기타 요인 비중이 커지도록 설계
  const base =
    tier === 'high'
      ? { traffic: 32, rainfall: 25, temperature: 19, accidents: 14, other: 10 }
      : tier === 'mid'
        ? { traffic: 26, rainfall: 22, temperature: 20, accidents: 12, other: 20 }
        : { traffic: 18, rainfall: 18, temperature: 18, accidents: 8, other: 38 };

  return [
    { factor: 'traffic', percent: base.traffic },
    { factor: 'rainfall', percent: base.rainfall },
    { factor: 'temperature', percent: base.temperature },
    { factor: 'accidents', percent: base.accidents },
    { factor: 'other', percent: base.other },
  ];
}

function yearlyHistoryFor(tier, currentDamageCount) {
  const growth = tier === 'high' ? [0.45, 0.72, 1] : tier === 'mid' ? [0.5, 0.78, 1] : [0.6, 0.85, 1];
  const base2026 = Math.max(currentDamageCount + randInt(2, 6), 4);
  return [
    { year: 2024, count: Math.round(base2026 * growth[0]) },
    { year: 2025, count: Math.round(base2026 * growth[1]) },
    { year: 2026, count: base2026 },
  ];
}

function coordinateFor(district, index) {
  // 동안구는 동쪽, 만안구는 서쪽에 모여있는 것처럼 좌표를 배치
  const lngSpan = ANYANG_BOUNDS.maxLng - ANYANG_BOUNDS.minLng;
  const latSpan = ANYANG_BOUNDS.maxLat - ANYANG_BOUNDS.minLat;
  const midLng = ANYANG_BOUNDS.minLng + lngSpan / 2;

  const lng =
    district === '동안구'
      ? midLng + rand() * (lngSpan / 2) * 0.9
      : ANYANG_BOUNDS.minLng + rand() * (lngSpan / 2) * 0.9;

  const lat = ANYANG_BOUNDS.minLat + ((index * 37) % 100) / 100 * latSpan * 0.85 + rand() * latSpan * 0.1;

  return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
}

export const ROADS = ROAD_DEFS.map((def, index) => {
  const id = `RD-${String(index + 1).padStart(3, '0')}`;
  const damageLevel = TIER_DAMAGE_LEVEL[def.tier]();
  const traffic = TIER_TRAFFIC[def.tier]();
  const congestion = TIER_CONGESTION[def.tier]();
  const currentDamageCount =
    def.tier === 'high' ? randInt(2, 5) : def.tier === 'mid' ? randInt(1, 3) : randInt(0, 1);
  const citizenReportCount =
    def.tier === 'high' ? randInt(5, 12) : def.tier === 'mid' ? randInt(2, 6) : randInt(0, 3);

  return {
    id,
    name: def.name,
    district: def.district,
    riskScore: def.score,
    riskLevel: def.tier,
    currentDamageLevel: damageLevel,
    damageForecastProb: Math.max(15, Math.min(97, def.score + randInt(-6, 4))),
    trafficLevel: traffic.level,
    avgTrafficVolume: traffic.volume,
    avgSpeed: randInt(32, 52),
    congestion,
    accidentCount:
      def.tier === 'high' ? randInt(6, 14) : def.tier === 'mid' ? randInt(2, 6) : randInt(0, 2),
    citizenReportCount,
    recentReportCount: citizenReportCount,
    currentDamageCount,
    yearlyDamage: yearlyHistoryFor(def.tier, currentDamageCount),
    causeAnalysis: causeAnalysisFor(def.tier),
    coordinate: coordinateFor(def.district, index),
  };
});

// 기획서 예시 수치와 맞춘 고정 오버라이드
const topPriorityRoad = ROADS.find((r) => r.name === '평촌대로');
if (topPriorityRoad) {
  topPriorityRoad.currentDamageLevel = 'severe';
  topPriorityRoad.damageForecastProb = 87;
  topPriorityRoad.trafficLevel = 'high';
  topPriorityRoad.accidentCount = 12;
  topPriorityRoad.citizenReportCount = 8;
  topPriorityRoad.recentReportCount = 8;
}

// 신고 상세 페이지 예시(#10231)와 맞춘 고정 오버라이드: "안양시 oo로" 예시 수치
const targetRoad = ROADS.find((r) => r.name === '안양로');
if (targetRoad) {
  targetRoad.recentReportCount = 8;
  targetRoad.currentDamageCount = 3;
  targetRoad.avgTrafficVolume = 12381;
  targetRoad.avgSpeed = 42;
  targetRoad.congestion = 'delay';
}

export const HIGH_RISK_ROAD_COUNT = ROADS.filter((r) => r.riskLevel === 'high').length;

export function getRoads() {
  return ROADS;
}

export function getRoadById(id) {
  return ROADS.find((r) => r.id === id) ?? null;
}

export function getPriorityRoads() {
  return [...ROADS].sort((a, b) => b.riskScore - a.riskScore);
}
