import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileWarning,
  Users,
  MessageSquare,
  LogOut,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CircleDot,
  Construction,
  CloudRain,
  Car,
  Snowflake,
  Mountain,
  ChevronRight,
  Activity,
  MapPin,
  CalendarDays,
  Brain,
} from 'lucide-react';

import './AdminRoadAnalysis.css';

const ROAD_DATA = [
  {
    id: 1,
    road: '평촌대로',
    district: '동안구',
    reports: 18,
    high: 7,
    mid: 8,
    low: 3,
    mainType: '포트홀',
    cause: '반복적인 차량 통행',
    causeKey: 'traffic',
    risk: '높음',
    score: 91,
  },
  {
    id: 2,
    road: '시민대로',
    district: '동안구',
    reports: 15,
    high: 5,
    mid: 7,
    low: 3,
    mainType: '노면 균열',
    cause: '도로 노후화',
    causeKey: 'aging',
    risk: '높음',
    score: 87,
  },
  {
    id: 3,
    road: '관악대로',
    district: '동안구',
    reports: 13,
    high: 6,
    mid: 4,
    low: 3,
    mainType: '포트홀',
    cause: '강우 및 배수 문제',
    causeKey: 'rain',
    risk: '높음',
    score: 84,
  },
  {
    id: 4,
    road: '안양로',
    district: '만안구',
    reports: 11,
    high: 3,
    mid: 5,
    low: 3,
    mainType: '표지판 파손',
    cause: '시설물 노후화',
    causeKey: 'aging',
    risk: '보통',
    score: 72,
  },
  {
    id: 5,
    road: '삼덕로',
    district: '만안구',
    reports: 10,
    high: 4,
    mid: 3,
    low: 3,
    mainType: '포트홀',
    cause: '동결·융해',
    causeKey: 'freeze',
    risk: '보통',
    score: 69,
  },
  {
    id: 6,
    road: '병목안로',
    district: '만안구',
    reports: 8,
    high: 2,
    mid: 3,
    low: 3,
    mainType: '노면 균열',
    cause: '지반 침하',
    causeKey: 'ground',
    risk: '보통',
    score: 61,
  },
];

const MONTHLY_DATA = [
  { month: '4월', count: 18 },
  { month: '5월', count: 24 },
  { month: '6월', count: 31 },
  { month: '7월', count: 28 },
  { month: '8월', count: 39 },
  { month: '9월', count: 47 },
];

const CAUSE_DATA = [
  {
    key: 'aging',
    label: '도로 노후화',
    count: 31,
    ratio: 29,
    icon: Construction,
  },
  {
    key: 'traffic',
    label: '반복적인 차량 통행',
    count: 27,
    ratio: 25,
    icon: Car,
  },
  {
    key: 'rain',
    label: '강우 및 배수 문제',
    count: 21,
    ratio: 20,
    icon: CloudRain,
  },
  {
    key: 'freeze',
    label: '동결·융해',
    count: 16,
    ratio: 15,
    icon: Snowflake,
  },
  {
    key: 'ground',
    label: '지반 침하',
    count: 12,
    ratio: 11,
    icon: Mountain,
  },
];

const TYPE_DATA = [
  {
    label: '포트홀',
    count: 42,
    ratio: 39,
    icon: CircleDot,
  },
  {
    label: '노면 균열',
    count: 31,
    ratio: 29,
    icon: Construction,
  },
  {
    label: '맨홀/시설물',
    count: 20,
    ratio: 19,
    icon: AlertTriangle,
  },
  {
    label: '표지판 파손',
    count: 14,
    ratio: 13,
    icon: AlertTriangle,
  },
];

const RISK_DATA = [
  {
    label: '높음',
    count: 25,
    ratio: 23,
    className: 'high',
  },
  {
    label: '보통',
    count: 48,
    ratio: 45,
    className: 'mid',
  },
  {
    label: '낮음',
    count: 34,
    ratio: 32,
    className: 'low',
  },
];

function AdminRoadAnalysis() {
  const navigate = useNavigate();

  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedRoad, setSelectedRoad] = useState(null);

  const totalReports = useMemo(
    () =>
      ROAD_DATA.reduce(
        (sum, road) => sum + road.reports,
        0
      ),
    []
  );

  const filteredRoads = useMemo(() => {
    if (districtFilter === 'all') {
      return ROAD_DATA;
    }

    return ROAD_DATA.filter(
      (road) => road.district === districtFilter
    );
  }, [districtFilter]);

  const maxMonthlyCount = Math.max(
    ...MONTHLY_DATA.map((item) => item.count)
  );

  return (
    <div className="admin-road-analysis-page">


      {/* Main */}
      <main className="admin-road-analysis-main">
        {/* Topbar */}
        <header className="admin-road-analysis-topbar">
          <div>
            <h1>도로 분석</h1>
            <p>
              AI 기반으로 도로 파손 원인과 취약 구간을 분석합니다.
            </p>
          </div>

          <div className="admin-road-analysis-date">
            2026년 9월 9일
          </div>
        </header>

        <div className="admin-road-analysis-content">
          {/* Summary */}
          <section className="admin-road-analysis-summary">
            <div className="admin-road-analysis-summary-card">
              <div className="admin-road-analysis-summary-icon blue">
                <FileWarning size={20} />
              </div>

              <div>
                <span>분석 대상 신고</span>
                <strong>{totalReports}</strong>
                <small>최근 6개월</small>
              </div>
            </div>

            <div className="admin-road-analysis-summary-card">
              <div className="admin-road-analysis-summary-icon red">
                <AlertTriangle size={20} />
              </div>

              <div>
                <span>고위험 파손</span>
                <strong>25</strong>
                <small>전체의 23%</small>
              </div>
            </div>

            <div className="admin-road-analysis-summary-card">
              <div className="admin-road-analysis-summary-icon orange">
                <Activity size={20} />
              </div>

              <div>
                <span>취약 도로</span>
                <strong>6</strong>
                <small>집중 관리 필요</small>
              </div>
            </div>

            <div className="admin-road-analysis-summary-card">
              <div className="admin-road-analysis-summary-icon green">
                <Brain size={20} />
              </div>

              <div>
                <span>AI 분석 정확도</span>
                <strong>93.8%</strong>
                <small>최근 분석 기준</small>
              </div>
            </div>
          </section>

          {/* Main analytics row */}
          <section className="admin-road-analysis-grid">
            {/* Monthly trend */}
            <div className="admin-road-analysis-card trend-card">
              <div className="admin-road-analysis-card-header">
                <div>
                  <h2>파손 발생 추이</h2>
                  <p>최근 6개월 신고 건수</p>
                </div>

                <TrendingUp size={19} />
              </div>

              <div className="admin-road-analysis-chart">
                <div className="admin-road-analysis-y-axis">
                  <span>50</span>
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>

                <div className="admin-road-analysis-bars">
                  {MONTHLY_DATA.map((item) => {
                    const height =
                      (item.count / maxMonthlyCount) * 100;

                    return (
                      <div
                        className="admin-road-analysis-bar-item"
                        key={item.month}
                      >
                        <span className="admin-road-analysis-bar-value">
                          {item.count}
                        </span>

                        <div className="admin-road-analysis-bar-track">
                          <div
                            className="admin-road-analysis-bar"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>

                        <span className="admin-road-analysis-bar-label">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-road-analysis-trend-notice">
                <TrendingUp size={15} />
                <span>
                  4월 대비 9월 파손 신고가
                  <strong> 161%</strong> 증가했습니다.
                </span>
              </div>
            </div>

            {/* Cause analysis */}
            <div className="admin-road-analysis-card cause-card">
              <div className="admin-road-analysis-card-header">
                <div>
                  <h2>파손 원인 분석</h2>
                  <p>AI 분석 결과 기반 추정 원인</p>
                </div>

                <Brain size={19} />
              </div>

              <div className="admin-road-analysis-cause-list">
                {CAUSE_DATA.map((cause) => {
                  const CauseIcon = cause.icon;

                  return (
                    <div
                      className="admin-road-analysis-cause-item"
                      key={cause.key}
                    >
                      <div className="admin-road-analysis-cause-icon">
                        <CauseIcon size={16} />
                      </div>

                      <div className="admin-road-analysis-cause-info">
                        <div>
                          <strong>{cause.label}</strong>
                          <span>
                            {cause.count}건 · {cause.ratio}%
                          </span>
                        </div>

                        <div className="admin-road-analysis-progress">
                          <div
                            style={{
                              width: `${cause.ratio}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="admin-road-analysis-ai-note">
                <Brain size={15} />

                <p>
                  현재 안양시 도로 파손은
                  <strong> 도로 노후화</strong>와
                  <strong> 반복적인 차량 통행</strong>의
                  영향이 가장 큰 것으로 분석됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* Type + Risk */}
          <section className="admin-road-analysis-grid two-column">
            {/* Type */}
            <div className="admin-road-analysis-card">
              <div className="admin-road-analysis-card-header">
                <div>
                  <h2>파손 유형 분석</h2>
                  <p>유형별 신고 현황</p>
                </div>

                <CircleDot size={19} />
              </div>

              <div className="admin-road-analysis-type-list">
                {TYPE_DATA.map((item) => {
                  const TypeIcon = item.icon;

                  return (
                    <div
                      className="admin-road-analysis-type-item"
                      key={item.label}
                    >
                      <div className="admin-road-analysis-type-left">
                        <div className="admin-road-analysis-type-icon">
                          <TypeIcon size={16} />
                        </div>

                        <span>{item.label}</span>
                      </div>

                      <div className="admin-road-analysis-type-right">
                        <strong>{item.count}건</strong>
                        <span>{item.ratio}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk */}
            <div className="admin-road-analysis-card">
              <div className="admin-road-analysis-card-header">
                <div>
                  <h2>위험도 분석</h2>
                  <p>AI 위험도 분류 결과</p>
                </div>

                <AlertTriangle size={19} />
              </div>

              <div className="admin-road-analysis-risk-content">
                <div className="admin-road-analysis-risk-chart">
                  <div
                    className="admin-road-analysis-risk-donut"
                    style={{
                      background:
                        'conic-gradient(#dc4b4b 0 23%, #e8a33d 23% 68%, #4b9a76 68% 100%)',
                    }}
                  >
                    <div>
                      <strong>107</strong>
                      <span>전체</span>
                    </div>
                  </div>
                </div>

                <div className="admin-road-analysis-risk-list">
                  {RISK_DATA.map((risk) => (
                    <div
                      className="admin-road-analysis-risk-item"
                      key={risk.label}
                    >
                      <div>
                        <span
                          className={`admin-road-analysis-risk-dot ${risk.className}`}
                        />

                        <span>{risk.label}</span>
                      </div>

                      <strong>
                        {risk.count}건
                        <small>{risk.ratio}%</small>
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Road detail */}
          <section className="admin-road-analysis-road-section">
            <div className="admin-road-analysis-road-header">
              <div>
                <h2>도로 상세 분석</h2>
                <p>
                  파손 신고가 집중된 도로의 위험도를 분석합니다.
                </p>
              </div>

              <div className="admin-road-analysis-road-filter">
                <select
                  value={districtFilter}
                  onChange={(e) =>
                    setDistrictFilter(e.target.value)
                  }
                >
                  <option value="all">전체 구</option>
                  <option value="동안구">동안구</option>
                  <option value="만안구">만안구</option>
                </select>
              </div>
            </div>

            <div className="admin-road-analysis-road-table-wrap">
              <table className="admin-road-analysis-road-table">
                <thead>
                  <tr>
                    <th>도로명</th>
                    <th>파손 신고</th>
                    <th>고위험</th>
                    <th>주요 파손</th>
                    <th>추정 주요 원인</th>
                    <th>위험도</th>
                    <th>분석 점수</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRoads.map((road) => (
                    <tr
                      key={road.id}
                      onClick={() => setSelectedRoad(road)}
                    >
                      <td>
                        <div className="admin-road-analysis-road-name">
                          <strong>{road.road}</strong>
                          <span>{road.district}</span>
                        </div>
                      </td>

                      <td>
                        <strong className="admin-road-analysis-report-count">
                          {road.reports}건
                        </strong>
                      </td>

                      <td>
                        <span className="admin-road-analysis-high-count">
                          {road.high}건
                        </span>
                      </td>

                      <td>
                        <span className="admin-road-analysis-main-type">
                          {road.mainType}
                        </span>
                      </td>

                      <td>
                        <span className="admin-road-analysis-cause-text">
                          {road.cause}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-road-analysis-risk-badge ${
                            road.risk === '높음'
                              ? 'high'
                              : 'mid'
                          }`}
                        >
                          {road.risk}
                        </span>
                      </td>

                      <td>
                        <div className="admin-road-analysis-score">
                          <strong>{road.score}</strong>
                          <span>/ 100</span>
                        </div>
                      </td>

                      <td>
                        <button
                          className="admin-road-analysis-road-detail"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoad(road);
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Road Detail Modal */}
      {selectedRoad && (
        <div
          className="admin-road-analysis-modal-backdrop"
          onClick={() => setSelectedRoad(null)}
        >
          <div
            className="admin-road-analysis-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-road-analysis-modal-header">
              <div>
                <span>도로 상세 분석</span>
                <h2>{selectedRoad.road}</h2>
              </div>

              <button
                onClick={() => setSelectedRoad(null)}
                className="admin-road-analysis-modal-close"
              >
                ×
              </button>
            </div>

            <div className="admin-road-analysis-modal-body">
              {/* Road overview */}
              <div className="admin-road-analysis-modal-overview">
                <div>
                  <MapPin size={17} />
                  <span>{selectedRoad.district}</span>
                </div>

                <div>
                  <FileWarning size={17} />
                  <span>
                    최근 6개월 {selectedRoad.reports}건
                  </span>
                </div>

                <div>
                  <Activity size={17} />
                  <span>
                    위험도 {selectedRoad.risk}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="admin-road-analysis-score-box">
                <div>
                  <span>도로 위험 분석 점수</span>
                  <strong>{selectedRoad.score}</strong>
                  <small>/ 100</small>
                </div>

                <div className="admin-road-analysis-score-track">
                  <div
                    style={{
                      width: `${selectedRoad.score}%`,
                    }}
                  />
                </div>
              </div>

              {/* Analysis */}
              <div className="admin-road-analysis-detail-section">
                <h3>
                  <Brain size={16} />
                  AI 파손 원인 분석
                </h3>

                <div className="admin-road-analysis-primary-cause">
                  <div className="admin-road-analysis-primary-cause-icon">
                    <Brain size={18} />
                  </div>

                  <div>
                    <span>가장 가능성이 높은 원인</span>
                    <strong>{selectedRoad.cause}</strong>
                  </div>

                  <b>높음</b>
                </div>

                <p className="admin-road-analysis-explanation">
                  최근 신고 데이터와 파손 유형, 발생 빈도,
                  위험도 분포를 종합 분석한 결과
                  <strong>
                    {' '}
                    {selectedRoad.cause}
                  </strong>
                  가 해당 도로의 주요 파손 원인으로
                  추정됩니다.
                </p>
              </div>

              {/* Damage distribution */}
              <div className="admin-road-analysis-detail-section">
                <h3>
                  <BarChart3 size={16} />
                  파손 위험도 분포
                </h3>

                <div className="admin-road-analysis-distribution">
                  <div>
                    <span>높음</span>
                    <div>
                      <i
                        className="high"
                        style={{
                          width: `${
                            (selectedRoad.high /
                              selectedRoad.reports) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <strong>
                      {selectedRoad.high}건
                    </strong>
                  </div>

                  <div>
                    <span>보통</span>
                    <div>
                      <i
                        className="mid"
                        style={{
                          width: `${
                            (selectedRoad.mid /
                              selectedRoad.reports) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <strong>
                      {selectedRoad.mid}건
                    </strong>
                  </div>

                  <div>
                    <span>낮음</span>
                    <div>
                      <i
                        className="low"
                        style={{
                          width: `${
                            (selectedRoad.low /
                              selectedRoad.reports) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <strong>
                      {selectedRoad.low}건
                    </strong>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="admin-road-analysis-recommendation">
                <div>
                  <AlertTriangle size={17} />
                  <strong>관리 권고</strong>
                </div>

                <p>
                  해당 도로는 파손 신고가 반복적으로
                  발생하고 있어 정기적인 현장 점검과
                  우선적인 보수 검토가 필요합니다.
                </p>
              </div>
            </div>

            <div className="admin-road-analysis-modal-footer">
              <button
                onClick={() => setSelectedRoad(null)}
              >
                닫기
              </button>

              <button
                className="primary"
                onClick={() => {
                  navigate('/admin/reports', {
                    state: {
                      road: selectedRoad.road,
                    },
                  });
                }}
              >
                관련 신고 보기
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRoadAnalysis;