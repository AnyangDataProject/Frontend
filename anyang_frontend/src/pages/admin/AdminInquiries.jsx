import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileWarning,
  MessageSquare,
  Search,
  Filter,
  RotateCcw,
  ChevronRight,
  X,
  Clock3,
  CheckCircle2,
  FileText,
  Send,
} from 'lucide-react';

import './AdminInquiries.css';

const INQUIRIES = [
  {
    id: 1,
    type: 'report',
    typeLabel: '신고 관련 문의',
    title: '신고한 포트홀 처리가 언제 완료되나요?',
    content:
      '9월 8일에 평촌대로 123에 있는 포트홀을 신고했습니다. 현재 접수 대기 상태로 확인되는데 언제쯤 처리될 예정인지 궁금합니다.',
    reporter: '김민준',
    email: 'minjun@example.com',
    createdAt: '2026-09-09 09:32',
    status: 'waiting',
    statusLabel: '답변 대기',
    reportId: 1,
    address: '동안구 평촌대로 123',
    answer: '',
  },
  {
    id: 2,
    type: 'result',
    typeLabel: '처리 결과 문의',
    title: '처리 완료된 신고에 대한 문의입니다.',
    content:
      '제가 신고한 도로 균열이 처리 완료되었다고 나오는데 실제 현장에서는 아직 균열이 보입니다. 다시 확인해주실 수 있을까요?',
    reporter: '이서연',
    email: 'seoyeon@example.com',
    createdAt: '2026-09-08 16:21',
    status: 'waiting',
    statusLabel: '답변 대기',
    reportId: 2,
    address: '동안구 시민대로 45',
    answer: '',
  },
  {
    id: 3,
    type: 'service',
    typeLabel: '서비스 이용 문의',
    title: '신고 사진 업로드가 되지 않습니다.',
    content:
      '파손 신고를 하려고 사진을 업로드했는데 계속 업로드 오류가 발생합니다. 휴대폰에서도 동일한 문제가 발생합니다.',
    reporter: '박지훈',
    email: 'jihoon@example.com',
    createdAt: '2026-09-08 14:08',
    status: 'answered',
    statusLabel: '답변 완료',
    reportId: null,
    address: '',
    answer:
      '이용에 불편을 드려 죄송합니다. 사진 파일의 용량이 10MB를 초과하는 경우 업로드가 제한될 수 있습니다. 파일 용량을 확인하신 후 다시 시도해주시기 바랍니다.',
  },
  {
    id: 4,
    type: 'other',
    typeLabel: '기타 민원',
    title: '도로 파손 신고 위치를 수정하고 싶습니다.',
    content:
      '신고 과정에서 지도 위치를 잘못 선택했습니다. 이미 접수된 신고의 위치를 수정할 수 있는지 문의드립니다.',
    reporter: '최유리',
    email: 'yuri@example.com',
    createdAt: '2026-09-07 11:45',
    status: 'waiting',
    statusLabel: '답변 대기',
    reportId: 5,
    address: '만안구 삼덕로 8',
    answer: '',
  },
  {
    id: 5,
    type: 'report',
    typeLabel: '신고 관련 문의',
    title: '신고가 정상적으로 접수되었는지 확인해주세요.',
    content:
      '어제 도로 파손 신고를 제출했는데 내 신고현황에서 확인되지 않습니다. 정상적으로 접수된 것이 맞는지 확인 부탁드립니다.',
    reporter: '정도윤',
    email: 'doyoon@example.com',
    createdAt: '2026-09-06 17:12',
    status: 'answered',
    statusLabel: '답변 완료',
    reportId: 4,
    address: '동안구 관악대로 77',
    answer:
      '확인 결과 정상적으로 접수되었습니다. 현재 담당 부서에서 현장 확인 및 처리를 진행하고 있습니다.',
  },
  {
    id: 6,
    type: 'result',
    typeLabel: '처리 결과 문의',
    title: '도로 보수 후에도 문제가 남아 있습니다.',
    content:
      '처리 완료로 표시되어 있는데 해당 구간을 지나갈 때 여전히 차량에 충격이 있습니다. 추가 점검을 요청드립니다.',
    reporter: '한소율',
    email: 'ssoyl@example.com',
    createdAt: '2026-09-06 10:03',
    status: 'waiting',
    statusLabel: '답변 대기',
    reportId: 6,
    address: '만안구 병목안로 19',
    answer: '',
  },
  {
    id: 7,
    type: 'service',
    typeLabel: '서비스 이용 문의',
    title: '회원가입 시 인증번호가 오지 않습니다.',
    content:
      '회원가입을 진행하면서 이메일 인증번호를 요청했지만 메일이 도착하지 않습니다. 스팸메일함도 확인했습니다.',
    reporter: '오준서',
    email: 'junseo@example.com',
    createdAt: '2026-09-05 15:28',
    status: 'answered',
    statusLabel: '답변 완료',
    reportId: null,
    address: '',
    answer:
      '메일 서버 상황에 따라 인증 메일이 늦게 도착할 수 있습니다. 잠시 후 다시 인증번호를 요청해주시기 바랍니다.',
  },
  {
    id: 8,
    type: 'other',
    typeLabel: '기타 민원',
    title: '특정 도로의 반복적인 파손이 궁금합니다.',
    content:
      '같은 도로에서 계속해서 포트홀이 발생하고 있는 것 같습니다. 근본적인 보수 계획이 있는지 궁금합니다.',
    reporter: '임하은',
    email: 'haeun@example.com',
    createdAt: '2026-09-04 13:17',
    status: 'waiting',
    statusLabel: '답변 대기',
    reportId: null,
    address: '동안구 평촌대로 301',
    answer: '',
  },
];

const STATUS_META = {
  waiting: {
    label: '답변 대기',
    className: 'waiting',
    icon: Clock3,
  },
  answered: {
    label: '답변 완료',
    className: 'answered',
    icon: CheckCircle2,
  },
};

function AdminInquiries() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState(INQUIRIES);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answer, setAnswer] = useState('');

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      waiting: inquiries.filter((inquiry) => inquiry.status === 'waiting').length,
      answered: inquiries.filter((inquiry) => inquiry.status === 'answered').length,
    };
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const matchesSearch =
        !keyword ||
        String(inquiry.id).includes(keyword) ||
        inquiry.title.toLowerCase().includes(keyword) ||
        inquiry.content.toLowerCase().includes(keyword) ||
        inquiry.reporter.toLowerCase().includes(keyword) ||
        inquiry.typeLabel.toLowerCase().includes(keyword);

      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
      const matchesType = typeFilter === 'all' || inquiry.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inquiries, searchKeyword, statusFilter, typeFilter]);

  const openInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAnswer(inquiry.answer || '');
  };

  const closeInquiry = () => {
    setSelectedInquiry(null);
    setAnswer('');
  };

  const handleAnswerSubmit = () => {
    if (!answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === selectedInquiry.id
          ? {
              ...inquiry,
              status: 'answered',
              statusLabel: '답변 완료',
              answer: answer.trim(),
            }
          : inquiry
      )
    );

    setSelectedInquiry((prev) =>
      prev
        ? {
            ...prev,
            status: 'answered',
            statusLabel: '답변 완료',
            answer: answer.trim(),
          }
        : null
    );

    alert('답변이 등록되었습니다.');
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="admin-inquiries-page">
      {/* Main */}
      <main className="admin-inquiries-main">
        {/* Topbar */}
        <header className="admin-inquiries-topbar">
          <div>
            <h1>문의 관리</h1>
            <p>시민 문의 내역을 확인하고 답변을 관리합니다.</p>
          </div>

          <div className="admin-inquiries-date">2026년 9월 9일</div>
        </header>

        <div className="admin-inquiries-content">
          {/* Stats */}
          <section className="admin-inquiries-stats">
            <div className="admin-inquiries-stat-card">
              <div className="admin-inquiries-stat-icon total">
                <MessageSquare size={20} />
              </div>

              <div>
                <span>전체 문의</span>
                <strong>{stats.total}</strong>
              </div>
            </div>

            <div className="admin-inquiries-stat-card">
              <div className="admin-inquiries-stat-icon waiting">
                <Clock3 size={20} />
              </div>

              <div>
                <span>답변 대기</span>
                <strong>{stats.waiting}</strong>
              </div>
            </div>

            <div className="admin-inquiries-stat-card">
              <div className="admin-inquiries-stat-icon answered">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <span>답변 완료</span>
                <strong>{stats.answered}</strong>
              </div>
            </div>
          </section>

          {/* Search / Filter */}
          <section className="admin-inquiries-toolbar">
            <div className="admin-inquiries-search">
              <Search size={18} />

              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="문의 제목, 내용, 문의자, 유형 검색"
              />
            </div>

            <button
              className={`admin-inquiries-filter-button ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <Filter size={17} />
              필터
            </button>
          </section>

          {/* Filter Panel */}
          {filterOpen && (
            <section className="admin-inquiries-filter-panel">
              <div className="admin-inquiries-filter-group">
                <label>답변 상태</label>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">전체 상태</option>
                  <option value="waiting">답변 대기</option>
                  <option value="answered">답변 완료</option>
                </select>
              </div>

              <div className="admin-inquiries-filter-group">
                <label>문의 유형</label>

                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">전체 유형</option>
                  <option value="report">신고 관련 문의</option>
                  <option value="result">처리 결과 문의</option>
                  <option value="service">서비스 이용 문의</option>
                  <option value="other">기타 민원</option>
                </select>
              </div>

              <button className="admin-inquiries-reset-button" onClick={resetFilters}>
                <RotateCcw size={15} />
                필터 초기화
              </button>
            </section>
          )}

          {/* Table */}
          <section className="admin-inquiries-table-card">
            <div className="admin-inquiries-table-header">
              <div>
                <h2>문의 내역</h2>
                <span>총 {filteredInquiries.length}건</span>
              </div>
            </div>

            {filteredInquiries.length > 0 ? (
              <div className="admin-inquiries-table-wrap">
                <table className="admin-inquiries-table">
                  <thead>
                    <tr>
                      <th>문의 번호</th>
                      <th>문의 유형</th>
                      <th>문의 제목</th>
                      <th>문의자</th>
                      <th>작성 일시</th>
                      <th>신고 번호</th>
                      <th>상태</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInquiries.map((inquiry) => {
                      const statusInfo = STATUS_META[inquiry.status];
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr key={inquiry.id} onClick={() => openInquiry(inquiry)}>
                          <td>
                            <span className="admin-inquiries-number">
                              #{String(inquiry.id).padStart(4, '0')}
                            </span>
                          </td>

                          <td>
                            <span className="admin-inquiries-type">
                              {inquiry.typeLabel}
                            </span>
                          </td>

                          <td>
                            <div className="admin-inquiries-title-cell">
                              <strong>{inquiry.title}</strong>
                              <span>{inquiry.content}</span>
                            </div>
                          </td>

                          <td>
                            <div className="admin-inquiries-user-cell">
                              <strong>{inquiry.reporter}</strong>
                              <span>{inquiry.email}</span>
                            </div>
                          </td>

                          <td>
                            <span className="admin-inquiries-date-cell">
                              {inquiry.createdAt}
                            </span>
                          </td>

                          <td>
                            {inquiry.reportId ? (
                              <span className="admin-inquiries-report-number">
                                #{String(inquiry.reportId).padStart(4, '0')}
                              </span>
                            ) : (
                              <span className="admin-inquiries-none">-</span>
                            )}
                          </td>

                          <td>
                            <span
                              className={`admin-inquiries-status ${statusInfo.className}`}
                            >
                              <StatusIcon size={13} />
                              {statusInfo.label}
                            </span>
                          </td>

                          <td>
                            <button
                              className="admin-inquiries-detail-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInquiry(inquiry);
                              }}
                              aria-label="문의 상세 보기"
                            >
                              <ChevronRight size={17} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-inquiries-empty">
                <MessageSquare size={34} />
                <strong>검색 결과가 없습니다.</strong>
                <span>검색어나 필터 조건을 변경해보세요.</span>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="admin-inquiries-modal-backdrop" onClick={closeInquiry}>
          <div className="admin-inquiries-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-inquiries-modal-header">
              <div>
                <span>문의 #{String(selectedInquiry.id).padStart(4, '0')}</span>
                <h2>{selectedInquiry.title}</h2>
              </div>

              <button className="admin-inquiries-modal-close" onClick={closeInquiry}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-inquiries-modal-body">
              {/* Inquiry info */}
              <div className="admin-inquiries-modal-section">
                <div className="admin-inquiries-section-title">
                  <FileText size={17} />
                  문의 정보
                </div>

                <div className="admin-inquiries-info-grid">
                  <div>
                    <span>문의 유형</span>
                    <strong>{selectedInquiry.typeLabel}</strong>
                  </div>

                  <div>
                    <span>문의 상태</span>
                    <strong>
                      <span
                        className={`admin-inquiries-status ${STATUS_META[selectedInquiry.status].className}`}
                      >
                        {React.createElement(
                          STATUS_META[selectedInquiry.status].icon,
                          { size: 13 }
                        )}
                        {STATUS_META[selectedInquiry.status].label}
                      </span>
                    </strong>
                  </div>

                  <div>
                    <span>문의자</span>
                    <strong>{selectedInquiry.reporter}</strong>
                  </div>

                  <div>
                    <span>이메일</span>
                    <strong>{selectedInquiry.email}</strong>
                  </div>

                  <div>
                    <span>작성 일시</span>
                    <strong>{selectedInquiry.createdAt}</strong>
                  </div>

                  <div>
                    <span>관련 신고</span>
                    <strong>
                      {selectedInquiry.reportId
                        ? `신고 #${String(selectedInquiry.reportId).padStart(4, '0')}`
                        : '없음'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Related report */}
              {selectedInquiry.reportId && (
                <div className="admin-inquiries-related-report">
                  <div className="admin-inquiries-related-icon">
                    <FileWarning size={17} />
                  </div>

                  <div>
                    <span>관련 신고 위치</span>
                    <strong>{selectedInquiry.address}</strong>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/admin/reports/detail', {
                        state: {
                          report: {
                            id: selectedInquiry.reportId,
                            address: selectedInquiry.address,
                            reporter: selectedInquiry.reporter,
                            reportedAt: selectedInquiry.createdAt,
                            description: selectedInquiry.content,
                          },
                        },
                      });
                    }}
                  >
                    신고 보기
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="admin-inquiries-modal-section">
                <div className="admin-inquiries-section-title">
                  <MessageSquare size={17} />
                  문의 내용
                </div>

                <div className="admin-inquiries-content-box">
                  {selectedInquiry.content}
                </div>
              </div>

              {/* Answer */}
              <div className="admin-inquiries-modal-section">
                <div className="admin-inquiries-section-title">
                  <Send size={17} />
                  답변 작성
                </div>

                <textarea
                  className="admin-inquiries-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="시민에게 전달할 답변을 입력해주세요."
                  disabled={selectedInquiry.status === 'answered'}
                />

                {selectedInquiry.status === 'answered' && (
                  <p className="admin-inquiries-answer-notice">
                    이미 답변이 등록된 문의입니다.
                  </p>
                )}
              </div>
            </div>

            <div className="admin-inquiries-modal-footer">
              <button className="admin-inquiries-cancel-button" onClick={closeInquiry}>
                닫기
              </button>

              <button
                className="admin-inquiries-answer-button"
                onClick={handleAnswerSubmit}
                disabled={selectedInquiry.status === 'answered'}
              >
                <Send size={16} />
                답변 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInquiries;
