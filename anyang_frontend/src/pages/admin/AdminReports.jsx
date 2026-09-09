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
  CircleDot,
  Construction,
  Signpost,
  AlertTriangle,
  Clock3,
  Wrench,
  CheckCircle2,
  SlidersHorizontal,
  X,
  MapPin,
  CalendarDays,
  User,
} from 'lucide-react';

import './AdminReports.css';


/* =========================
   신고 목업 데이터
========================= */

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
    description:
      '도로 우측에 작은 포트홀이 발생했습니다.',
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
    description:
      '도로 표면에 작은 균열이 확인됩니다.',
    aiConfidence: 86.7,
  },
  {
    id: 7,
    type: 'pothole',
    typeLabel: '포트홀',
    severity: 'high',
    severityLabel: '높음',
    status: 'progress',
    statusLabel: '처리 중',
    address: '동안구 흥안대로 33',
    reportedAt: '2026-09-05 15:12',
    reporter: '오준서',
    description:
      '차량 통행이 많은 구간에 깊은 포트홀이 발견되었습니다.',
    aiConfidence: 97.3,
  },
  {
    id: 8,
    type: 'sign',
    typeLabel: '표지판 파손',
    severity: 'mid',
    severityLabel: '보통',
    status: 'received',
    statusLabel: '접수 대기',
    address: '동안구 평촌대로 301',
    reportedAt: '2026-09-05 09:25',
    reporter: '임하은',
    description:
      '도로 안내 표지판이 심하게 기울어져 있습니다.',
    aiConfidence: 89.6,
  },
  {
    id: 9,
    type: 'manhole',
    typeLabel: '맨홀/시설물',
    severity: 'high',
    severityLabel: '높음',
    status: 'received',
    statusLabel: '접수 대기',
    address: '만안구 안양로 88',
    reportedAt: '2026-09-04 17:42',
    reporter: '강현우',
    description:
      '맨홀 주변의 도로가 파손되어 차량 주행에 위험이 있습니다.',
    aiConfidence: 95.8,
  },
  {
    id: 10,
    type: 'crack',
    typeLabel: '노면 균열',
    severity: 'mid',
    severityLabel: '보통',
    status: 'progress',
    statusLabel: '처리 중',
    address: '동안구 관평로 54',
    reportedAt: '2026-09-04 13:08',
    reporter: '윤지민',
    description:
      '도로 중앙에 여러 갈래의 균열이 확인됩니다.',
    aiConfidence: 92.4,
  },
  {
    id: 11,
    type: 'pothole',
    typeLabel: '포트홀',
    severity: 'low',
    severityLabel: '낮음',
    status: 'done',
    statusLabel: '처리 완료',
    address: '만안구 예술공원로 31',
    reportedAt: '2026-09-03 11:22',
    reporter: '서지우',
    description:
      '도로 가장자리에 작은 포트홀이 발견되었습니다.',
    aiConfidence: 84.9,
  },
  {
    id: 12,
    type: 'sign',
    typeLabel: '표지판 파손',
    severity: 'high',
    severityLabel: '높음',
    status: 'done',
    statusLabel: '처리 완료',
    address: '동안구 시민대로 188',
    reportedAt: '2026-09-02 16:17',
    reporter: '김도현',
    description:
      '차량 통행 방향을 안내하는 표지판이 파손되었습니다.',
    aiConfidence: 93.2,
  },
];


/* =========================
   유형
========================= */

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


/* =========================
   상태
========================= */

const STATUS_META = {
  received: {
    label: '접수 대기',
    icon: Clock3,
    className: 'received',
  },
  progress: {
    label: '처리 중',
    icon: Wrench,
    className: 'progress',
  },
  done: {
    label: '처리 완료',
    icon: CheckCircle2,
    className: 'done',
  },
};


/* =========================
   위험도
========================= */

const SEVERITY_META = {
  low: {
    label: '낮음',
    className: 'low',
  },
  mid: {
    label: '보통',
    className: 'mid',
  },
  high: {
    label: '높음',
    className: 'high',
  },
};


function AdminReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState(REPORTS);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const [selectedReport, setSelectedReport] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);


  /* =========================
     통계
  ========================== */

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

      high: reports.filter(
        (report) => report.severity === 'high'
      ).length,
    };
  }, [reports]);


  /* =========================
     필터링
  ========================== */

  const filteredReports = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return reports.filter((report) => {

      const matchesSearch =
        !keyword ||
        report.address.toLowerCase().includes(keyword) ||
        report.reporter.toLowerCase().includes(keyword) ||
        report.typeLabel.toLowerCase().includes(keyword) ||
        String(report.id).includes(keyword);

      const matchesStatus =
        statusFilter === 'all' ||
        report.status === statusFilter;

      const matchesType =
        typeFilter === 'all' ||
        report.type === typeFilter;

      const matchesSeverity =
        severityFilter === 'all' ||
        report.severity === severityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesSeverity
      );
    });
  }, [
    reports,
    searchKeyword,
    statusFilter,
    typeFilter,
    severityFilter,
  ]);


  /* =========================
     상태 변경
  ========================== */

  const handleStatusChange = (id, nextStatus) => {

    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              status: nextStatus,
              statusLabel:
                STATUS_META[nextStatus].label,
            }
          : report
      )
    );

    setSelectedReport((prev) =>
      prev
        ? {
            ...prev,
            status: nextStatus,
            statusLabel:
              STATUS_META[nextStatus].label,
          }
        : null
    );
  };


  /* =========================
     필터 초기화
  ========================== */

  const resetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSeverityFilter('all');
  };


  /* =========================
     상세 페이지 이동
  ========================== */

  const openDetail = (report) => {
    navigate('/admin/reports/detail', {
      state: {
        report,
      },
    });
  };


  return (
    <div className="admin-reports-page">

    

      {/* =========================
          Main
      ========================== */}

      <main className="admin-reports-content">

        {/* 상단 */}
        <header className="admin-reports-topbar">

          <div>
            <h1>신고 관리</h1>

            <p>
              접수된 도로 파손 신고 내역을 확인하고
              처리 상태를 관리합니다.
            </p>
          </div>

          <div className="admin-reports-date">
            2026년 9월 9일
          </div>

        </header>


        {/* =========================
            통계
        ========================== */}

        <section className="admin-reports-stats">

          <div className="admin-reports-stat-card">

            <div className="admin-reports-stat-icon blue">
              <FileWarning size={19} />
            </div>

            <div>
              <span>전체 신고</span>
              <strong>{stats.total}</strong>
            </div>

          </div>


          <div className="admin-reports-stat-card">

            <div className="admin-reports-stat-icon gray">
              <Clock3 size={19} />
            </div>

            <div>
              <span>접수 대기</span>
              <strong>{stats.received}</strong>
            </div>

          </div>


          <div className="admin-reports-stat-card">

            <div className="admin-reports-stat-icon orange">
              <Wrench size={19} />
            </div>

            <div>
              <span>처리 중</span>
              <strong>{stats.progress}</strong>
            </div>

          </div>


          <div className="admin-reports-stat-card">

            <div className="admin-reports-stat-icon green">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>처리 완료</span>
              <strong>{stats.done}</strong>
            </div>

          </div>

        </section>


        {/* =========================
            신고 목록 카드
        ========================== */}

        <section className="admin-reports-card">

          {/* 카드 헤더 */}
          <div className="admin-reports-card-header">

            <div>
              <h2>전체 신고 내역</h2>

              <p>
                총 {filteredReports.length}건의 신고가 조회되었습니다.
              </p>
            </div>


            <div className="admin-reports-actions">

              <div className="admin-reports-search">

                <Search size={17} />

                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) =>
                    setSearchKeyword(e.target.value)
                  }
                  placeholder="주소, 신고자, 유형, 신고번호 검색"
                />

              </div>


              <button
                className={`admin-filter-button ${
                  filterOpen ? 'active' : ''
                }`}
                onClick={() =>
                  setFilterOpen(!filterOpen)
                }
              >
                <SlidersHorizontal size={16} />
                필터
              </button>

            </div>

          </div>


          {/* =========================
              필터 패널
          ========================== */}

          {filterOpen && (

            <div className="admin-report-filter-panel">

              <div className="admin-report-filter-group">

                <span>처리 상태</span>

                <div>
                  {[
                    ['all', '전체'],
                    ['received', '접수 대기'],
                    ['progress', '처리 중'],
                    ['done', '처리 완료'],
                  ].map(([key, label]) => (

                    <button
                      key={key}
                      className={
                        statusFilter === key
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        setStatusFilter(key)
                      }
                    >
                      {label}
                    </button>

                  ))}
                </div>

              </div>


              <div className="admin-report-filter-group">

                <span>파손 유형</span>

                <div>
                  <button
                    className={
                      typeFilter === 'all'
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      setTypeFilter('all')
                    }
                  >
                    전체
                  </button>

                  {Object.entries(TYPE_META).map(
                    ([key, value]) => (
                      <button
                        key={key}
                        className={
                          typeFilter === key
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setTypeFilter(key)
                        }
                      >
                        {value.label}
                      </button>
                    )
                  )}
                </div>

              </div>


              <div className="admin-report-filter-group">

                <span>위험도</span>

                <div>
                  <button
                    className={
                      severityFilter === 'all'
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      setSeverityFilter('all')
                    }
                  >
                    전체
                  </button>

                  {Object.entries(SEVERITY_META).map(
                    ([key, value]) => (
                      <button
                        key={key}
                        className={
                          severityFilter === key
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setSeverityFilter(key)
                        }
                      >
                        {value.label}
                      </button>
                    )
                  )}
                </div>

              </div>


              <button
                className="admin-filter-reset"
                onClick={resetFilters}
              >
                <X size={14} />
                필터 초기화
              </button>

            </div>

          )}


          {/* =========================
              테이블
          ========================== */}

          <div className="admin-reports-table-wrap">

            <table className="admin-reports-table">

              <thead>
                <tr>
                  <th>신고 번호</th>
                  <th>파손 유형</th>
                  <th>위험도</th>
                  <th>신고 위치</th>
                  <th>신고자</th>
                  <th>신고 일시</th>
                  <th>AI 신뢰도</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>


              <tbody>

                {filteredReports.length > 0 ? (

                  filteredReports.map((report) => {

                    const TypeIcon =
                      TYPE_META[report.type]?.icon ||
                      FileWarning;

                    const statusInfo =
                      STATUS_META[report.status];

                    return (
                      <tr
                        key={report.id}
                        onClick={() =>
                          openDetail(report)
                        }
                      >

                        {/* 번호 */}
                        <td>
                          <span className="report-number">
                            #{String(report.id).padStart(4, '0')}
                          </span>
                        </td>


                        {/* 유형 */}
                        <td>

                          <div className="report-type">

                            <div className="report-type-icon">
                              <TypeIcon size={15} />
                            </div>

                            <span>
                              {report.typeLabel}
                            </span>

                          </div>

                        </td>


                        {/* 위험도 */}
                        <td>

                          <span
                            className={`report-severity ${
                              report.severity
                            }`}
                          >
                            {report.severityLabel}
                          </span>

                        </td>


                        {/* 위치 */}
                        <td>

                          <div className="report-address">

                            <MapPin size={13} />

                            <span>
                              {report.address}
                            </span>

                          </div>

                        </td>


                        {/* 신고자 */}
                        <td>
                          {report.reporter}
                        </td>


                        {/* 날짜 */}
                        <td>

                          <div className="report-date">

                            <CalendarDays size={13} />

                            <span>
                              {report.reportedAt}
                            </span>

                          </div>

                        </td>


                        {/* AI */}
                        <td>

                          <span className="report-confidence">
                            {report.aiConfidence}%
                          </span>

                        </td>


                        {/* 상태 */}
                        <td>

                          <span
                            className={`report-status ${statusInfo.className}`}
                          >
                            <statusInfo.icon size={13} />
                            {statusInfo.label}
                          </span>

                        </td>


                        {/* 상세 */}
                        <td>

                          <button
                            className="report-detail-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(report);
                            }}
                          >
                            <ChevronRight size={17} />
                          </button>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>
                    <td
                      colSpan="9"
                      className="admin-reports-empty"
                    >
                      <FileWarning size={32} />

                      <strong>
                        신고 내역이 없습니다.
                      </strong>

                      <span>
                        검색어나 필터 조건을 변경해보세요.
                      </span>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* =========================
          신고 간단 상세 모달
          - 필요하면 제거 가능
      ========================== */}

      {selectedReport && (

        <div
          className="admin-report-modal-overlay"
          onClick={() =>
            setSelectedReport(null)
          }
        >

          <div
            className="admin-report-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-report-modal-header">

              <div>
                <span>신고 상세</span>

                <strong>
                  #{String(selectedReport.id).padStart(4, '0')}
                </strong>
              </div>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                <X size={19} />
              </button>

            </div>


            <div className="admin-report-modal-body">

              <div className="admin-report-modal-item">
                <span>파손 유형</span>
                <strong>
                  {selectedReport.typeLabel}
                </strong>
              </div>

              <div className="admin-report-modal-item">
                <span>위험도</span>
                <strong>
                  {selectedReport.severityLabel}
                </strong>
              </div>

              <div className="admin-report-modal-item">
                <span>신고 위치</span>
                <strong>
                  {selectedReport.address}
                </strong>
              </div>

              <div className="admin-report-modal-item">
                <span>신고자</span>
                <strong>
                  {selectedReport.reporter}
                </strong>
              </div>

              <div className="admin-report-modal-item">
                <span>AI 신뢰도</span>
                <strong className="blue">
                  {selectedReport.aiConfidence}%
                </strong>
              </div>

            </div>


            <div className="admin-report-modal-status">

              <span>처리 상태</span>

              <div>
                {Object.entries(STATUS_META).map(
                  ([key, value]) => {

                    const Icon = value.icon;

                    return (
                      <button
                        key={key}
                        className={
                          selectedReport.status === key
                            ? `active ${value.className}`
                            : ''
                        }
                        onClick={() =>
                          handleStatusChange(
                            selectedReport.id,
                            key
                          )
                        }
                      >
                        <Icon size={14} />
                        {value.label}
                      </button>
                    );
                  }
                )}
              </div>

            </div>


            <div className="admin-report-modal-footer">

              <button
                className="admin-report-modal-detail"
                onClick={() =>
                  openDetail(selectedReport)
                }
              >
                신고 상세 페이지
                <ChevronRight size={16} />
              </button>

              <button
                className="admin-report-modal-close"
                onClick={() =>
                  setSelectedReport(null)
                }
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

export default AdminReports;