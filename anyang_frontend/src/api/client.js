import { getStoredToken } from '../utils/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

// 서버가 토큰을 거부(401)했는데 클라이언트 쪽 exp는 아직 남아 있는 경우(토큰 폐기, 서명키 교체 등)
// 로그인 상태로 계속 남지 않도록 AuthProvider가 세션 만료 처리를 등록해 둔다.
// 403은 역할 제한(시민이 관리자 API 호출 등)이라 세션 만료로 보지 않는다.
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function notifyIfUnauthorized(response, sentToken) {
  // 토큰 없이 보낸 요청(로그인 실패 등)이거나, 그 사이 다른 토큰으로 다시 로그인한 경우는 제외
  if (response.status === 401 && sentToken && getStoredToken() === sentToken) {
    unauthorizedHandler?.();
  }
}

export async function apiRequest(path, { method = 'GET', body, headers } = {}) {
  let response;
  const token = getStoredToken();

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    notifyIfUnauthorized(response, token);
    const message =
      (typeof data === 'string' ? data : data?.message) ||
      text ||
      `요청이 실패했습니다. (${response.status})`;

    throw new Error(message);
  }

  return data;
}

export async function apiRequestMultipart(path, { method = 'POST', formData, headers } = {}) {
  let response;
  const token = getStoredToken();

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        // Content-Type은 지정하지 않는다 — 브라우저가 boundary 포함해서 자동으로 설정
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: formData,
    });
  } catch {
    throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // 신고 등록은 Long(ID)을 그냥 숫자로 반환하므로 텍스트일 수 있음
    }
  }

  if (!response.ok) {
    notifyIfUnauthorized(response, token);
    const message =
      (typeof data === 'string' ? data : data?.message) ||
      `요청이 실패했습니다. (${response.status})`;
    throw new Error(message);
  }

  return data;
}