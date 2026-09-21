import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

export default function RedirectAdminHome() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
