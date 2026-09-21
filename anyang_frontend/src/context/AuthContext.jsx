import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { getTokenExpiryMs, isTokenExpired } from '../utils/jwt';
import { getStoredToken } from '../utils/authStorage';
import { setUnauthorizedHandler } from '../api/client';

const MAX_TIMEOUT_MS = 2_147_483_647; // setTimeout이 안전하게 지원하는 최대 지연(약 24.8일)

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
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    otherStorage.removeItem('accessToken');
    otherStorage.removeItem('authUser');

    if (accessToken) storage.setItem('accessToken', accessToken);
    storage.setItem('authUser', JSON.stringify(userInfo));

    setState({ user: userInfo, sessionExpired: false });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(expireSession);
    return () => setUnauthorizedHandler(null);
  }, [expireSession]);

  useEffect(() => {
    if (!user) return;

    const token = getStoredToken();
    const expiryMs = token ? getTokenExpiryMs(token) : null;

    if (!expiryMs) return;

    let timerId;

    const scheduleCheck = () => {
      const remainingMs = Math.max(expiryMs - Date.now(), 0);
      const delay = Math.min(remainingMs, MAX_TIMEOUT_MS);

      timerId = setTimeout(() => {
        if (Date.now() >= expiryMs) {
          expireSession();
        } else {
          scheduleCheck();
        }
      }, delay);
    };

    scheduleCheck();

    return () => clearTimeout(timerId);
  }, [user, expireSession]);

  return (
    <AuthContext.Provider value={{ user, login, logout, sessionExpired, dismissSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}
