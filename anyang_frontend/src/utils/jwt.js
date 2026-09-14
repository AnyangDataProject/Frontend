export function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.');
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const json = new TextDecoder('utf-8').decode(bytes);

    return JSON.parse(json);
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
