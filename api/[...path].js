function pathFromRequest(req) {
  const parts = Array.isArray(req.query?.path)
    ? req.query.path
    : (req.query?.path ? [req.query.path] : []);
  return `/${parts.join('/')}`;
}

function json(res, status, body) {
  res.status(status);
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.send(JSON.stringify(body));
}

export default function handler(req, res) {
  const path = pathFromRequest(req);
  const next = typeof req.query?.next === 'string' ? req.query.next : '/chat';

  if (path.startsWith('/auth/oauth/')) {
    // Public site is launcher-only; older cached clients may still hit OAuth endpoints.
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
      signup_enabled: false,
      oauth: {
        google: { enabled: false, start_path: '/auth/oauth/google/start' },
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
      message: 'Use your local Northern portal to sign in and chat.',
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
