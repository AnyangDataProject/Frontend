// 목데이터 기반 mock API 레이어.
// 나중에 실제 백엔드가 준비되면 이 파일의 함수 내부만 실제 fetch(...) 호출로 교체하면 된다.
// 호출부(컴포넌트)는 이 함수들의 시그니처만 알면 되도록 설계.

import { REPORTS, getReportStats } from './reportsData';
import { ROADS, getPriorityRoads, getRoadById as findRoadById, HIGH_RISK_ROAD_COUNT } from './roadsData';
import { MEMBERS } from './membersData';
import { INQUIRIES } from './inquiriesData';
import { REPORT_STATUS_STEPS } from './constants';

const NETWORK_DELAY = 300;

function delay(value, ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function rebuildTimeline(status, previousTimeline) {
  const stageIndex = REPORT_STATUS_STEPS.findIndex((s) => s.key === status);
  const isFinalStage = stageIndex === REPORT_STATUS_STEPS.length - 1;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`;

  return REPORT_STATUS_STEPS.map((step, i) => {
    const prev = previousTimeline.find((t) => t.key === step.key);
    if (i > stageIndex) return { key: step.key, label: step.label, at: null, done: false };
    if (prev?.done) return prev;
    // 현재 진행 중인 단계(마지막 단계 제외)는 완료 처리하지 않아야
    // StatusTimeline이 체크 표시가 아닌 진행 중 링으로 구분해서 보여준다.
    const done = i < stageIndex || isFinalStage;
    return { key: step.key, label: step.label, at: nowStr, done };
  });
}

// ---------- 대시보드 ----------

export async function fetchDashboardSummary() {
  const stats = getReportStats();
  const priorityRoads = getPriorityRoads().slice(0, 5);

  const mapPoints = ROADS.map((road) => ({
    id: road.id,
    lat: road.coordinate.lat,
    lng: road.coordinate.lng,
    label: road.name,
    tone: road.riskLevel === 'high' ? 'danger' : road.riskLevel === 'mid' ? 'warning' : 'success',
  }));

  return delay({
    totalReports: stats.total,
    unresolvedReports: stats.unresolved,
    highRiskRoadCount: HIGH_RISK_ROAD_COUNT,
    resolutionRate: stats.resolutionRate,
    topPriorityRoads: priorityRoads,
    mapPoints,
  });
}

// ---------- 신고 관리 ----------

export async function fetchReports() {
  return delay([...REPORTS]);
}

export async function fetchReportById(id) {
  return delay(REPORTS.find((r) => r.id === id) ?? null);
}

export async function updateReportStatus(id, nextStatus) {
  const report = REPORTS.find((r) => r.id === id);
  if (!report) return delay(null);
  report.status = nextStatus;
  report.timeline = rebuildTimeline(nextStatus, report.timeline);
  if (!report.department) report.department = '도로관리과';
  return delay({ ...report });
}

export async function updateReportClassification(id, { type, severity, note }) {
  const report = REPORTS.find((r) => r.id === id);
  if (!report) return delay(null);
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  report.manualOverride = {
    type,
    severity,
    note: note ?? '',
    at: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`,
  };
  return delay({ ...report });
}

// ---------- 점검 우선순위 / 도로 상세 ----------

export async function fetchPriorityRoads() {
  return delay(getPriorityRoads());
}

export async function fetchRoadById(id) {
  const road = findRoadById(id);
  if (!road) return delay(null);
  const relatedReports = REPORTS.filter((r) => r.roadId === id);
  return delay({ ...road, relatedReports });
}

// ---------- 회원 관리 ----------

export async function fetchMembers() {
  const reportCountByMember = REPORTS.reduce((acc, r) => {
    acc[r.reporterId] = (acc[r.reporterId] ?? 0) + 1;
    return acc;
  }, {});

  const merged = MEMBERS.map((m) => ({
    ...m,
    reportCount: reportCountByMember[m.id] ?? 0,
  }));

  return delay(merged);
}

export async function updateMemberStatus(id, status, reason) {
  const member = MEMBERS.find((m) => m.id === id);
  if (!member) return delay(null);
  member.status = status;
  member.restrictionReason = status === 'restricted' ? reason ?? '운영 정책 위반' : null;
  return delay({ ...member });
}

// ---------- 문의 관리 ----------

export async function fetchInquiries() {
  return delay([...INQUIRIES]);
}

export async function submitInquiryAnswer(id, answerText) {
  const inquiry = INQUIRIES.find((i) => i.id === id);
  if (!inquiry) return delay(null);
  inquiry.status = 'answered';
  inquiry.answer = answerText.trim();
  return delay({ ...inquiry });
}
