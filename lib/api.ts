import { getAccessToken, setAccessToken } from './authToken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean; // attach Authorization header
  _retry?: boolean; // internal: prevents infinite refresh loops
}

// Single-flight refresh so concurrent 401s trigger only one refresh call.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        setAccessToken(data.accessToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth, headers, _retry, ...rest } = options;

  const finalHeaders: Record<string, string> = { ...(headers as Record<string, string>) };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // On an expired access token, refresh once and retry.
  if (res.status === 401 && auth && !_retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, { ...options, _retry: true });
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(res.status, payload?.error || res.statusText, payload?.details);
  }
  return payload as T;
}

/** Upload a single file via multipart/form-data (with one refresh retry on 401). */
export async function uploadFile<T = { url: string }>(path: string, file: File, fieldName = 'file', _retry = false): Promise<T> {
  const token = getAccessToken();
  const fd = new FormData();
  fd.append(fieldName, file);

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
    credentials: 'include',
  });

  if (res.status === 401 && !_retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return uploadFile<T>(path, file, fieldName, true);
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;
  if (!res.ok) throw new ApiError(res.status, payload?.error || res.statusText, payload?.details);
  return payload as T;
}

export const api = {
  get: <T>(path: string, auth = false) => apiFetch<T>(path, { method: 'GET', auth }),
  post: <T>(path: string, body?: unknown, auth = false) => apiFetch<T>(path, { method: 'POST', body, auth }),
  put: <T>(path: string, body?: unknown, auth = false) => apiFetch<T>(path, { method: 'PUT', body, auth }),
  patch: <T>(path: string, body?: unknown, auth = false) => apiFetch<T>(path, { method: 'PATCH', body, auth }),
  del: <T>(path: string, auth = false) => apiFetch<T>(path, { method: 'DELETE', auth }),
};
