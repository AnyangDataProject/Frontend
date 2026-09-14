import { apiRequest } from './client';

// 백엔드가 비대칭적으로 동작: GET 응답의 status는 소문자(active/suspended)로 내려오지만,
// PUT 요청 바디는 Swagger 문서대로 대문자(ACTIVE/SUSPENDED)가 아니면 400을 반환한다.
const STATUS_FROM_API = { active: 'active', suspended: 'restricted' };
const STATUS_TO_API = { active: 'ACTIVE', restricted: 'SUSPENDED' };

function formatDate(iso) {
  return iso ? iso.slice(0, 10) : null;
}

function mapMember(dto) {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    role: dto.role,
    joinedAt: formatDate(dto.createdAt),
    lastLogin: formatDate(dto.lastLogin),
    status: STATUS_FROM_API[String(dto.status).toLowerCase()] ?? 'active',
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
