import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requireSupabaseClient, supabaseConfigured } from '../lib/supabaseClient';

// ─── Auth hook — Supabase session source of truth ─────────────────────────────
export function useAuth(_apiBase, redirectOnUnauth = true, enabled = true) {
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
        if (!supabaseConfigured) {
            setUser(null);
            setStatus('unconfigured');
            setLoading(false);
            return () => { };
        }

        const client = requireSupabaseClient();
        let mounted = true;
        setLoading(true);
        setStatus('loading');
        void (async () => {
            const { data } = await client.auth.getSession();
            if (!mounted) return;
            const resolvedUser = data?.session?.user || null;
            setUser(resolvedUser);
            setStatus(resolvedUser ? 'authenticated' : 'unauthenticated');
            setLoading(false);
            if (!resolvedUser && redirectOnUnauth) {
                const next = encodeURIComponent(location.pathname + (location.search || ''));
                navigate(`/login?next=${next}`, { replace: true });
            }
        })();

        const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            const resolvedUser = session?.user || null;
            setUser(resolvedUser);
            setStatus(resolvedUser ? 'authenticated' : 'unauthenticated');
            setLoading(false);
            if (!resolvedUser && redirectOnUnauth) {
                const next = encodeURIComponent(location.pathname + (location.search || ''));
                navigate(`/login?next=${next}`, { replace: true });
            }
        });

        return () => {
            mounted = false;
            subscription?.subscription?.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redirectOnUnauth, enabled]);

    const logout = useCallback(async () => {
        if (supabaseConfigured) {
            const client = requireSupabaseClient();
            await client.auth.signOut();
        }
        setUser(null);
        setStatus('unauthenticated');
        navigate('/login', { replace: true });
    }, [navigate]);

    return { user, loading, logout, status };
}
