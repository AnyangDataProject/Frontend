import { apiRequest } from './client';

// 백엔드가 비대칭적으로 동작: GET 응답의 status는 소문자(active/suspended)로 내려오지만,
// PUT 요청 바디는 Swagger 문서대로 대문자(ACTIVE/SUSPENDED)가 아니면 400을 반환한다.
const STATUS_FROM_API = { active: 'active', suspended: 'restricted' };
const STATUS_TO_API = { active: 'ACTIVE', restricted: 'SUSPENDED' };

function formatDate(iso) {
  return iso ? iso.slice(0, 10) : null;
}

function mapStatus(rawStatus) {
  const mapped = STATUS_FROM_API[String(rawStatus).toLowerCase()];
  if (mapped) return mapped;
  // 모르는 상태값을 '정상'으로 흘려보내면 실제로 이상이 있는 계정을 놓칠 수 있으므로,
  // 관리자 눈에 띄도록 '이용 제한' 쪽으로 안전하게 처리한다.
  console.warn(`알 수 없는 회원 status 값: ${rawStatus}`);
  return 'restricted';
}

function mapMember(dto) {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    role: String(dto.role ?? '').toLowerCase(),
    joinedAt: formatDate(dto.createdAt),
    lastLogin: formatDate(dto.lastLogin),
    status: mapStatus(dto.status),
    reportCount: dto.reportCount ?? 0,
  };
}

export async function fetchMembers() {
  const users = await apiRequest('/api/admin/users');
  return (users ?? []).map(mapMember);
}

export async function updateMemberStatus(id, status) {
  await apiRequest(`/api/admin/users/${id}/status`, {
    method: 'PUT',
    body: { status: STATUS_TO_API[status] ?? status },
  });
  return { id, status };
}
