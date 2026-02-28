import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestJson } from '../lib/api';

// ─── Auth hook — fetches /auth/me on mount ───────────────────────────────────
export function useAuth(apiBase, redirectOnUnauth = true, enabled = true) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        if (!enabled) {
            setUser(null);
            setStatus('idle');
            setLoading(false);
            return () => { };
        }
        let mounted = true;
        setLoading(true);
        setStatus('loading');
        (async () => {
            try {
                const data = await requestJson(apiBase, '/auth/me', { method: 'GET' });
                if (mounted) {
                    const resolvedUser = data?.user || data || null;
                    setUser(resolvedUser);
                    setStatus(resolvedUser ? 'authenticated' : 'unauthenticated');
                }
            } catch (err) {
                if (!mounted) return;
                if ((err?.status === 401 || err?.status === 403) && redirectOnUnauth) {
                    setStatus('unauthenticated');
                    const next = encodeURIComponent(location.pathname + (location.search || ''));
                    navigate(`/login?next=${next}`, { replace: true });
                } else if (err?.status === 401 || err?.status === 403) {
                    setStatus('unauthenticated');
                    setUser(null);
                } else {
                    setStatus('backend_unreachable');
                    setUser(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiBase, redirectOnUnauth, enabled]);

    const logout = useCallback(async () => {
        try {
            await requestJson(apiBase, '/auth/logout', { method: 'POST' });
        } catch {
            // ignore — still redirect
        }
        setUser(null);
        setStatus('unauthenticated');
        navigate('/login', { replace: true });
    }, [apiBase, navigate]);

    return { user, loading, logout, status };
}
