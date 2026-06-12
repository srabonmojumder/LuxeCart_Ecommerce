/**
 * STATIC build — no backend.
 *
 * This branch ships the storefront design with no server. All data rendering
 * goes through the static `lib/hooks.ts` adapter, so the only callers left here
 * are user-triggered ACTIONS (login, checkout, post review, subscribe, image
 * upload, etc.). Every call rejects with a clear ApiError; those call sites are
 * wrapped in try/catch and surface a toast, so the UI stays a working demo
 * shell without ever hitting the network. The real API client lives on the
 * `backend` branch.
 */

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const DEMO_MESSAGE = 'This is a static demo — the backend is disabled on this build.';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
  _retry?: boolean;
}

// Reject immediately — never touches the network.
export async function apiFetch<T = unknown>(_path: string, _options: RequestOptions = {}): Promise<T> {
  throw new ApiError(503, DEMO_MESSAGE);
}

export async function uploadFile<T = { url: string }>(_path: string, _file: File, _fieldName = 'file'): Promise<T> {
  throw new ApiError(503, DEMO_MESSAGE);
}

export const api = {
  get: <T>(path: string, auth = false) => apiFetch<T>(path, { method: 'GET', auth }),
  post: <T>(path: string, body?: unknown, auth = false) => apiFetch<T>(path, { method: 'POST', body, auth }),
  put: <T>(path: string, body?: unknown, auth = false) => apiFetch<T>(path, { method: 'PUT', body, auth }),
  patch: <T>(path: string, body?: unknown, auth = false) => apiFetch<T>(path, { method: 'PATCH', body, auth }),
  del: <T>(path: string, auth = false) => apiFetch<T>(path, { method: 'DELETE', auth }),
};
