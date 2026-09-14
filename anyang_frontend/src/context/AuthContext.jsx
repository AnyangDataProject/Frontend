import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { getTokenExpiryMs, isTokenExpired } from '../utils/jwt';

function getStoredToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

function clearStoredAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authUser');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('authUser');
}

function getInitialAuthState() {
  const token = getStoredToken();

  if (token && isTokenExpired(token)) {
    clearStoredAuth();
    return { user: null, sessionExpired: true };
  }

  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  let user = null;

  if (raw) {
    try {
      user = JSON.parse(raw);
    } catch {
      user = null;
    }
  }

  return { user, sessionExpired: false };
}

export function AuthProvider({ children }) {
  const [{ user, sessionExpired }, setState] = useState(getInitialAuthState);

  const logout = useCallback(() => {
    clearStoredAuth();
    setState({ user: null, sessionExpired: false });
  }, []);

  const expireSession = useCallback(() => {
    clearStoredAuth();
    setState({ user: null, sessionExpired: true });
  }, []);

  const dismissSessionExpired = useCallback(() => {
    setState((prev) => ({ ...prev, sessionExpired: false }));
  }, []);

  const login = useCallback((data, { rememberMe = false } = {}) => {
    const { accessToken, ...userInfo } = data || {};
    const storage = rememberMe ? localStorage : sessionStorage;

    if (accessToken) storage.setItem('accessToken', accessToken);
    storage.setItem('authUser', JSON.stringify(userInfo));

    setState({ user: userInfo, sessionExpired: false });
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = getStoredToken();
    const expiryMs = token ? getTokenExpiryMs(token) : null;

    if (!expiryMs) return;

    const remainingMs = Math.max(expiryMs - Date.now(), 0);
    const timerId = setTimeout(expireSession, remainingMs);

    return () => clearTimeout(timerId);
  }, [user, expireSession]);

  return (
    <AuthContext.Provider value={{ user, login, logout, sessionExpired, dismissSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}
