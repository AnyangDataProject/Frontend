import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  FileWarning,
  Brain,
  ShieldAlert,
  CheckCircle2,
  Clock3,
  Wrench,
  Image as ImageIcon,
  Save,
  Building2,
} from 'lucide-react';

import './AdminReportDetail.css';

const TYPE_META = {
  pothole: {
    label: '포트홀',
  },
  crack: {
    label: '노면 균열',
  },
  sign: {
    label: '표지판 파손',
  },
  manhole: {
    label: '맨홀/시설물',
  },
};

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

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=1200&q=80';

function AdminReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [report, setReport] = useState(location.state?.report || null);

  const [status, setStatus] = useState(
    location.state?.report?.status || 'received'
  );

  const [memo, setMemo] = useState(
    '현장 확인 후 보수 작업이 필요합니다.'
  );

  useEffect(() => {
    if (!location.state?.report) {
      navigate('/admin/reports', { replace: true });
    }
  }, [location.state, navigate]);

  if (!report) {
    return null;
  }

  const typeInfo =
    TYPE_META[report.type] || {
      label: report.typeLabel || '기타',
    };

  const severityInfo =
    SEVERITY_META[report.severity] || {
      label: report.severityLabel || '미정',
      className: '',
    };

  const statusInfo =
    STATUS_META[status] || STATUS_META.received;

  const StatusIcon = statusInfo.icon;

  const handleStatusChange = (nextStatus) => {
    setStatus(nextStatus);

    setReport((prev) => ({
      ...prev,
      status: nextStatus,
      statusLabel: STATUS_META[nextStatus].label,
    }));
  };

  const handleSave = () => {
    // TODO: 추후 백엔드 API 연결
    console.log('신고 처리 저장:', {
      reportId: report.id,
      status,
      memo,
    });

    alert('신고 처리 내용이 저장되었습니다.');
  };

  return (
    <div className="admin-detail-page">

      {/* 상단 */}
      <header className="admin-detail-header">
        <div className="admin-detail-header-inner">

          <button
            className="admin-detail-back"
            onClick={() => navigate('/admin/reports')}
          >
            <ArrowLeft size={18} />
            신고 관리
          </button>

          <div className="admin-detail-header-title">
            <span>신고 상세</span>
            <strong>#{String(report.id).padStart(4, '0')}</strong>
          </div>

        </div>
      </header>


      <main className="admin-detail-main">

        {/* 페이지 타이틀 */}
        <section className="admin-detail-page-title">

          <div>
            <div className="admin-detail-eyebrow">
              ROAD DAMAGE REPORT
            </div>

            <h1>신고 상세 정보</h1>

            <p>
              시민 신고 내용과 AI 분석 결과를 확인하고
              처리 상태를 관리할 수 있습니다.
            </p>
          </div>

          <div
            className={`admin-detail-current-status ${statusInfo.className}`}
          >
            <StatusIcon size={17} />
            {statusInfo.label}
          </div>

        </section>


        <div className="admin-detail-grid">

          {/* =========================
              왼쪽
          ========================== */}
          <div className="admin-detail-left">

            {/* 신고 이미지 */}
            <section className="admin-detail-card image-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon">
                  <ImageIcon size={18} />
                </div>

                <div>
                  <h2>신고 이미지</h2>
                  <p>시민이 신고 당시 첨부한 이미지입니다.</p>
                </div>
              </div>

              <div className="admin-report-image">
                <img
                  src={report.image || DEFAULT_IMAGE}
                  alt="신고 이미지"
                />
              </div>

            </section>


            {/* AI 분석 */}
            <section className="admin-detail-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon ai">
                  <Brain size={18} />
                </div>

                <div>
                  <h2>AI 분석 결과</h2>
                  <p>
                    이미지 분석을 통해 도로 파손 유형과 위험도를
                    판별한 결과입니다.
                  </p>
                </div>
              </div>


              <div className="ai-result-grid">

                <div className="ai-result-item">
                  <span className="ai-result-label">
                    감지 유형
                  </span>

                  <strong>
                    {typeInfo.label}
                  </strong>
                </div>


                <div className="ai-result-item">
                  <span className="ai-result-label">
                    AI 신뢰도
                  </span>

                  <strong className="confidence-value">
                    {report.aiConfidence || 0}%
                  </strong>
                </div>


                <div className="ai-result-item">
                  <span className="ai-result-label">
                    위험도
                  </span>

                  <span
                    className={`admin-severity-badge ${severityInfo.className}`}
                  >
                    <ShieldAlert size={14} />
                    {severityInfo.label}
                  </span>
                </div>

              </div>


              {/* 신뢰도 */}
              <div className="confidence-section">

                <div className="confidence-header">
                  <span>AI 분석 신뢰도</span>
                  <strong>
                    {report.aiConfidence || 0}%
                  </strong>
                </div>

                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${report.aiConfidence || 0}%`,
                    }}
                  />
                </div>

                <p>
                  AI 분석 결과를 참고하여 실제 현장 확인 후
                  최종 처리 여부를 결정해주세요.
                </p>

              </div>

            </section>


            {/* 신고 내용 */}
            <section className="admin-detail-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon">
                  <FileWarning size={18} />
                </div>

                <div>
                  <h2>신고 내용</h2>
                  <p>시민이 작성한 신고 상세 내용입니다.</p>
                </div>
              </div>

              <div className="report-description">
                {report.description || '작성된 신고 내용이 없습니다.'}
              </div>

            </section>

          </div>


          {/* =========================
              오른쪽
          ========================== */}
          <div className="admin-detail-right">

            {/* 신고 기본 정보 */}
            <section className="admin-detail-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon">
                  <FileWarning size={18} />
                </div>

                <div>
                  <h2>신고 기본 정보</h2>
                  <p>신고 접수 정보를 확인합니다.</p>
                </div>
              </div>


              <div className="report-info-list">

                <div className="report-info-row">
                  <div className="report-info-label">
                    <FileWarning size={16} />
                    신고 번호
                  </div>

                  <strong>
                    #{String(report.id).padStart(4, '0')}
                  </strong>
                </div>


                <div className="report-info-row">
                  <div className="report-info-label">
                    <FileWarning size={16} />
                    파손 유형
                  </div>

                  <strong>
                    {typeInfo.label}
                  </strong>
                </div>


                <div className="report-info-row">
                  <div className="report-info-label">
                    <ShieldAlert size={16} />
                    위험도
                  </div>

                  <span
                    className={`admin-severity-badge ${severityInfo.className}`}
                  >
                    {severityInfo.label}
                  </span>
                </div>


                <div className="report-info-row">
                  <div className="report-info-label">
                    <MapPin size={16} />
                    신고 위치
                  </div>

                  <strong className="address-text">
                    {report.address}
                  </strong>
                </div>


                <div className="report-info-row">
                  <div className="report-info-label">
                    <User size={16} />
                    신고자
                  </div>

                  <strong>
                    {report.reporter}
                  </strong>
                </div>


                <div className="report-info-row">
                  <div className="report-info-label">
                    <CalendarDays size={16} />
                    신고 일시
                  </div>

                  <strong>
                    {report.reportedAt}
                  </strong>
                </div>

              </div>

            </section>


            {/* 위치 */}
            <section className="admin-detail-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <h2>신고 위치</h2>
                  <p>파손 신고가 접수된 위치입니다.</p>
                </div>
              </div>


              <div className="admin-map-placeholder">

                <div className="fake-map-grid"></div>

                <div className="map-pin">
                  <MapPin size={26} />
                </div>

                <div className="map-address">
                  <MapPin size={15} />
                  {report.address}
                </div>

              </div>

            </section>


            {/* 처리 상태 */}
            <section className="admin-detail-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon">
                  <Wrench size={18} />
                </div>

                <div>
                  <h2>처리 상태 관리</h2>
                  <p>현재 신고 처리 상태를 변경합니다.</p>
                </div>
              </div>


              <div className="status-selector">

                {Object.entries(STATUS_META).map(
                  ([key, value]) => {
                    const Icon = value.icon;

                    return (
                      <button
                        key={key}
                        className={`status-option ${
                          status === key ? 'active' : ''
                        } ${value.className}`}
                        onClick={() =>
                          handleStatusChange(key)
                        }
                      >
                        <Icon size={17} />

                        <span>
                          {value.label}
                        </span>
                      </button>
                    );
                  }
                )}

              </div>


              <div className="admin-memo">

                <label htmlFor="adminMemo">
                  관리자 처리 메모
                </label>

                <textarea
                  id="adminMemo"
                  value={memo}
                  onChange={(e) =>
                    setMemo(e.target.value)
                  }
                  placeholder="현장 확인 내용이나 처리 내용을 입력해주세요."
                  rows={5}
                />

              </div>


              <button
                className="admin-save-button"
                onClick={handleSave}
              >
                <Save size={17} />
                처리 내용 저장
              </button>

            </section>


            {/* 담당 부서 */}
            <section className="admin-detail-card department-card">

              <div className="admin-card-title">
                <div className="admin-card-title-icon">
                  <Building2 size={18} />
                </div>

                <div>
                  <h2>담당 부서</h2>
                  <p>신고 처리를 담당하는 부서입니다.</p>
                </div>
              </div>

              <div className="department-box">
                <strong>안양시 도로관리과</strong>
                <span>도로시설관리팀</span>
              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminReportDetail;