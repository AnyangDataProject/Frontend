export function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.');
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) return null;

  return payload.exp * 1000;
}

export function isTokenExpired(token) {
  const expiryMs = getTokenExpiryMs(token);

  if (!expiryMs) return false;

  return Date.now() >= expiryMs;
}
