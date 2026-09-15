export function getStoredToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}
