import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { decodeJwtPayload } from '../../utils/jwt';

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    const payload = token ? decodeJwtPayload(token) : null;

    if (!token || !payload?.email) {
      navigate('/login', { replace: true });
      return;
    }

    login(
      {
        accessToken: token,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        role: payload.role,
      },
      { rememberMe: true }
    );

    navigate(payload.role === 'ADMIN' ? '/admin' : '/', { replace: true });
  }, [searchParams, login, navigate]);

  return null;
}

export default OAuthCallback;
