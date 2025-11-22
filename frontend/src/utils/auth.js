// utils/auth.js

export function saveAuth(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      token: data.token,
      name: data.name,
      role: data.role,
    })
  );
}

export function getAuth() {
  const stored = localStorage.getItem("auth");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthed() {
  const auth = getAuth();
  return !!auth?.token;
}

export function clearAuth() {
  localStorage.removeItem("auth");
}
