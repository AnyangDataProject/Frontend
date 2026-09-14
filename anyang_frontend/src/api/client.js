const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function apiRequest(path, { method = 'GET', body, headers } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
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
    const message =
      (typeof data === 'string' ? data : data?.message) ||
      text ||
      `요청이 실패했습니다. (${response.status})`;

    throw new Error(message);
  }

  return data;
}
