import { useCallback, useState } from 'react';
import { AuthContext } from './authContext';

function readStoredUser() {
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

  const login = useCallback((data, { rememberMe = false } = {}) => {
    const { accessToken, ...userInfo } = data || {};
    const storage = rememberMe ? localStorage : sessionStorage;

    if (accessToken) storage.setItem('accessToken', accessToken);
    storage.setItem('authUser', JSON.stringify(userInfo));

    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('authUser');

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
