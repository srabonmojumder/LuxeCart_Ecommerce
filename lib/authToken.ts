// Tiny module that holds the JWT access token in memory + localStorage.
// Kept separate from the auth store and the API client to avoid circular imports.
const STORAGE_KEY = 'luxecart-access-token';

let accessToken: string | null = null;

if (typeof window !== 'undefined') {
  accessToken = window.localStorage.getItem(STORAGE_KEY);
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(STORAGE_KEY, token);
  else window.localStorage.removeItem(STORAGE_KEY);
}
