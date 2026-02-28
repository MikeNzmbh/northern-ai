function pathFromRequest(req) {
  const parts = Array.isArray(req.query?.path)
    ? req.query.path
    : (req.query?.path ? [req.query.path] : []);
  return `/${parts.join('/')}`;
}

function searchFromRequest(req) {
  const params = new URLSearchParams();
  const query = req.query || {};
  for (const [key, value] of Object.entries(query)) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
      continue;
    }
    if (value == null) continue;
    params.append(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

function json(res, status, body) {
  res.status(status);
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.send(JSON.stringify(body));
}

function copySetCookie(upstream, res) {
  const maybeGetSetCookie = upstream.headers?.getSetCookie;
  if (typeof maybeGetSetCookie === 'function') {
    const cookies = maybeGetSetCookie.call(upstream.headers);
    if (Array.isArray(cookies) && cookies.length > 0) {
      res.setHeader('set-cookie', cookies);
      return;
    }
  }
  const cookie = upstream.headers.get('set-cookie');
  if (cookie) {
    res.setHeader('set-cookie', cookie);
  }
}

function buildProxyHeaders(req, hasBody) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (value == null) continue;
    const lower = String(key).toLowerCase();
    if (lower === 'host' || lower === 'connection' || lower === 'content-length') continue;
    headers.set(lower, String(value));
  }
  if (!hasBody) {
    headers.delete('content-type');
  }
  return headers;
}

function encodeRequestBody(req) {
  if (!req.body || req.method === 'GET' || req.method === 'HEAD') {
    return undefined;
  }
  if (typeof req.body === 'string' || req.body instanceof Uint8Array || req.body instanceof ArrayBuffer) {
    return req.body;
  }
  return JSON.stringify(req.body);
}

function normalizeApiBase(raw) {
  return String(raw || '').trim().replace(/\/+$/, '');
}

async function proxyToHostedAuth(req, res, path) {
  const runtimeEnv = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env)
    ? globalThis.process.env
    : {};
  const base = normalizeApiBase(runtimeEnv.NORTHERN_AUTH_API_BASE || runtimeEnv.VITE_NORTHERN_API_BASE);
  if (!base || !/^https?:\/\//i.test(base)) {
    return false;
  }

  const target = `${base}${path}${searchFromRequest(req)}`;
  const method = String(req.method || 'GET').toUpperCase();
  const body = encodeRequestBody(req);
  const headers = buildProxyHeaders(req, body != null);

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      redirect: 'manual',
    });
  } catch (error) {
    return json(res, 502, {
      detail: 'Hosted auth backend unreachable',
      launcher_only: true,
      message: 'Set NORTHERN_AUTH_API_BASE to a reachable backend URL in Vercel.',
      error: String(error?.message || error),
    });
  }

  res.status(upstream.status);
  const contentType = upstream.headers.get('content-type');
  if (contentType) {
    res.setHeader('content-type', contentType);
  }
  const location = upstream.headers.get('location');
  if (location) {
    res.setHeader('location', location);
  }
  copySetCookie(upstream, res);

  const payload = await upstream.text();
  res.send(payload);
  return true;
}

export default async function handler(req, res) {
  const path = pathFromRequest(req);
  const next = typeof req.query?.next === 'string' ? req.query.next : '/login';

  if (await proxyToHostedAuth(req, res, path)) {
    return;
  }

  if (path.startsWith('/auth/oauth/')) {
    // Public site may run without hosted auth backend. Keep failure graceful.
    // Redirect back to chat launcher with an explicit reason instead of surfacing a gateway error.
    const location = `${next.includes('?') ? next : `${next}?`}launcher_only=1`;
    res.status(307);
    res.setHeader('location', location);
    return res.end();
  }

  // Keep runtime probe deterministic for older clients: public site is reachable,
  // but full chat execution remains local-only.
  if (path === '/health/live' || path === '/health/ready') {
    return json(res, 200, {
      status: 'alive',
      mode: 'public_launcher',
      launcher_only: true,
      message: 'Public website is launcher-only. Start local Northern runtime to chat.',
    });
  }

  if (path === '/auth/public-config') {
    return json(res, 200, {
      signup_enabled: true,
      oauth: {
        google: { enabled: true, start_path: '/auth/oauth/google/start' },
        apple: { enabled: false, start_path: '/auth/oauth/apple/start' },
      },
      auth_mode: 'cookie',
      launcher_only: true,
    });
  }

  if (path === '/auth/me') {
    return json(res, 401, {
      detail: 'Not authenticated',
      launcher_only: true,
      message: 'Use hosted auth backend or local portal to sign in and chat.',
    });
  }

  if (path === '/auth/logout') {
    return json(res, 200, { ok: true, launcher_only: true });
  }

  return json(res, 503, {
    detail: 'Public website is launcher-only.',
    launcher_only: true,
    message: 'Start Northern locally and use the local portal for API/chat actions.',
    path,
    method: req.method,
  });
}
