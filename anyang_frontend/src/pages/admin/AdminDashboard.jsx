import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileWarning,
  Users,
  MessageSquare,
  LogOut,
  Search,
  ChevronRight,
  Clock3,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
  Construction,
  Signpost,
  MoreHorizontal,
  MapPin,
  CalendarDays,
  User,
  X,
} from 'lucide-react';
import './AdminDashboard.css';

const REPORTS = [
  {
    id: 1,
    type: 'pothole',
    typeLabel: '포트홀',
    severity: 'high',
    severityLabel: '높음',
    status: 'received',
    statusLabel: '접수 대기',
    address: '동안구 평촌대로 123',
    reportedAt: '2026-09-08 14:32',
    reporter: '김민준',
    description:
      '차량 통행이 많은 도로에 큰 포트홀이 발생해 차량 주행 시 위험해 보입니다.',
    aiConfidence: 94.2,
  },
  {
    id: 2,
    type: 'crack',
    typeLabel: '노면 균열',
    severity: 'mid',
    severityLabel: '보통',
    status: 'progress',
    statusLabel: '처리 중',
    address: '동안구 시민대로 45',
    reportedAt: '2026-09-08 11:18',
    reporter: '이서연',
    description:
      '도로 중앙 부분에 길게 균열이 발생했습니다. 균열이 점점 넓어지는 것 같습니다.',
    aiConfidence: 91.8,
  },
  {
    id: 3,
    type: 'sign',
    typeLabel: '표지판 파손',
    severity: 'low',
    severityLabel: '낮음',
    status: 'done',
    statusLabel: '처리 완료',
    address: '만안구 안양로 210',
    reportedAt: '2026-09-07 16:45',
    reporter: '박지훈',
    description:
      '도로 옆 안내 표지판이 기울어져 있어 정비가 필요해 보입니다.',
    aiConfidence: 88.5,
  },
  {
    id: 4,
    type: 'manhole',
    typeLabel: '맨홀/시설물',
    severity: 'high',
    severityLabel: '높음',
    status: 'progress',
    statusLabel: '처리 중',
    address: '동안구 관악대로 77',
    reportedAt: '2026-09-07 10:21',
    reporter: '정도윤',
    description:
      '맨홀 주변 도로가 내려앉아 차량이 지나갈 때 충격이 발생합니다.',
    aiConfidence: 96.1,
  },
  {
    id: 5,
    type: 'pothole',
    typeLabel: '포트홀',
    severity: 'mid',
    severityLabel: '보통',
    status: 'received',
    statusLabel: '접수 대기',
    address: '만안구 삼덕로 8',
    reportedAt: '2026-09-06 18:02',
    reporter: '최유리',
    description: '도로 우측에 작은 포트홀이 발생했습니다.',
    aiConfidence: 90.4,
  },
  {
    id: 6,
    type: 'crack',
    typeLabel: '노면 균열',
    severity: 'low',
    severityLabel: '낮음',
    status: 'done',
    statusLabel: '처리 완료',
    address: '만안구 병목안로 19',
    reportedAt: '2026-09-06 09:40',
    reporter: '한소율',
    description: '도로 표면에 작은 균열이 확인됩니다.',
    aiConfidence: 86.7,
  },
];

const TYPE_META = {
  pothole: {
    label: '포트홀',
    icon: CircleDot,
  },
  crack: {
    label: '노면 균열',
    icon: Construction,
  },
  sign: {
    label: '표지판 파손',
    icon: Signpost,
  },
  manhole: {
    label: '맨홀/시설물',
    icon: AlertTriangle,
  },
};

const STATUS_META = {
  received: {
    label: '접수 대기',
    icon: Clock3,
  },
  progress: {
    label: '처리 중',
    icon: Wrench,
  },
  done: {
    label: '처리 완료',
    icon: CheckCircle2,
  },
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState(REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => {
    return {
      total: reports.length,
      received: reports.filter(
        (report) => report.status === 'received'
      ).length,
      progress: reports.filter(
        (report) => report.status === 'progress'
      ).length,
      done: reports.filter(
        (report) => report.status === 'done'
      ).length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus =
        statusFilter === 'all' ||
        report.status === statusFilter;

      const keyword = searchKeyword.toLowerCase();

      const matchesSearch =
        !keyword ||
        report.address.toLowerCase().includes(keyword) ||
        report.reporter.toLowerCase().includes(keyword) ||
        report.typeLabel.toLowerCase().includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [reports, statusFilter, searchKeyword]);

  const typeStats = useMemo(() => {
    return Object.entries(TYPE_META).map(([key, value]) => ({
      key,
      label: value.label,
      count: reports.filter((report) => report.type === key).length,
    }));
  }, [reports]);

  const maxTypeCount = Math.max(
    ...typeStats.map((item) => item.count),
    1
  );

  const handleStatusChange = (id, status) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              status,
              statusLabel: STATUS_META[status].label,
            }
          : report
      )
    );

    setSelectedReport((prev) =>
      prev
        ? {
            ...prev,
            status,
            statusLabel: STATUS_META[status].label,
          }
        : null
    );
  };

  return (
    <div className="admin-page">

      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <h1>대시보드</h1>
            <p>
              안양시 도로파손 신고 및 처리 현황을 확인하세요.
            </p>
          </div>

          <div className="admin-top-date">
            <CalendarDays size={16} />
            2026년 9월 9일
          </div>
        </header>

        {/* =========================
            Statistics
        ========================= */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon total">
              <FileWarning size={21} />
            </div>

            <div className="admin-stat-content">
              <span>전체 신고</span>
              <strong>{stats.total}</strong>
            </div>

            <span className="admin-stat-label">
              전체
            </span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon received">
              <Clock3 size={21} />
            </div>

            <div className="admin-stat-content">
              <span>접수 대기</span>
              <strong>{stats.received}</strong>
            </div>

            <span className="admin-stat-label warning">
              확인 필요
            </span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon progress">
              <Wrench size={21} />
            </div>

            <div className="admin-stat-content">
              <span>처리 중</span>
              <strong>{stats.progress}</strong>
            </div>

            <span className="admin-stat-label">
              진행 중
            </span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon done">
              <CheckCircle2 size={21} />
            </div>

            <div className="admin-stat-content">
              <span>처리 완료</span>
              <strong>{stats.done}</strong>
            </div>

            <span className="admin-stat-label success">
              완료
            </span>
          </div>

        </section>

        {/* =========================
            Analytics
        ========================= */}
        <section className="admin-analytics">

          {/* 유형별 신고 */}
          <div className="admin-panel type-panel">

            <div className="admin-panel-header">
              <div>
                <h2>파손 유형별 신고</h2>
                <p>현재 접수된 신고 유형입니다.</p>
              </div>

              <button
                onClick={() => navigate('/admin/reports')}
              >
                전체 보기
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="type-chart">

              {typeStats.map((item) => {
                const Icon = TYPE_META[item.key].icon;

                return (
                  <div
                    className="type-chart-row"
                    key={item.key}
                  >
                    <div className="type-chart-label">
                      <div className="type-chart-icon">
                        <Icon size={17} />
                      </div>

                      <span>{item.label}</span>
                    </div>

                    <div className="type-chart-bar-wrap">
                      <div className="type-chart-bar-bg">
                        <div
                          className="type-chart-bar"
                          style={{
                            width: `${
                              (item.count / maxTypeCount) * 100
                            }%`,
                          }}
                        />
                      </div>

                      <strong>{item.count}</strong>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>

          {/* 심각도 */}
          <div className="admin-panel severity-panel">

            <div className="admin-panel-header">
              <div>
                <h2>위험도 현황</h2>
                <p>AI 분석 기준 위험도입니다.</p>
              </div>
            </div>

            <div className="severity-list">

              <div className="severity-item">
                <div className="severity-dot high"></div>

                <span>높음</span>

                <strong>
                  {
                    reports.filter(
                      (report) => report.severity === 'high'
                    ).length
                  }
                </strong>
              </div>

              <div className="severity-item">
                <div className="severity-dot mid"></div>

                <span>보통</span>

                <strong>
                  {
                    reports.filter(
                      (report) => report.severity === 'mid'
                    ).length
                  }
                </strong>
              </div>

              <div className="severity-item">
                <div className="severity-dot low"></div>

                <span>낮음</span>

                <strong>
                  {
                    reports.filter(
                      (report) => report.severity === 'low'
                    ).length
                  }
                </strong>
              </div>

            </div>

            <div className="admin-risk-notice">
              <AlertTriangle size={17} />

              <span>
                높은 위험도의 신고를 우선적으로 확인해주세요.
              </span>
            </div>

          </div>

        </section>

        {/* =========================
            Recent Reports
        ========================= */}
        <section className="admin-panel reports-panel">

          <div className="admin-panel-header reports-header">

            <div>
              <h2>최근 신고 현황</h2>
              <p>
                시민이 최근 등록한 도로파손 신고입니다.
              </p>
            </div>

            <button
              className="admin-more-button"
              onClick={() => navigate('/admin/reports')}
            >
              신고 관리
              <ChevronRight size={16} />
            </button>

          </div>

          {/* Filters */}
          <div className="admin-report-toolbar">

            <div className="admin-search">
              <Search size={17} />

              <input
                type="text"
                value={searchKeyword}
                onChange={(e) =>
                  setSearchKeyword(e.target.value)
                }
                placeholder="주소, 신고자, 유형 검색"
              />
            </div>

            <div className="admin-filter-buttons">

              <button
                className={
                  statusFilter === 'all'
                    ? 'active'
                    : ''
                }
                onClick={() => setStatusFilter('all')}
              >
                전체
              </button>

              <button
                className={
                  statusFilter === 'received'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setStatusFilter('received')
                }
              >
                접수 대기
              </button>

              <button
                className={
                  statusFilter === 'progress'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setStatusFilter('progress')
                }
              >
                처리 중
              </button>

              <button
                className={
                  statusFilter === 'done'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setStatusFilter('done')}
              >
                완료
              </button>

            </div>

          </div>

          {/* Table */}
          <div className="admin-table-wrap">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>신고 번호</th>
                  <th>유형</th>
                  <th>위험도</th>
                  <th>신고 위치</th>
                  <th>신고자</th>
                  <th>신고 일시</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {filteredReports.map((report) => {
                  const StatusIcon =
                    STATUS_META[report.status].icon;

                  return (
                    <tr
                      key={report.id}
                      onClick={() =>
                        setSelectedReport(report)
                      }
                    >
                      <td>
                        <strong>
                          #{String(report.id).padStart(4, '0')}
                        </strong>
                      </td>

                      <td>
                        <div className="report-type">
                          {report.typeLabel}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`severity-badge ${report.severity}`}
                        >
                          {report.severityLabel}
                        </span>
                      </td>

                      <td>
                        <div className="report-address">
                          <MapPin size={14} />
                          {report.address}
                        </div>
                      </td>

                      <td>
                        <div className="report-user">
                          <User size={14} />
                          {report.reporter}
                        </div>
                      </td>

                      <td>
                        <span className="report-date">
                          {report.reportedAt}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${report.status}`}
                        >
                          <StatusIcon size={13} />
                          {report.statusLabel}
                        </span>
                      </td>

                      <td>
                        <button
                          className="report-more"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

            {filteredReports.length === 0 && (
              <div className="admin-empty">
                검색 결과가 없습니다.
              </div>
            )}

          </div>

        </section>

      </main>

      {/* =========================
          Detail Modal
      ========================= */}
      {selectedReport && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="admin-modal-header">
              <div>
                <span>
                  신고 #{String(selectedReport.id).padStart(4, '0')}
                </span>

                <h2>{selectedReport.typeLabel}</h2>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">

              <div className="modal-info-grid">

                <div>
                  <span>신고 위치</span>
                  <strong>
                    <MapPin size={15} />
                    {selectedReport.address}
                  </strong>
                </div>

                <div>
                  <span>신고자</span>
                  <strong>
                    <User size={15} />
                    {selectedReport.reporter}
                  </strong>
                </div>

                <div>
                  <span>신고 일시</span>
                  <strong>
                    <CalendarDays size={15} />
                    {selectedReport.reportedAt}
                  </strong>
                </div>

                <div>
                  <span>AI 분석 신뢰도</span>
                  <strong className="ai-confidence">
                    {selectedReport.aiConfidence}%
                  </strong>
                </div>

              </div>

              <div className="modal-description">
                <h3>신고 내용</h3>
                <p>{selectedReport.description}</p>
              </div>

              <div className="modal-status">
                <h3>처리 상태</h3>

                <div className="modal-status-buttons">

                  <button
                    className={
                      selectedReport.status === 'received'
                        ? 'active received'
                        : ''
                    }
                    onClick={() =>
                      handleStatusChange(
                        selectedReport.id,
                        'received'
                      )
                    }
                  >
                    <Clock3 size={16} />
                    접수 대기
                  </button>

                  <button
                    className={
                      selectedReport.status === 'progress'
                        ? 'active progress'
                        : ''
                    }
                    onClick={() =>
                      handleStatusChange(
                        selectedReport.id,
                        'progress'
                      )
                    }
                  >
                    <Wrench size={16} />
                    처리 중
                  </button>

                  <button
                    className={
                      selectedReport.status === 'done'
                        ? 'active done'
                        : ''
                    }
                    onClick={() =>
                      handleStatusChange(
                        selectedReport.id,
                        'done'
                      )
                    }
                  >
                    <CheckCircle2 size={16} />
                    처리 완료
                  </button>

                </div>
              </div>

            </div>

            <div className="admin-modal-footer">

              <button
                className="modal-detail-button"
                onClick={() => {
                  setSelectedReport(null);

                  navigate('/admin/reports/detail', {
                    state: {
                      report: selectedReport,
                    },
                  });
                }}
              >
                신고 상세 보기
                <ChevronRight size={16} />
              </button>

              <button
                className="modal-close-button"
                onClick={() => setSelectedReport(null)}
              >
                닫기
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;