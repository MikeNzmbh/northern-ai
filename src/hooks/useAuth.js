import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestJson } from '../lib/api';

// ─── Auth hook — fetches /auth/me on mount ───────────────────────────────────
export function useAuth(apiBase, redirectOnUnauth = true) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await requestJson(apiBase, '/auth/me', { method: 'GET' });
                if (mounted) setUser(data?.user || data || null);
            } catch (err) {
                if (!mounted) return;
                if ((err?.status === 401 || err?.status === 403) && redirectOnUnauth) {
                    const next = encodeURIComponent(location.pathname + (location.search || ''));
                    navigate(`/login?next=${next}`, { replace: true });
                } else {
                    setUser(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiBase, redirectOnUnauth]);

    const logout = useCallback(async () => {
        try {
            await requestJson(apiBase, '/auth/logout', { method: 'POST' });
        } catch {
            // ignore — still redirect
        }
        setUser(null);
        navigate('/login', { replace: true });
    }, [apiBase, navigate]);

    return { user, loading, logout };
}
