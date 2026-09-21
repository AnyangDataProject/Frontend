import { apiRequest } from './client';

export function signup({ email, password, name, phone }) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: { email, password, name, phone },
  });
}

export function login({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
