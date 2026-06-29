import { useAuth } from "./store";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(body?.detail || body?.message || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function refreshTokens(): Promise<boolean> {
  const { refreshToken, setTokens, logout } = useAuth.getState();
  if (!refreshToken) return false;
  const r = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!r.ok) {
    logout();
    return false;
  }
  const t = await r.json();
  setTokens(t.access_token, t.refresh_token);
  return true;
}

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: any; auth?: boolean } = {},
  retried = false,
): Promise<T> {
  const { accessToken } = useAuth.getState();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false && accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 401 && !retried && opts.auth !== false) {
    if (await refreshTokens()) return api<T>(path, opts, true);
  }
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

/** Upload a binary blob via multipart. Used for /ai/explain-image. */
export async function apiUploadImage<T = any>(
  path: string,
  uri: string,
  fields: Record<string, string> = {},
): Promise<T> {
  const { accessToken } = useAuth.getState();
  const form = new FormData();
  const filename = uri.split("/").pop() || "scan.jpg";
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  // RN FormData accepts {uri, name, type} for file parts.
  form.append("file", { uri, name: filename, type: `image/${ext === "jpg" ? "jpeg" : ext}` } as any);
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE}${path}`, { method: "POST", headers, body: form as any });
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}
