import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileWarning,
  Users,
  MessageSquare,
  LogOut,
  Search,
  User,
  Mail,
  CalendarDays,
  FileText,
  ShieldCheck,
  ShieldOff,
  X,
  ChevronRight,
  UserCheck,
  UserX,
} from 'lucide-react';

import './AdminUsers.css';


/* =========================
   목업 사용자 데이터
========================= */

const USERS = [
  {
    id: 1,
    name: '김민준',
    email: 'minjun.kim@example.com',
    phone: '010-1234-5678',
    joinedAt: '2026-08-12',
    status: 'active',
    statusLabel: '정상',
    reportCount: 8,
    lastLogin: '2026-09-09 13:24',
  },
  {
    id: 2,
    name: '이서연',
    email: 'seoyeon.lee@example.com',
    phone: '010-2345-6789',
    joinedAt: '2026-07-28',
    status: 'active',
    statusLabel: '정상',
    reportCount: 5,
    lastLogin: '2026-09-09 10:18',
  },
  {
    id: 3,
    name: '박지훈',
    email: 'jihoon.park@example.com',
    phone: '010-3456-7890',
    joinedAt: '2026-07-15',
    status: 'active',
    statusLabel: '정상',
    reportCount: 3,
    lastLogin: '2026-09-08 18:42',
  },
  {
    id: 4,
    name: '정도윤',
    email: 'doyoon.jung@example.com',
    phone: '010-4567-8901',
    joinedAt: '2026-06-21',
    status: 'suspended',
    statusLabel: '정지',
    reportCount: 1,
    lastLogin: '2026-08-20 09:31',
  },
  {
    id: 5,
    name: '최유리',
    email: 'yuri.choi@example.com',
    phone: '010-5678-9012',
    joinedAt: '2026-06-08',
    status: 'active',
    statusLabel: '정상',
    reportCount: 6,
    lastLogin: '2026-09-07 16:03',
  },
  {
    id: 6,
    name: '한소율',
    email: 'soyul.han@example.com',
    phone: '010-6789-0123',
    joinedAt: '2026-05-17',
    status: 'active',
    statusLabel: '정상',
    reportCount: 2,
    lastLogin: '2026-09-06 11:25',
  },
  {
    id: 7,
    name: '오준서',
    email: 'junseo.oh@example.com',
    phone: '010-7890-1234',
    joinedAt: '2026-04-29',
    status: 'suspended',
    statusLabel: '정지',
    reportCount: 0,
    lastLogin: '2026-07-13 15:20',
  },
  {
    id: 8,
    name: '임하은',
    email: 'haeun.im@example.com',
    phone: '010-8901-2345',
    joinedAt: '2026-04-11',
    status: 'active',
    statusLabel: '정상',
    reportCount: 4,
    lastLogin: '2026-09-05 20:12',
  },
  {
    id: 9,
    name: '강현우',
    email: 'hyunwoo.kang@example.com',
    phone: '010-9012-3456',
    joinedAt: '2026-03-24',
    status: 'active',
    statusLabel: '정상',
    reportCount: 7,
    lastLogin: '2026-09-04 14:32',
  },
  {
    id: 10,
    name: '윤지민',
    email: 'jimin.yoon@example.com',
    phone: '010-0123-4567',
    joinedAt: '2026-02-18',
    status: 'active',
    statusLabel: '정상',
    reportCount: 2,
    lastLogin: '2026-09-03 09:47',
  },
];


/* =========================
   상태 메타
========================= */

const STATUS_META = {
  active: {
    label: '정상',
    className: 'active',
    icon: UserCheck,
  },
  suspended: {
    label: '정지',
    className: 'suspended',
    icon: UserX,
  },
};


function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(USERS);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);


  /* =========================
     통계
  ========================== */

  const stats = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => user.status === 'active'
    ).length;

    const suspended = users.filter(
      (user) => user.status === 'suspended'
    ).length;

    const recent = users.filter(
      (user) => user.joinedAt >= '2026-08-01'
    ).length;

    return {
      total,
      active,
      suspended,
      recent,
    };
  }, [users]);


  /* =========================
     검색 / 필터
  ========================== */

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return users.filter((user) => {
      const matchesStatus =
        statusFilter === 'all' ||
        user.status === statusFilter;

      const matchesSearch =
        !keyword ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [users, searchKeyword, statusFilter]);


  /* =========================
     계정 상태 변경
  ========================== */

  const handleStatusChange = (id, nextStatus) => {
    const nextStatusLabel =
      STATUS_META[nextStatus].label;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: nextStatus,
              statusLabel: nextStatusLabel,
            }
          : user
      )
    );

    setSelectedUser((prev) =>
      prev
        ? {
            ...prev,
            status: nextStatus,
            statusLabel: nextStatusLabel,
          }
        : null
    );
  };


  /* =========================
     로그아웃
  ========================== */

  const handleLogout = () => {
    navigate('/login');
  };


  return (
    <div className="admin-users-page">



      {/* =========================
          메인
      ========================== */}

      <main className="admin-users-content">

        {/* 상단 */}
        <header className="admin-users-topbar">

          <div>
            <h1>시민 계정 관리</h1>

            <p>
              안양시 시민안전 서비스에 가입한
              시민 계정을 관리합니다.
            </p>
          </div>

          <div className="admin-users-date">
            2026년 9월 9일
          </div>

        </header>


        {/* =========================
            통계 카드
        ========================== */}

        <section className="admin-users-stats">

          <div className="admin-users-stat-card">

            <div className="admin-users-stat-icon blue">
              <Users size={19} />
            </div>

            <div>
              <span>전체 시민</span>
              <strong>{stats.total}</strong>
            </div>

          </div>


          <div className="admin-users-stat-card">

            <div className="admin-users-stat-icon green">
              <UserCheck size={19} />
            </div>

            <div>
              <span>정상 계정</span>
              <strong>{stats.active}</strong>
            </div>

          </div>


          <div className="admin-users-stat-card">

            <div className="admin-users-stat-icon red">
              <UserX size={19} />
            </div>

            <div>
              <span>정지 계정</span>
              <strong>{stats.suspended}</strong>
            </div>

          </div>


          <div className="admin-users-stat-card">

            <div className="admin-users-stat-icon purple">
              <UserCheck size={19} />
            </div>

            <div>
              <span>최근 가입자</span>
              <strong>{stats.recent}</strong>
            </div>

          </div>

        </section>


        {/* =========================
            사용자 목록
        ========================== */}

        <section className="admin-users-card">

          {/* 헤더 */}
          <div className="admin-users-card-header">

            <div>
              <h2>시민 계정 목록</h2>

              <p>
                총 {filteredUsers.length}명의 시민이 조회되었습니다.
              </p>
            </div>


            {/* 검색 */}
            <div className="admin-users-search">

              <Search size={17} />

              <input
                type="text"
                value={searchKeyword}
                onChange={(e) =>
                  setSearchKeyword(e.target.value)
                }
                placeholder="이름, 이메일, 전화번호 검색"
              />

            </div>

          </div>


          {/* 필터 */}
          <div className="admin-users-filter">

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
                statusFilter === 'active'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('active')
              }
            >
              정상
            </button>


            <button
              className={
                statusFilter === 'suspended'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('suspended')
              }
            >
              정지
            </button>

          </div>


          {/* 테이블 */}
          <div className="admin-users-table-wrap">

            <table className="admin-users-table">

              <thead>
                <tr>
                  <th>시민</th>
                  <th>이메일</th>
                  <th>가입일</th>
                  <th>신고 건수</th>
                  <th>최근 로그인</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>


              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {

                    const statusInfo =
                      STATUS_META[user.status];

                    const StatusIcon =
                      statusInfo.icon;

                    return (
                      <tr
                        key={user.id}
                        onClick={() =>
                          setSelectedUser(user)
                        }
                      >

                        {/* 시민 */}
                        <td>

                          <div className="admin-user-name">

                            <div className="admin-user-avatar">
                              {user.name.charAt(0)}
                            </div>

                            <div>
                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                시민 #{String(user.id).padStart(4, '0')}
                              </span>
                            </div>

                          </div>

                        </td>


                        {/* 이메일 */}
                        <td>
                          <span className="admin-user-email">
                            {user.email}
                          </span>
                        </td>


                        {/* 가입일 */}
                        <td>
                          {user.joinedAt}
                        </td>


                        {/* 신고 */}
                        <td>

                          <span className="admin-user-report-count">
                            {user.reportCount}건
                          </span>

                        </td>


                        {/* 최근 로그인 */}
                        <td>
                          <span className="admin-user-login">
                            {user.lastLogin}
                          </span>
                        </td>


                        {/* 상태 */}
                        <td>

                          <span
                            className={`admin-user-status ${statusInfo.className}`}
                          >
                            <StatusIcon size={13} />
                            {statusInfo.label}
                          </span>

                        </td>


                        {/* 상세 */}
                        <td>

                          <button
                            className="admin-user-more"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
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
                      colSpan="7"
                      className="admin-users-empty"
                    >
                      <Users size={30} />

                      <strong>
                        검색 결과가 없습니다.
                      </strong>

                      <span>
                        검색어나 필터를 변경해보세요.
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
          사용자 상세 모달
      ========================== */}

      {selectedUser && (

        <div
          className="admin-user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="admin-user-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* 모달 헤더 */}
            <div className="admin-user-modal-header">

              <div>
                <span>시민 계정 상세</span>

                <strong>
                  #{String(selectedUser.id).padStart(4, '0')}
                </strong>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>

            </div>


            {/* 사용자 프로필 */}
            <div className="admin-user-modal-profile">

              <div className="admin-user-modal-avatar">
                {selectedUser.name.charAt(0)}
              </div>

              <div>
                <h2>{selectedUser.name}</h2>

                <p>
                  {selectedUser.email}
                </p>

                <span
                  className={`admin-user-status ${STATUS_META[selectedUser.status].className}`}
                >
                  {selectedUser.statusLabel}
                </span>
              </div>

            </div>


            {/* 정보 */}
            <div className="admin-user-detail-list">

              <div className="admin-user-detail-row">

                <div>
                  <User size={16} />
                  이름
                </div>

                <strong>
                  {selectedUser.name}
                </strong>

              </div>


              <div className="admin-user-detail-row">

                <div>
                  <Mail size={16} />
                  이메일
                </div>

                <strong>
                  {selectedUser.email}
                </strong>

              </div>


              <div className="admin-user-detail-row">

                <div>
                  <User size={16} />
                  전화번호
                </div>

                <strong>
                  {selectedUser.phone}
                </strong>

              </div>


              <div className="admin-user-detail-row">

                <div>
                  <CalendarDays size={16} />
                  가입일
                </div>

                <strong>
                  {selectedUser.joinedAt}
                </strong>

              </div>


              <div className="admin-user-detail-row">

                <div>
                  <FileText size={16} />
                  신고 건수
                </div>

                <strong>
                  {selectedUser.reportCount}건
                </strong>

              </div>


              <div className="admin-user-detail-row">

                <div>
                  <ShieldCheck size={16} />
                  최근 로그인
                </div>

                <strong>
                  {selectedUser.lastLogin}
                </strong>

              </div>

            </div>


            {/* 계정 상태 */}
            <div className="admin-user-modal-status">

              <h3>계정 상태 관리</h3>

              <div className="admin-user-status-actions">

                <button
                  className={
                    selectedUser.status === 'active'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    handleStatusChange(
                      selectedUser.id,
                      'active'
                    )
                  }
                >
                  <ShieldCheck size={16} />
                  정상 계정
                </button>


                <button
                  className={
                    selectedUser.status === 'suspended'
                      ? 'suspended-active'
                      : ''
                  }
                  onClick={() =>
                    handleStatusChange(
                      selectedUser.id,
                      'suspended'
                    )
                  }
                >
                  <ShieldOff size={16} />
                  계정 정지
                </button>

              </div>

            </div>


            {/* 하단 */}
            <div className="admin-user-modal-footer">

              <button
                className="admin-user-modal-close"
                onClick={() => setSelectedUser(null)}
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

export default AdminUsers;