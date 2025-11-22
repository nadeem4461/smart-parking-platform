// frontend/src/utils/auth.js
export function saveAuth(data) {
  // data: { token, name, role }
  localStorage.setItem('auth', JSON.stringify(data));
}

export function getAuth() {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem('auth');
}

export function isAuthed() {
  return !!getAuth()?.token;
}
