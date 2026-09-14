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

function readStoredUser() {
  const token = getStoredToken();

  if (token && isTokenExpired(token)) {
    clearStoredAuth();
    return null;
  }

  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const login = useCallback((data, { rememberMe = false } = {}) => {
    const { accessToken, ...userInfo } = data || {};
    const storage = rememberMe ? localStorage : sessionStorage;

    if (accessToken) storage.setItem('accessToken', accessToken);
    storage.setItem('authUser', JSON.stringify(userInfo));

    setUser(userInfo);
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = getStoredToken();
    const expiryMs = token ? getTokenExpiryMs(token) : null;

    if (!expiryMs) return;

    const remainingMs = Math.max(expiryMs - Date.now(), 0);
    const timerId = setTimeout(logout, remainingMs);

    return () => clearTimeout(timerId);
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
